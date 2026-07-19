import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { copyFile, mkdir, mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const syncScript = path.join(repositoryRoot, "scripts", "sync-scholar.mjs");

test("Scholar synchronization only updates citations and creates hidden publications with abstracts", async () => {
    const fixtureRoot = await mkdtemp(path.join(tmpdir(), "scholar-sync-"));

    try {
        const fixtureScripts = path.join(fixtureRoot, "scripts");
        const fixtureData = path.join(fixtureRoot, "src", "data");
        const fixturePublications = path.join(fixtureRoot, "src", "content", "publications");
        await Promise.all([
            mkdir(fixtureScripts, { recursive: true }),
            mkdir(fixtureData, { recursive: true }),
            mkdir(fixturePublications, { recursive: true }),
        ]);

        const fixtureSyncScript = path.join(fixtureScripts, "sync-scholar.mjs");
        await copyFile(syncScript, fixtureSyncScript);

        const config = {
            authorId: "mock-author",
            language: "en",
            sort: "pubdate",
            publications: {
                "manually-curated-entry": {
                    type: "Journal Publication",
                    description: "Preserve this configuration exactly.",
                },
            },
        };
        await writeFile(
            path.join(fixtureData, "scholar-publications.json"),
            `${JSON.stringify(config, null, 2)}\n`,
            "utf8",
        );

        const existingFiles = new Map([
            [
                "manual-scholar-id.md",
                "---\r\ntitle: \"Existing by Scholar ID\"\r\nscholar_id: \"existing-scholar-id\"\r\ncited_by: 2\r\n---\r\n\r\nManually curated body.\r\n",
            ],
            [
                "manual-publication-key.md",
                "---\ntitle: \"Existing by publication key\"\npublication_key: \"existing-by-key-2024\"\ncited_by: 4\n---\n\nKeep this body byte-for-byte.\n",
            ],
            [
                "scholar-existing-by-filename-2023.md",
                "---\ntitle: \"Existing by filename\"\n---\n\nFilename-only match.\n",
            ],
        ]);

        for (const [fileName, contents] of existingFiles) {
            await writeFile(path.join(fixturePublications, fileName), contents, "utf8");
        }

        const articles = [
            {
                title: "Renamed existing Scholar item",
                year: "2020",
                citation_id: "existing-scholar-id",
                cited_by: { value: 5 },
            },
            {
                title: "Existing by Key",
                year: "2024",
                citation_id: "key-match-has-a-different-id",
                cited_by: { value: 4 },
            },
            {
                title: "Existing by Filename",
                year: "2023",
                citation_id: "filename-match-has-a-different-id",
                cited_by: { value: 3 },
            },
            {
                title: "A Brand New Result",
                year: "2026",
                citation_id: "new-scholar-id",
                authors: ["Michele Magrini", "Example Collaborator"],
                publication: "Mock Conference 2026",
                link: "https://example.test/new-result",
            },
        ];
        const abstract = "A mocked abstract supplied by the citation details endpoint.";
        const mockModule = path.join(fixtureRoot, "mock-fetch.mjs");
        await writeFile(
            mockModule,
            `const articles = ${JSON.stringify(articles)};\n` +
            `const citation = ${JSON.stringify({
                authors: "Michele Magrini, Example Collaborator",
                publication_date: "2026",
                journal: "Mock Conference 2026",
                description: abstract,
                link: "https://example.test/new-result",
                total_citations: 7,
            })};\n` +
            `globalThis.fetch = async (input) => {\n` +
            `  const url = new URL(input);\n` +
            `  const payload = url.searchParams.get("view_op") === "view_citation" ? { citation } : { articles };\n` +
            `  return new Response(JSON.stringify(payload), { status: 200, headers: { "content-type": "application/json" } });\n` +
            `};\n`,
            "utf8",
        );

        const result = spawnSync(
            process.execPath,
            ["--import", pathToFileURL(mockModule).href, fixtureSyncScript],
            {
                cwd: fixtureRoot,
                encoding: "utf8",
                env: { ...process.env, SERPAPI_KEY: "mock-key" },
            },
        );

        assert.equal(result.status, 0, result.stderr || result.stdout);
        assert.match(result.stdout, /Added 1 new publication\(s\); updated citations for 2 existing publication\(s\); left 1 existing publication\(s\) unchanged\./);

        for (const [fileName, before] of existingFiles) {
            const after = await readFile(path.join(fixturePublications, fileName), "utf8");
            if (fileName === "manual-scholar-id.md") {
                assert.equal(after, before.replace("cited_by: 2", "cited_by: 5"));
            } else if (fileName === "scholar-existing-by-filename-2023.md") {
                assert.equal(after, before.replace("\n---\n\n", "\ncited_by: 3\n---\n\n"));
            } else {
                assert.equal(after, before, `${fileName} changed despite an identical citation count`);
            }
        }

        const newKey = "a-brand-new-result-2026";
        const newFile = await readFile(path.join(fixturePublications, `scholar-${newKey}.md`), "utf8");
        assert.match(newFile, new RegExp(`abstract: ${JSON.stringify(abstract).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`));
        assert.match(newFile, /^type: false$/m);
        assert.match(newFile, /^scholar_id: "new-scholar-id"$/m);

        const publicationFiles = (await readdir(fixturePublications)).filter((name) => name.endsWith(".md"));
        assert.equal(publicationFiles.length, existingFiles.size + 1);

        const updatedConfig = JSON.parse(await readFile(path.join(fixtureData, "scholar-publications.json"), "utf8"));
        assert.deepEqual(updatedConfig.publications["manually-curated-entry"], config.publications["manually-curated-entry"]);
        assert.deepEqual(updatedConfig.publications[newKey], { type: false });
    } finally {
        await rm(fixtureRoot, { recursive: true, force: true });
    }
});
