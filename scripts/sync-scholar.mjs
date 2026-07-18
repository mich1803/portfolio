import { existsSync } from "node:fs";
import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const configPath = path.join(root, "src", "data", "scholar-publications.json");
const publicationsRoot = path.join(root, "src", "content", "publications");
const profileBaseUrl = "https://scholar.google.com/citations";

function loadLocalEnv() {
    const envPath = path.join(root, ".env");
    if (!existsSync(envPath)) return;

    return readFile(envPath, "utf8").then((content) => {
        for (const rawLine of content.split(/\r?\n/)) {
            const line = rawLine.trim();
            if (!line || line.startsWith("#")) continue;

            const separator = line.indexOf("=");
            if (separator === -1) continue;

            const name = line.slice(0, separator).trim();
            let value = line.slice(separator + 1).trim();
            if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                value = value.slice(1, -1);
            }

            if (!process.env[name]) process.env[name] = value;
        }
    });
}

function slugify(value) {
    return value
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 100) || "publication";
}

function publicationKey(article) {
    const year = String(article.year || "unknown-year").trim();
    return `${slugify(article.title || "publication")}-${slugify(year)}`;
}

function yamlString(value) {
    return JSON.stringify(String(value ?? ""));
}

function yamlType(value) {
    return value === false ? "false" : yamlString(value);
}

function normalizeAuthors(authors) {
    if (Array.isArray(authors)) {
        return authors.map((author) => typeof author === "string" ? author : author?.name).filter(Boolean).join(", ");
    }
    return String(authors || "");
}

function normalizeCitations(citedBy) {
    const value = typeof citedBy === "object" ? citedBy?.value ?? citedBy?.total : citedBy;
    const citations = Number(value || 0);
    return Number.isFinite(citations) && citations >= 0 ? Math.trunc(citations) : 0;
}

function compactText(value) {
    return String(value || "").replace(/\s+/g, " ").trim();
}

function summarize(value, maxLength = 240) {
    const text = compactText(value);
    if (text.length <= maxLength) return text;
    return `${text.slice(0, maxLength - 3).trimEnd()}...`;
}

function frontmatterValue(markdown, field) {
    const match = markdown.match(new RegExp(`^${field}:\\s*(.+)$`, "m"));
    if (!match) return undefined;

    const rawValue = match[1].trim();
    if (rawValue.startsWith('"') || rawValue.startsWith("'")) {
        try {
            return JSON.parse(rawValue);
        } catch {
            return rawValue.slice(1, -1);
        }
    }
    return rawValue;
}

async function readExistingPublications() {
    const entries = await readdir(publicationsRoot, { withFileTypes: true });
    const keys = new Set();
    const scholarIds = new Set();
    const fileNames = new Set();

    for (const entry of entries) {
        if (!entry.isFile() || !entry.name.endsWith(".md")) continue;
        fileNames.add(entry.name);

        const markdown = await readFile(path.join(publicationsRoot, entry.name), "utf8");
        const key = frontmatterValue(markdown, "publication_key");
        const scholarId = frontmatterValue(markdown, "scholar_id");
        if (key) keys.add(key);
        if (scholarId) scholarIds.add(scholarId);
    }

    return { keys, scholarIds, fileNames };
}

function renderPublication(article, details, config) {
    const key = publicationKey(article);
    const override = config.publications[key] || {};
    const year = String(article.year || details.publication_date || "").match(/\d{4}/)?.[0];
    const authors = override.author || compactText(details.authors) || normalizeAuthors(article.authors);
    const journal = override.journal || compactText(details.journal || details.publication) || compactText(article.publication);
    const link = override.external_url || details.link || article.link || `${profileBaseUrl}?user=${config.authorId}&hl=${config.language}`;
    const abstract = compactText(override.abstract || details.description || article.snippet) || "No abstract was provided by Google Scholar.";
    const description = override.description || summarize(abstract);
    const tags = Array.isArray(override.tags) ? override.tags : [];
    const citations = normalizeCitations(details.total_citations ?? article.cited_by);
    const type = Object.hasOwn(override, "type") ? override.type : false;

    const lines = [
        "---",
        `title: ${yamlString(article.title)}`,
        authors ? `author: ${yamlString(authors)}` : null,
        year ? `date: ${yamlString(`${year}-01-01`)}` : null,
        journal ? `journal: ${yamlString(journal)}` : null,
        `description: ${yamlString(description)}`,
        `abstract: ${yamlString(abstract)}`,
        `external_url: ${yamlString(link)}`,
        ...(tags.length > 0 ? ["tags:", ...tags.map((tag) => `  - ${yamlString(tag)}`)] : []),
        `type: ${yamlType(type)}`,
        `publication_key: ${yamlString(key)}`,
        article.citation_id ? `scholar_id: ${yamlString(article.citation_id)}` : null,
        `cited_by: ${citations}`,
        'source: "google-scholar"',
        "---",
        "",
    ].filter((line) => line !== null);

    return { key, markdown: lines.join("\n") };
}

async function requestJson(parameters, apiKey) {
    const url = new URL("https://serpapi.com/search.json");
    url.search = new URLSearchParams({ ...parameters, api_key: apiKey }).toString();

    const response = await fetch(url, { signal: AbortSignal.timeout(30_000) });
    if (!response.ok) throw new Error(`SerpAPI returned HTTP ${response.status}`);

    const data = await response.json();
    if (data.error) throw new Error(data.error);
    return data;
}

async function fetchArticles(config, apiKey) {
    const allArticles = [];
    const pageSize = 100;

    for (let page = 0; page < 10; page += 1) {
        const data = await requestJson({
            engine: "google_scholar_author",
            author_id: config.authorId,
            hl: config.language || "en",
            sort: config.sort || "pubdate",
            num: String(pageSize),
            start: String(page * pageSize),
        }, apiKey);

        const articles = Array.isArray(data.articles) ? data.articles : [];
        allArticles.push(...articles);
        if (articles.length < pageSize) break;
    }

    const deduplicated = new Map();
    for (const article of allArticles) {
        if (!article?.title) continue;
        const identifier = article.citation_id || `${article.title}|${article.year || ""}`;
        deduplicated.set(identifier, article);
    }

    return [...deduplicated.values()];
}

async function fetchArticleDetails(config, apiKey, article) {
    if (!article.citation_id) return {};

    const data = await requestJson({
        engine: "google_scholar_author",
        author_id: config.authorId,
        hl: config.language || "en",
        view_op: "view_citation",
        citation_id: article.citation_id,
    }, apiKey);

    return data.citation || {};
}

async function main() {
    await loadLocalEnv();

    const config = JSON.parse(await readFile(configPath, "utf8"));
    config.publications ||= {};

    const apiKey = process.env.SERPAPI_KEY;
    if (!apiKey || apiKey === "your_serpapi_key_here") {
        console.log("[scholar] SERPAPI_KEY is not set; using cached publication files.");
        return;
    }

    let articles;
    try {
        articles = await fetchArticles(config, apiKey);
    } catch (error) {
        console.warn(`[scholar] Sync failed; using cached publication files. ${error.message}`);
        return;
    }

    if (articles.length === 0) {
        console.warn("[scholar] No publications were returned; cached publication files were kept.");
        return;
    }

    const existing = await readExistingPublications();
    let configChanged = false;
    let added = 0;
    let unchanged = 0;

    for (const article of articles) {
        const key = publicationKey(article);
        const fileName = `scholar-${key}.md`;

        if (existing.keys.has(key) || existing.fileNames.has(fileName) || (article.citation_id && existing.scholarIds.has(article.citation_id))) {
            unchanged += 1;
            continue;
        }

        if (!config.publications[key]) {
            config.publications[key] = { type: false };
            configChanged = true;
        }

        let details = {};
        try {
            details = await fetchArticleDetails(config, apiKey, article);
        } catch (error) {
            console.warn(`[scholar] Could not fetch details for "${article.title}": ${error.message}`);
        }

        const rendered = renderPublication(article, details, config);
        try {
            await writeFile(path.join(publicationsRoot, fileName), rendered.markdown, { encoding: "utf8", flag: "wx" });
            existing.keys.add(key);
            existing.fileNames.add(fileName);
            if (article.citation_id) existing.scholarIds.add(article.citation_id);
            added += 1;
        } catch (error) {
            if (error.code === "EEXIST") {
                unchanged += 1;
                continue;
            }
            throw error;
        }
    }

    if (configChanged) {
        await writeFile(configPath, `${JSON.stringify(config, null, 2)}\n`, "utf8");
    }

    console.log(`[scholar] Added ${added} new publication(s); left ${unchanged} existing publication(s) unchanged.`);
}

main().catch((error) => {
    console.error(`[scholar] Unexpected error: ${error.stack || error.message}`);
    process.exitCode = 1;
});
