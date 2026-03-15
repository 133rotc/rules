# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This repo is the **Antora playbook + UI bundle** for publishing the 홍익대학교 ROTC 55기 동기회 회칙 (association bylaws) as a static site to GitHub Pages. The actual AsciiDoc content lives in separate branches (`2024.1.1`, `2023.1.1`) of the same GitHub repo, not in the `main` branch.

## Commands

```bash
npm install          # Install Antora CLI and site generator
npm run build        # Generate site (reads content from remote branches via antora-source.yml)
npm run dev          # Generate site with --fetch (fetches latest from remote)
```

Output is written to `build/site/`.

## Architecture

- **`antora-source.yml`** — Antora playbook: defines the site title, content sources (remote branches `2024.1.1`, `2023.1.1`), and points the UI bundle to `./ui-bundle`.
- **`ui-bundle/`** — Custom Antora UI: Handlebars layouts/partials, CSS, JS, fonts, SVG icons, and Handlebars helpers. This controls the entire look and feel of the generated site.
- **`.github/workflows/publish.yml`** — CI: on push to `main`, runs `npx antora antora-source.yml` and deploys `build/site` to GitHub Pages.

## Content Editing

Content (`.adoc` files) is NOT in `main`. To edit bylaws content, switch to or create a versioned branch (e.g. `2024.1.1`) and edit the AsciiDoc files there. The playbook in `antora-source.yml` must list the branch name under `content.sources[].branches` for it to be included in the build.

## IMPORTANT: Branch Rules

**DO NOT modify content in `main` branch.** The `main` branch contains only:
- The Antora playbook (`antora-source.yml`)
- The UI bundle (`ui-bundle/`) — layout, CSS, JS, fonts only
- CI workflow (`.github/workflows/publish.yml`)
- This `CLAUDE.md`

**Content changes (pages, landing page, gallery, etc.) must be made in content branches** such as `2026.1.1`, `2025.1.1`, `2024.1.1`, etc.

### Landing Page / New Page

To add a landing page or new `.adoc` page:
1. Switch to the appropriate content branch (e.g., `git checkout 2026.1.1`)
2. Edit or create `.adoc` files in that branch
3. Use Antora page attributes (e.g., `:page-layout: landing`) if a special layout is needed
4. The `ui-bundle/` in `main` can define new layouts/partials to support new page types

### Adding Images

Images referenced from `.adoc` content should be placed in the content branch under the `images/` directory of the Antora module (e.g., `modules/ROOT/images/`). Images used only by the UI (icons, backgrounds) go in `ui-bundle/img/` in `main`.
