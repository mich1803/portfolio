export type ContentLanguage = "en" | "it";

export function getContentLanguage(data: any): ContentLanguage {
    return data?.language === "it" ? "it" : "en";
}
