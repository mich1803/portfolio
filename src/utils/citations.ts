interface PublicationCitationData {
    title: string;
    author?: string;
    date?: string;
    journal?: string;
    external_url?: string;
    type?: string | false;
}

function escapeBibTeX(value: string): string {
    return value
        .replace(/\\/g, "\\textbackslash{}")
        .replace(/([{}%&#_$])/g, "\\$1")
        .replace(/~/g, "\\textasciitilde{}")
        .replace(/\^/g, "\\textasciicircum{}");
}

function citationKey(data: PublicationCitationData): string {
    const firstAuthor = data.author?.split(",")[0]?.trim() || "publication";
    const surname = firstAuthor.split(/\s+/).at(-1) || "publication";
    const year = data.date?.match(/^\d{4}/)?.[0] || "nd";
    const titleWord = data.title.match(/[\p{L}\p{N}]+/u)?.[0] || "work";

    return `${surname}${year}${titleWord}`
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9]/g, "")
        .toLowerCase();
}

export function createPublicationBibtex(data: PublicationCitationData): string {
    const publicationType = typeof data.type === "string" ? data.type.toLowerCase() : "";
    const entryType = publicationType.includes("journal")
        ? "article"
        : publicationType.includes("conference")
          ? "inproceedings"
          : "misc";
    const venueField = entryType === "article" ? "journal" : "booktitle";
    const authors = data.author
        ?.split(",")
        .map((author) => author.trim())
        .filter(Boolean)
        .join(" and ");
    const year = data.date?.match(/^\d{4}/)?.[0];
    const fields = [
        authors && ["author", authors],
        ["title", data.title],
        data.journal && [venueField, data.journal],
        year && ["year", year],
        data.external_url && ["url", data.external_url],
    ].filter(Boolean) as Array<[string, string]>;

    const body = fields
        .map(([name, value]) => `  ${name} = {${escapeBibTeX(value)}}`)
        .join(",\n");

    return `@${entryType}{${citationKey(data)},\n${body}\n}`;
}
