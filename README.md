# Michele Magrini - Academic Portfolio

Personal academic portfolio for Michele Magrini, an M.Sc. student in Applied Mathematics for Artificial Intelligence and student researcher working on explainable machine learning for scientific applications.

The site is built with [Astro](https://astro.build/), TypeScript, Tailwind CSS, Markdown content collections, and KaTeX. It is designed to run locally from `/`, deploy to a GitHub Pages repository subpath, and later move to a custom domain without rewriting internal links.

## Origin and attribution

This project is based on [rubzip/academic-portfolio-astro](https://github.com/rubzip/academic-portfolio-astro), created by Rubén Gijón and distributed under the MIT License.

This repository takes that project as its foundation and adapts its content, identity, navigation, and visual presentation to Michele Magrini's academic persona. It also edits existing behavior and adds functionality specific to this portfolio, including:

- append-only Google Scholar synchronization with duplicate detection;
- publication abstracts, types, visibility rules, RSS filtering, and sitemap filtering;
- an interactive GitHub profile and contribution overview on the Projects page;
- compact, interactive article summaries on individual blog posts;
- environment-aware Astro `site` and `base` configuration for local development, GitHub Pages, and custom domains;
- portfolio projects and academic content curated from Michele's CV and source repositories.

The original copyright notice is preserved in [LICENSE](LICENSE).

## Main features

- Markdown-driven biography, CV, projects, publications, and blog posts.
- Responsive two-column academic layout with light and dark themes.
- LaTeX mathematics through `remark-math` and `rehype-katex`.
- Live GitHub repository, follower, star, fork, and contribution statistics.
- Blog table of contents that follows the reader through the article.
- Static RSS feed and sitemap containing only visible publications.
- GitHub Actions deployment with an optional weekly Scholar refresh.
- Optional GA4 and Umami analytics configuration.

## Local development

Requirements:

- Node.js 22.12.0 or newer
- npm

Install dependencies and start the development server:

```bash
npm ci
npm run dev
```

Open [http://localhost:4321/](http://localhost:4321/). Local development always uses the root path, even when the production deployment uses a GitHub Pages repository subpath.

The Scholar API key is optional during local development. Without it, synchronization leaves all cached publication files untouched.

To enable live Scholar synchronization, create an ignored `.env` file:

```dotenv
SERPAPI_KEY=your_serpapi_key
```

Never commit `.env` or an API key.

## Content and configuration

| Path | Purpose |
| --- | --- |
| `src/content/bio.md` | Biography and sidebar identity |
| `src/content/cv.md` | Education and research experience |
| `src/content/projects/` | Project pages |
| `src/content/posts/` | Blog posts and local post images |
| `src/content/publications/` | Manually curated and synchronized publications |
| `src/data/scholar-publications.json` | Scholar identifiers and display configuration |
| `src/config/site.ts` | Site metadata, themes, and analytics |
| `src/config/navigation.ts` | Main navigation |
| `src/config/social.ts` | Social and academic profile links |
| `src/styles/global.css` | Global theme and component styles |

## Google Scholar synchronization

Run the synchronization manually with:

```bash
npm run sync:scholar
```

The synchronization is deliberately append-only:

- existing publication Markdown files are never rewritten or deleted;
- existing records are detected by Scholar ID, publication key, and filename;
- only genuinely new publications create new Markdown files;
- new publications default to `type: false`, so they remain hidden until reviewed;
- abstracts are stored when the Scholar provider returns one.

Visibility is controlled in `src/data/scholar-publications.json`:

```json
{
  "type": "Journal Publication"
}
```

A non-empty type string shows the publication and displays that string as its label. Use `"type": false` to hide it. The older `"visible": false` setting remains supported. Changing a type does not require another synchronization.

Run the safety tests with:

```bash
npm run test:scholar
```

More details are available in [docs/GOOGLE-SCHOLAR-SYNC.md](docs/GOOGLE-SCHOLAR-SYNC.md).

## GitHub Pages deployment

The workflow in `.github/workflows/deploy.yml` builds and deploys every push to `main`. It also runs weekly so that Scholar can discover new publications when the `SERPAPI_KEY` repository secret is configured.

In the GitHub repository:

1. Open **Settings > Pages**.
2. Set the deployment source to **GitHub Actions**.
3. Optionally add `SERPAPI_KEY` under **Settings > Secrets and variables > Actions > Secrets**.
4. Push to `main` or run the workflow manually from the **Actions** tab.

Astro reads `GITHUB_REPOSITORY` during Actions builds and automatically generates the correct repository subpath. Optional repository variables `ASTRO_SITE` and `ASTRO_BASE` can override that behavior for a custom domain.

## Commands

| Command | Action |
| --- | --- |
| `npm run dev` | Start local development at `http://localhost:4321/` |
| `npm run sync:scholar` | Append genuinely new Scholar publications |
| `npm run test:scholar` | Verify synchronization safety guarantees |
| `npm run build` | Synchronize safely and create the production build in `dist/` |
| `npm run preview` | Preview the latest production build |

## License

This adapted portfolio remains available under the [MIT License](LICENSE). The original repository and author are credited above, and the original copyright notice is retained.
