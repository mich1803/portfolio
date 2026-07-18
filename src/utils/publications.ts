import scholarConfig from "../data/scholar-publications.json";

type PublicationOverride = {
    visible?: boolean;
    type?: false | string;
};

type ScholarConfig = {
    publications?: Record<string, PublicationOverride>;
};

const publicationOverrides = (scholarConfig as ScholarConfig).publications || {};

function getOverride(entry: any): PublicationOverride | undefined {
    const publicationKey = entry.data?.publication_key;
    return publicationKey ? publicationOverrides[publicationKey] : undefined;
}

export function getPublicationType(entry: any): false | string | undefined {
    const override = getOverride(entry);
    if (override && Object.hasOwn(override, "type")) return override.type;
    return entry.data?.type;
}

export function isPublicationVisible(entry: any): boolean {
    if (entry.data?.visible === false) return false;
    if (getOverride(entry)?.visible === false) return false;
    return getPublicationType(entry) !== false;
}
