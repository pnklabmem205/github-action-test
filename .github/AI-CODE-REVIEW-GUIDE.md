# GitHub Actions / AI 코드 리뷰 조사 요약

GitHub에서 AI 코드 리뷰를 하는 방법은 크게 **두 가지**입니다.

1. **GitHub Actions + 외부 AI API** (OpenAI, Claude, Gemini 등)
2. **GitHub Copilot** (GitHub 네이티브, 액션 없이 Ruleset으로 자동 리뷰)

---

## 1. GitHub Actions로 AI 리뷰하기

PR이 열리거나 동기화될 때 워크플로우가 돌면서, 변경된 코드를 AI API에 보내고 리뷰 코멘트를 PR에 남깁니다.

### 1.1 대표적인 Marketplace 액션

| 액션 | 스타/인기 | AI 제공자 | 비고 |
|------|-----------|-----------|------|
| [villesau/ai-code-review-action](https://github.com/marketplace/actions/ai-code-review-action) | ★ 많음 | OpenAI (GPT-4) | 설정 단순, exclude 패턴 지원 |
| [anc95/ChatGPT-CodeReview](https://github.com/anc95/ChatGPT-Codereview) | ★ 많음 | OpenAI | ChatGPT 기반 |
| [AI Code Review](https://github.com/marketplace/actions/ai-code-review) (다중 제공자) | - | OpenAI, Anthropic, Google, Deepseek, Perplexity 등 | 모델 선택 폭 넓음 |
| [AI Assisted Code Review](https://github.com/marketplace/actions/ai-assisted-code-review) (AutoReviewer) | - | GPT-4 | 라벨/트리거로 제어 가능 |
| [OpenCode (Hugging Face)](https://huggingface.co/docs/inference-providers/guides/github-actions-code-review) | - | HF Inference (DeepSeek, GLM 등) | 오픈소스 모델, GitHub App 연동 |

### 1.2 공통 설정 요건

- **시크릿**: 사용할 AI 서비스 API 키 (예: `OPENAI_API_KEY`)를 Repo 또는 Org Secrets에 등록
- **트리거**: 보통 `pull_request`의 `opened`, `synchronize` (재푸시 시 재리뷰)
- **권한**: PR에 코멘트를 달아야 하므로 `contents: read`, `pull-requests: write` 수준 필요

### 1.3 예시 워크플로우 (OpenAI 기반)

```yaml
# .github/workflows/ai-code-review.yml
name: AI Code Review

on:
  pull_request:
    types: [opened, synchronize, reopened]
    branches: [main]

permissions:
  contents: read
  pull-requests: write

jobs:
  ai-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: AI Code Review
        uses: villesau/ai-code-review-action@v2.0.1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
        with:
          # 모델 (선택)
          model: gpt-4
          # 리뷰에서 제외할 파일 패턴 (선택)
          exclude: "**/*.json,**/*.md,**/package-lock.json"
```

- **필수**: Repo Settings → Secrets and variables → Actions 에서 `OPENAI_API_KEY` 추가

### 1.4 비용

- **OpenAI**: 모델별 과금 (예: GPT-4는 입력/출력 토큰당 비용). PR당 변경량에 따라 수 cent~수십 cent 수준일 수 있음.
- **절감**: `exclude`로 불필요한 파일(lock, json, md 등) 제외, 또는 더 저렴한 모델(gpt-4o-mini 등) 지정.

---

## 2. GitHub Copilot으로 리뷰하기 (액션 없음)

GitHub 공식 기능으로, **GitHub Actions 워크플로우를 추가하지 않고** 리뷰만 사용할 수 있습니다.

### 2.1 사용 방법

- **수동**: PR에서 Reviewers에 **Copilot** 추가 → Copilot이 코멘트 형태로 리뷰 (승인/요청 변경이 아니라 코멘트만).
- **자동**: Ruleset으로 “이 브랜치로 들어오는 PR은 자동으로 Copilot 리뷰 요청” 설정 가능.

### 2.2 자동 리뷰 설정 (Ruleset)

1. Repo **Settings** → **Rules** → **Rulesets**
2. **New ruleset** → **New branch ruleset**
3. 이름 지정, Target branches 지정 (예: `main`)
4. Branch rules에서 **Automatically request Copilot code review** 선택
5. (선택) Review new pushes, Review draft pull requests 등 설정

- Copilot 구독(개인: Copilot Pro 등, 팀/엔터프라이즈) 필요.
- 리뷰는 “Comment”만 남기므로, 브랜치 보호의 “필수 승인”에는 포함되지 않음.

### 2.3 커스텀 (프로젝트별 가이드라인)

- `.github/copilot-instructions.md` 에 프로젝트별 코드 스타일/규칙을 적어두면 Copilot 리뷰가 그에 맞춰 동작하도록 조정 가능.

---

## 3. 비교 및 선택 가이드

| 구분 | GitHub Actions + AI API | GitHub Copilot |
|------|-------------------------|----------------|
| **설치** | 워크플로우 + 시크릿(API 키) | 구독 + Ruleset 설정 |
| **비용** | API 사용량 과금 (OpenAI 등) | Copilot 구독료 |
| **모델** | GPT-4, Claude, Gemini 등 선택 가능 | GitHub 제공 모델 |
| **커스터마이즈** | exclude, 모델, 프롬프트 등 액션 옵션으로 조정 | copilot-instructions.md |
| **운영 관점** | 시크릿·액션 버전·정책 직접 관리 | GitHub이 관리, 설정만 유지 |

- **이미 Copilot 구독이 있으면**: Ruleset으로 자동 리뷰만 켜는 것이 가장 간단.
- **특정 모델/비용 제어가 필요하면**: Actions + OpenAI(또는 다른 제공자) 액션을 쓰는 방식이 유연함.

---

## 4. 이 저장소에 적용할 때

- 현재 `multi-branch-deploy.yml`에서 이미 `pull_request`(main 대상)를 쓰고 있으므로, **별도 워크플로우** `ai-code-review.yml` 하나 추가하면 PR마다 AI 리뷰가 동작합니다.
- Copilot을 쓸 경우에는 위 Ruleset만 설정하면 되고, **새 워크플로우 파일은 필요 없습니다**.

원하시면 `ai-code-review.yml` 초안을 프로젝트용으로(exclude 패턴 등) 더 맞춰서 작성해 드리겠습니다.
