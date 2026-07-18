# Google Scholar publication sync

The Publications page can synchronize automatically with Michele Magrini's Google Scholar profile:

`https://scholar.google.com/citations?user=_gx5hKUAAAAJ&hl=en`

The sync uses SerpAPI because Google Scholar does not provide a supported public author-profile API. Generated Markdown is cached in `src/content/publications/` with a `scholar-` filename prefix, so the site still builds if SerpAPI is unavailable or no API key is configured.

The sync is append-only. It creates files only for publications it has not seen before. An existing repository file is never rewritten or deleted, even if Scholar metadata changes later. Matching uses the Scholar ID, publication key, and generated filename.

## Initial setup

1. Create a SerpAPI account and copy your private API key.
2. Copy `.env.example` to `.env`.
3. Replace the placeholder value in `.env`:

   ```text
   SERPAPI_KEY=your_real_private_key
   ```

4. Run the first synchronization:

   ```bash
   npm run sync:scholar
   ```

5. Start the site normally:

   ```bash
   npm run dev
   ```

Never commit `.env`. It is already ignored by Git.

## Classify and show a publication

Open `src/data/scholar-publications.json`. Every newly synchronized publication is added with `"type": false`, which keeps it hidden until you review it:

```json
{
  "publications": {
    "the-publication-key": {
      "type": false
    }
  }
}
```

To publish it, replace `false` with a descriptive type. The string is also displayed as a label on the publication:

```json
"type": "Conference Poster Session"
```

You can use any useful label, including:

- `Conference Poster Session`
- `Conference Oral Session`
- `Conference Contribution`
- `Journal Publication`
- `Blogpost`
- `Preprint`

You do not need to synchronize again after changing a type. Restart the development server if needed, or run `npm run build`.

## Hide a publication

Change its type back to `false`:

```json
"type": false
```

The publication is then excluded from the Publications listing, its detail route, the RSS feed, and the generated sitemap. Its cached Markdown file is preserved, so it can be restored by assigning a type string again.

The legacy setting `"visible": false` is still recognized for older entries, but `type` is the preferred control.

## Refresh publications manually

Run:

```bash
npm run sync:scholar
```

For each new Scholar item, the script requests its citation details so it can store the abstract when Scholar/SerpAPI provides one. New entries are added to `src/data/scholar-publications.json` with `"type": false`. Existing files and configuration choices are left unchanged.

`npm run build` also runs the sync automatically before building. If the API key is missing or the request fails, the script prints a warning and uses the cached Markdown files.

## GitHub Pages automation

The deployment workflow runs every Monday and on every push to `main`.

In the GitHub repository:

1. Open **Settings > Secrets and variables > Actions**.
2. Select **New repository secret**.
3. Name it `SERPAPI_KEY`.
4. Paste the SerpAPI key and save it.

The scheduled deployment will then retrieve the current Scholar publication list automatically. You can also run it at any time from **Actions > Deploy to GitHub Pages > Run workflow**.

## Optional metadata overrides

The same publication entry may contain curated fields that take priority over Scholar metadata:

```json
{
  "type": "Journal Publication",
  "description": "A custom description for the portfolio.",
  "external_url": "https://publisher.example/paper",
  "tags": ["Explainable AI", "Earthquake Science"]
}
```

After a Scholar Markdown file is created, it is safe to curate its abstract or other frontmatter manually. Future syncs will not touch it.
