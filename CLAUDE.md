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
