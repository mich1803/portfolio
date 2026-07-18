// @ts-check
import { defineConfig } from 'astro/config';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import sitemap from '@astrojs/sitemap';

import tailwindcss from '@tailwindcss/vite';

const isGitHubPagesBuild = process.env.GITHUB_ACTIONS === 'true';
const [repositoryOwner = 'mich1803', repositoryName = 'academic-portfolio'] =
  (process.env.GITHUB_REPOSITORY || 'mich1803/academic-portfolio').split('/');
const isUserOrOrganizationSite = repositoryName.toLowerCase() === `${repositoryOwner.toLowerCase()}.github.io`;
const site = process.env.ASTRO_SITE || (
  isGitHubPagesBuild ? `https://${repositoryOwner}.github.io` : 'http://localhost:4321'
);
const base = process.env.ASTRO_BASE || (
  isGitHubPagesBuild && !isUserOrOrganizationSite ? `/${repositoryName}` : '/'
);

// https://astro.build/config
export default defineConfig({
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
  build: {
    inlineStylesheets: 'always'
  },
  vite: {
    plugins: [tailwindcss()],
  },
  site,
  base,
  integrations: [sitemap()],
});
