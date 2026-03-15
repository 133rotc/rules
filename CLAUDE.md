# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This repo is the **Antora playbook + UI bundle** for publishing the 홍익대학교 ROTC 55기 동기회 회칙 (association bylaws) as a static site to GitHub Pages. The actual AsciiDoc content lives in separate branches (`2024.1.1`, `2023.1.1`) of the same GitHub repo, not in the `main` branch.

## Commands

```bash
antora antora-source.yml          # Generate site (reads content from remote GitHub branches)
antora antora-source.yml --fetch  # Generate site AND fetch latest from remote
```

Output is written to `build/site/`.

## Local Development

로컬에서 빌드하려면 `antora-source.yml`의 content source URL을 `./`로 변경한 뒤 실행합니다.

**`antora-source.yml` 수정:**
```yaml
content:
  sources:
  # - url: https://github.com/133rotc/rules  # 원격 (CI/배포용)
  - url: ./                                   # 로컬 (개발용)
    branches: HEAD                            # 현재 체크아웃된 브랜치 사용
```

**실행:**
```bash
git checkout 2026.1.1   # 콘텐츠 브랜치로 이동
antora antora-source.yml
```

> 로컬 빌드 후에는 `antora-source.yml`을 원래대로 되돌리고 커밋하세요. `url: https://github.com/133rotc/rules` 상태로 `main`에 머지해야 CI가 정상 동작합니다.

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
