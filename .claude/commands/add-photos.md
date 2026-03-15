# 사진 추가 (add-photos)

현재 `modules/ROOT/images/` 에 추가된 미추적 파일을 감지하여, 적절한 갤러리 페이지에 반영하고 커밋 & CI를 트리거합니다.

## 실행 순서

### 1. 브랜치 확인 및 새 파일 감지
`2026.1.1` 브랜치로 이동 후 `git status`로 `modules/ROOT/images/` 아래의 untracked 파일 목록을 확인한다.

### 2. 파일 전처리
- **HEIC 파일**: `sips -s format jpeg 파일.HEIC --out 같은경로/파일.jpeg` 로 변환 후 원본 삭제
- **폴더 없는 파일**: 파일명을 분석해 기존 폴더 또는 새 폴더로 이동
- **이미 폴더 안에 있는 파일**: 그대로 사용

### 3. 갤러리 adoc 업데이트
- 해당 폴더의 `gallery-<폴더명>.adoc` 이 존재하면 → 파일 목록 끝에 `image::폴더/파일명[사진 N]` 추가
- 존재하지 않으면 → `modules/ROOT/pages/gallery-<폴더명>.adoc` 신규 생성:

```adoc
= <폴더명>
:page-role: gallery-page

[.photo-grid]
--
image::폴더/파일명[사진 1]
--
```

- mp4 파일은 photo-grid 바깥에 별도 섹션으로 추가:

```adoc
== 영상

video::폴더/파일명[width=100%,opts="autoplay,muted,loop"]
```

### 4. nav / gallery 인덱스 업데이트 (신규 폴더인 경우에만)
- `modules/ROOT/nav.adoc` — `** xref:gallery-<폴더명>.adoc[<폴더명>]` 추가
- `modules/ROOT/pages/gallery.adoc` — 활동 섹션에 링크 추가

### 5. 커밋 & 배포
```bash
# 2026.1.1 커밋 & push
git add modules/ROOT/
git commit -m "feat: <설명> 사진 추가"
git push origin 2026.1.1

# main CI 트리거
git checkout main
git commit --allow-empty -m "ci: <설명> 반영"
git push origin main
git checkout 2026.1.1
```

## 주의사항
- `antora-source.yml` 은 절대 수정하지 않는다 (CI 배포용 원격 URL 고정)
- `main` 브랜치에는 콘텐츠(이미지, adoc)를 커밋하지 않는다
- landing.adoc 미리보기 갱신이 필요하면 `:page-gallery-images:` 속성에 대표 사진 2장 추가
