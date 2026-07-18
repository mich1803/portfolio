import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { SITE, PAGES } from "../config";
import { isPublicationVisible } from "../utils/publications";
import { withBase } from "../utils/paths";

export async function GET(context: any) {
    const publications = PAGES.publications.isActive !== false ? await getCollection("publications") : [];
    const site = new URL(withBase("/"), context.site || SITE.website);

    const items = publications
        .filter(isPublicationVisible)
        .map((pub: any) => ({
            title: `[Publication] ${pub.data.title}`,
            pubDate: pub.data.date,
            description: pub.data.description || `Published in ${pub.data.journal || 'Journal'}`,
            link: withBase(`/publications/${pub.id}/`),
        }))
        .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

    return rss({
        title: SITE.title,
        description: SITE.desc,
        site,
        items,
    });
}
