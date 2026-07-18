/** Prefix an internal site path with Astro's environment-specific base path. */
export function withBase(pathname = "/"): string {
    if (/^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(pathname)) return pathname;

    const base = import.meta.env.BASE_URL.replace(/\/+$/, "");
    const path = pathname.startsWith("/") ? pathname : `/${pathname}`;

    if (!base || path === base || path.startsWith(`${base}/`)) return path;
    return `${base}${path}`;
}
