# 자동 배포가 안 될 수 있는 경우

## ⚠️ 자동 배포가 실패할 수 있는 상황들

### 1. PR 머지 방식 문제

**문제:** GitHub에서 PR을 머지할 때 방식에 따라 워크플로우가 실행되지 않을 수 있음

#### ✅ 정상 작동하는 머지 방식

1. **"Merge pull request" (Merge commit)**
   - ✅ main 브랜치에 merge commit 생성
   - ✅ `push` 이벤트 발생
   - ✅ 워크플로우 실행됨

2. **"Squash and merge"**
   - ✅ main 브랜치에 squash commit 생성
   - ✅ `push` 이벤트 발생
   - ✅ 워크플로우 실행됨

3. **"Rebase and merge"**
   - ✅ main 브랜치에 rebase commit 생성
   - ✅ `push` 이벤트 발생
   - ✅ 워크플로우 실행됨

**모든 머지 방식에서 `push` 이벤트가 발생하므로 워크플로우가 실행됩니다!**

---

### 2. 워크플로우 파일 조건 문제

**현재 워크플로우 조건:**
```yaml
deploy-on-merge:
  if: github.event_name == 'push' && github.ref == 'refs/heads/main'
```

**문제가 될 수 있는 경우:**

#### ❌ main이 아닌 다른 브랜치에 머지
```yaml
# 예: develop 브랜치에 머지
if: github.ref == 'refs/heads/main'  # ❌ 실행 안 됨
```

**해결:**
```yaml
# 여러 브랜치 지원
if: github.event_name == 'push' && (github.ref == 'refs/heads/main' || github.ref == 'refs/heads/master')
```

---

### 3. 워크플로우 파일이 없거나 경로 문제

**문제:**
- `.github/workflows/` 디렉터리에 파일이 없음
- 파일 이름이 `.yml` 또는 `.yaml`로 끝나지 않음
- YAML 문법 오류

**확인 방법:**
```bash
# 워크플로우 파일 확인
ls -la .github/workflows/

# YAML 문법 확인 (온라인 도구 사용)
```

---

### 4. GitHub Actions 비활성화

**문제:**
- 저장소에서 GitHub Actions가 비활성화됨

**확인 방법:**
1. Settings → Actions → General
2. "Allow all actions and reusable workflows" 선택 확인

---

### 5. 브랜치 보호 규칙

**문제:**
- main 브랜치에 보호 규칙이 설정되어 있음
- 워크플로우 실행 권한이 없음

**확인 방법:**
1. Settings → Branches → Branch protection rules
2. main 브랜치 규칙 확인
3. "Allow specified actors to bypass required pull requests" 확인

---

### 6. Secrets 설정 문제

**문제:**
- 필요한 Secrets가 설정되지 않음
- Secrets 값이 잘못됨

**확인해야 할 Secrets:**
- `SERVER_HOST`
- `SERVER_USER`
- `SSH_PASSWORD`
- `GHCR_TOKEN` (비공개 이미지인 경우)

**확인 방법:**
- Settings → Secrets and variables → Actions

---

### 7. PR 머지 후 실제로 Push가 발생하지 않은 경우

**드문 경우지만 가능:**

#### Fast-forward merge가 불가능한 경우
- PR이 이미 머지된 상태
- 충돌 해결 후 다시 머지 시도

**해결:**
- PR을 다시 열고 머지
- 또는 직접 main에 push

---

### 8. 워크플로우 실행 권한 문제

**문제:**
- 워크플로우에 필요한 권한이 없음

**현재 워크플로우 권한:**
```yaml
permissions:
  contents: read
  packages: write
```

**확인:**
- Settings → Actions → General → Workflow permissions
- "Read and write permissions" 선택 확인

---

## 🔍 문제 진단 방법

### 1. GitHub Actions 로그 확인

1. 저장소 → **Actions** 탭
2. 워크플로우 실행 이력 확인
3. 실패한 워크플로우 클릭
4. 에러 메시지 확인

### 2. 워크플로우가 실행되었는지 확인

**PR 머지 후:**
- Actions 탭에서 워크플로우 실행 여부 확인
- 실행되지 않았다면 트리거 조건 확인

### 3. 수동 실행 테스트

```yaml
# 워크플로우에 수동 실행 추가
on:
  workflow_dispatch:  # 수동 실행 가능
```

**테스트:**
- Actions 탭 → 워크플로우 선택 → "Run workflow" 클릭

---

## ✅ 자동 배포가 확실히 작동하도록 하는 방법

### 1. 워크플로우 조건 명확히 하기

```yaml
deploy-on-merge:
  if: |
    github.event_name == 'push' && 
    (github.ref == 'refs/heads/main' || github.ref == 'refs/heads/master')
```

### 2. 모든 머지 방식 지원 확인

**모든 머지 방식에서 `push` 이벤트가 발생하므로 문제없음!**

하지만 확실히 하려면:

```yaml
on:
  push:
    branches: [main]
  pull_request:
    types: [closed]  # PR이 닫힐 때 (머지 포함)
```

### 3. 디버깅 로그 추가

```yaml
- name: Debug info
  run: |
    echo "Event: ${{ github.event_name }}"
    echo "Ref: ${{ github.ref }}"
    echo "Branch: ${{ github.ref_name }}"
```

---

## 🎯 실제 시나리오별 동작

### 시나리오 1: 정상적인 경우

```
브랜치 A → PR 생성 → 빌드/테스트 ✅
  ↓
PR 머지 (Merge commit)
  ↓
main 브랜치에 push 이벤트 발생
  ↓
워크플로우 실행 → 빌드 + 배포 🚀
```

**결과:** ✅ 정상 작동

---

### 시나리오 2: Squash and merge

```
브랜치 A → PR 생성 → 빌드/테스트 ✅
  ↓
PR 머지 (Squash and merge)
  ↓
main 브랜치에 push 이벤트 발생
  ↓
워크플로우 실행 → 빌드 + 배포 🚀
```

**결과:** ✅ 정상 작동

---

### 시나리오 3: Rebase and merge

```
브랜치 A → PR 생성 → 빌드/테스트 ✅
  ↓
PR 머지 (Rebase and merge)
  ↓
main 브랜치에 push 이벤트 발생
  ↓
워크플로우 실행 → 빌드 + 배포 🚀
```

**결과:** ✅ 정상 작동

---

### 시나리오 4: 워크플로우 파일이 없는 경우

```
브랜치 A → PR 생성
  ↓
PR 머지
  ↓
main 브랜치에 push 이벤트 발생
  ↓
워크플로우 파일 없음
  ↓
❌ 워크플로우 실행 안 됨
```

**결과:** ❌ 워크플로우 실행 안 됨

**해결:** 워크플로우 파일 추가

---

### 시나리오 5: Secrets가 없는 경우

```
브랜치 A → PR 생성 → 빌드/테스트 ✅
  ↓
PR 머지
  ↓
워크플로우 실행 시작
  ↓
배포 단계에서 Secrets 필요
  ↓
❌ Secrets 없음 → 배포 실패
```

**결과:** ❌ 배포 실패 (워크플로우는 실행되지만 실패)

**해결:** Secrets 설정

---

## 📋 체크리스트

자동 배포가 작동하는지 확인:

- [ ] `.github/workflows/pr-based-ci-cd.yml` 파일이 있음
- [ ] GitHub Actions가 활성화되어 있음
- [ ] 필요한 Secrets가 모두 설정되어 있음
- [ ] 워크플로우 조건이 올바름 (`github.ref == 'refs/heads/main'`)
- [ ] PR 머지 후 Actions 탭에서 워크플로우 실행 확인
- [ ] 워크플로우 로그에서 에러 확인

---

## 💡 요약

**질문: "각 브랜치에서 PR을 만들고 머지할 때 자동 배포가 안 될 수도 있나?"**

**답변:**
- ✅ **대부분의 경우 자동 배포가 작동합니다**
- ⚠️ **다음 경우에는 작동하지 않을 수 있습니다:**

1. **워크플로우 파일이 없거나 경로가 잘못됨**
2. **GitHub Actions가 비활성화됨**
3. **Secrets가 설정되지 않음**
4. **워크플로우 조건이 맞지 않음** (예: main이 아닌 다른 브랜치)
5. **권한 문제**

**확인 방법:**
- PR 머지 후 **Actions 탭**에서 워크플로우 실행 여부 확인
- 실행되지 않았다면 위 체크리스트 확인

---

## 🔧 문제 해결

### 워크플로우가 실행되지 않을 때

1. **Actions 탭 확인**
   - 워크플로우가 실행되었는지 확인
   - 실행되지 않았다면 트리거 조건 확인

2. **워크플로우 파일 확인**
   ```bash
   cat .github/workflows/pr-based-ci-cd.yml
   ```

3. **수동 실행 테스트**
   - 워크플로우에 `workflow_dispatch` 추가
   - 수동으로 실행해서 문제 확인

### 배포가 실패할 때

1. **워크플로우 로그 확인**
   - Actions 탭 → 실패한 워크플로우 → 로그 확인

2. **Secrets 확인**
   - Settings → Secrets and variables → Actions
   - 필요한 Secrets가 모두 있는지 확인

3. **서버 접근 확인**
   - SSH 접속 가능한지 확인
   - Docker가 설치되어 있는지 확인
