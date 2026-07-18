export interface FeaturedContentSelection {
    collection: "posts" | "projects" | "publications";
    id: string;
}

export const FEATURED_CONTENT: FeaturedContentSelection[] = [
    {
        collection: "posts",
        id: "codenames-llm-showdown",
    },
    {
        collection: "projects",
        id: "the-kiss",
    },
    {
        collection: "publications",
        id: "scholar-station-level-and-network-wide-shap-explanation-of-cnn-models-for-seismic-cycle-monitoring-evidence--2026",
    },
];
