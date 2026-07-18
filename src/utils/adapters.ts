import type { ListingItem, DetailItem } from "../types";
import { getPublicationType } from "./publications";

function formatDate(dateValue: string | Date | undefined): string | undefined {
    if (!dateValue) return undefined;
    const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
    if (isNaN(date.getTime())) return undefined;
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
}

export function getListingItem(entry: any, collection?: string): ListingItem {
    const d = entry.data;
    const publicationType = collection === "publications" ? getPublicationType(entry) : undefined;
    const tags = [
        ...(typeof publicationType === "string" && publicationType ? [publicationType] : []),
        ...(d.tags || []),
    ];
    
    return {
        title: d.title,
        description: d.description,
        date: formatDate(d.date),
        authors: d.author,
        extraInput: d.journal || d.event || d.institution,
        tags: [...new Set(tags)],
        externalUrl: d.external_url,
        image: d.image,
    };
}

export function getDetailItem(entry: any, collection: string): DetailItem {
    const listing = getListingItem(entry, collection);
    
    return {
        ...listing,
        backHref: collection === 'posts' ? '/posts' : `/${collection}`,
    };
}