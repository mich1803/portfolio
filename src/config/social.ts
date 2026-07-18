import type { SocialLink } from "../types";

export const SOCIALS: SocialLink[] = [
    {
        name: "Github",
        href: "https://github.com/mich1803",
        linkTitle: `Follow me on Github`,
        isActive: true,
    },
    {
        name: "Mail",
        href: "mailto:michelemagrini2003@gmail.com",
        linkTitle: `Send an email to me`,
        isActive: true,
    },
    {
        name: "Google Scholar",
        href: "https://scholar.google.com/citations?user=_gx5hKUAAAAJ&hl=it",
        linkTitle: `Michele Magrini on Google Scholar`,
        isActive: true,
    },
    {
        name: "ORCID",
        href: "https://orcid.org/0009-0008-9246-1192",
        linkTitle: `Michele Magrini on ORCID`,
        isActive: true,
    },
    {
        name: "LinkedIn",
        href: "https://www.linkedin.com/in/michele-magrini/",
        linkTitle: `Connect with me on LinkedIn`,
        isActive: true,
    },
];

export const SOCIAL_ICONS: Record<string, string> = {
    Github: "Github",
    Mail: "Mail",
    Linkedin: "LinkedIn",
    "Google Scholar": "GoogleScholar",
    ORCID: "ORCID",
    RSS: "RSS",
};
