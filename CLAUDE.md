# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This repo is the **Antora playbook + UI bundle** for publishing the 홍익대학교 ROTC 55기 동기회 회칙 (association bylaws) as a static site to GitHub Pages. The actual AsciiDoc content lives in separate branches (`2026.1.1`, `2025.1.1`, `2024.1.1`, `2023.1.1`) of the same GitHub repo, not in the `main` branch.

## Commands

```bash
npm run dev    # 로컬 빌드 (antora-local.yml 사용, url: ./)
npm run build  # 원격 빌드 (antora-source.yml + --fetch, CI와 동일)
```

Output is written to `build/site/`.

## Local Development

플레이북이 두 개로 분리되어 있습니다. **절대 antora-source.yml의 url을 ./ 로 바꾸지 말 것** — CI 배포가 깨집니다.

| 파일 | 용도 | content url |
|---|---|---|
| `antora-source.yml` | CI / 배포 | `https://github.com/133rotc/rules` |
| `antora-local.yml` | 로컬 개발 | `./` |

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

이미지는 **날짜별 폴더**로 관리합니다. UI 전용 이미지(아이콘, 배경)만 `main`의 `ui-bundle/img/`에 넣습니다.

```
modules/ROOT/images/
├── 2025-10-02/    ← 행사 날짜로 폴더 생성
│   └── 1.jpeg, 2.jpeg ...
├── 2025-12-20/
│   └── 5.jpeg ~ 12.jpeg
└── landing.jpg
```

adoc에서 참조: `image::2025-10-02/1.jpeg[설명]`

## Gallery 구조 및 사진 추가 방법

### 파일 구조

```
modules/ROOT/
├── images/
│   ├── YYYY-MM-DD/             ← 행사 날짜별 폴더로 분리
│   │   └── 1.jpeg, 2.jpeg ...
│   └── landing.jpg             ← 랜딩 히어로 이미지
├── pages/
│   ├── landing.adoc            ← 랜딩 페이지 (갤러리 미리보기)
│   ├── gallery.adoc            ← 갤러리 인덱스 (연도별 목록)
│   ├── gallery-2025-12.adoc    ← 행사별 페이지 (2025.12.20 송년회 1부)
│   ├── gallery-2025-12-2.adoc  ← 행사별 페이지 (2025.12.20 송년회 2부)
│   └── gallery-2025-10.adoc    ← 행사별 페이지 (2025.10.02)
└── nav.adoc                    ← 사이드바 네비게이션
```

### 새 행사 사진 추가 순서

```bash
# 1. 콘텐츠 브랜치로 이동
git checkout 2026.1.1

# 2. 이미지 파일 추가
cp 새사진*.jpeg modules/ROOT/images/

# 3. 행사별 갤러리 페이지 생성 (날짜 기반 파일명 권장)
#    기존 파일(gallery-2025-12.adoc) 복사 후 제목·이미지 목록만 수정
cp modules/ROOT/pages/gallery-2025-12.adoc modules/ROOT/pages/gallery-2026-03-15.adoc

# 4. gallery.adoc 인덱스에 링크 추가
#    xref:gallery-2026-03-15.adoc[2026년 3월 15일 — 행사명]

# 5. nav.adoc 에 항목 추가
#    ** xref:gallery-2026-03-15.adoc[3월 15일 — 행사명]

# 6. landing.adoc 미리보기에 대표 사진 2~4장 추가
#    :page-gallery-images: 기존목록...,새파일명.jpeg

# 7. 커밋 & push
git add modules/ROOT/
git commit -m "feat: 2026년 3월 15일 행사 사진 추가"
git push origin 2026.1.1

# 8. CI 재트리거 (main push 필요)
git checkout main
git commit --allow-empty -m "ci: 갤러리 업데이트 반영"
git push origin main
```

### 갤러리 페이지 파일 형식

```adoc
= 날짜 — 행사명
:page-role: gallery-page

[.photo-grid]
--
image::파일명1.jpeg[사진 1]
image::파일명2.jpeg[사진 2]
--
```

### landing.adoc 미리보기 규칙

- `landing.adoc`의 `:page-gallery-images:` 속성에는 **행사별 대표 사진 2~4장**만 나열
- 전체 사진은 행사별 `gallery-*.adoc` 페이지에서 관리
- UI 템플릿(`landing.hbs`)은 수정 불필요 — 속성값만 바꾸면 자동 반영
