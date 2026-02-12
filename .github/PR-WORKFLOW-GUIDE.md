# PR 기반 워크플로우 가이드

## 🔄 두 가지 워크플로우 방식 비교

### 방식 1: Push 기반 (현재 사용 중)

```
브랜치에 Push
  ↓
즉시 빌드 + 배포
```

**특징:**
- ✅ 빠른 배포
- ❌ 코드 검증 없이 바로 배포
- ❌ 실수로 main에 직접 push하면 바로 배포됨

---

### 방식 2: PR 기반 (권장)

```
브랜치 생성 → 코드 작성
  ↓
PR 생성
  ↓
자동 빌드 + 테스트 (배포 안 함)
  ↓
코드 리뷰
  ↓
PR 머지 → main
  ↓
자동 배포
```

**특징:**
- ✅ 코드 검증 후 배포 (안전)
- ✅ 코드 리뷰 가능
- ✅ 실수 방지 (main에 직접 push해도 배포 안 됨)
- ✅ PR에 빌드 상태 표시

---

## 📋 PR 기반 워크플로우 동작 방식

### 1. 브랜치 생성 및 작업

```bash
# 새 기능 브랜치 생성
git checkout -b feature/new-feature

# 코드 작성 및 커밋
git add .
git commit -m "feat: add new feature"
git push origin feature/new-feature
```

**이 시점:** 아직 워크플로우 실행 안 됨

---

### 2. PR 생성

GitHub에서 Pull Request 생성:
- Base: `main`
- Compare: `feature/new-feature`

**이 시점:** 워크플로우 자동 실행!

**실행되는 작업:**
- ✅ 코드 체크아웃
- ✅ Docker 이미지 빌드 (태그: `pr-123`)
- ✅ 테스트 실행
- ✅ PR에 빌드 상태 댓글 추가

**배포:** ❌ 안 함 (PR 단계에서는 배포 안 함)

---

### 3. 코드 리뷰 및 수정

PR에 리뷰 코멘트 → 코드 수정 → Push

**이 시점:** 워크플로우 다시 실행 (수정된 코드로 빌드/테스트)

---

### 4. PR 머지

PR 승인 후 "Merge pull request" 클릭

**이 시점:** 워크플로우 자동 실행!

**실행되는 작업:**
- ✅ 코드 체크아웃
- ✅ Docker 이미지 빌드 (태그: `latest`)
- ✅ **서버에 배포** 🚀

---

## 🎯 워크플로우 파일 구조

### PR 시 실행되는 Job

```yaml
pr-build-and-test:
  if: github.event_name == 'pull_request'
  # 빌드 + 테스트만, 배포 안 함
```

### main 머지 시 실행되는 Job

```yaml
deploy-on-merge:
  if: github.event_name == 'push' && github.ref == 'refs/heads/main'
  # 빌드 + 배포
```

---

## 🔧 적용 방법

### 1. 기존 워크플로우 교체

```bash
# 기존 워크플로우 백업 (선택)
mv .github/workflows/build-and-deploy.yml .github/workflows/build-and-deploy.yml.backup

# PR 기반 워크플로우 사용
cp .github/workflows/pr-based-ci-cd.yml .github/workflows/build-and-deploy.yml
```

### 2. 또는 두 개 모두 사용

- `build-and-deploy.yml` - Push 기반 (빠른 배포용)
- `pr-based-ci-cd.yml` - PR 기반 (안전한 배포용)

---

## 📊 PR 기반 워크플로우의 장점

### 1. 안전성

- ❌ 실수로 잘못된 코드가 배포되는 것 방지
- ✅ 코드 리뷰 후 배포
- ✅ 테스트 통과 후 배포

### 2. 협업 효율성

- ✅ PR에 빌드 상태 표시
- ✅ 리뷰어가 빌드 결과 확인 가능
- ✅ 문제 있는 코드는 머지 전에 발견

### 3. 추적 가능성

- ✅ 어떤 PR이 배포되었는지 명확
- ✅ 배포 이력과 코드 변경 이력 연결
- ✅ 문제 발생 시 원인 추적 용이

---

## 🚀 실제 사용 예시

### 시나리오: 새 기능 추가

```bash
# 1. 브랜치 생성
git checkout -b feature/user-authentication

# 2. 코드 작성
# ... 코드 작성 ...

# 3. 커밋 및 Push
git add .
git commit -m "feat: add user authentication"
git push origin feature/user-authentication

# 4. GitHub에서 PR 생성
# → 자동으로 빌드/테스트 실행
# → PR에 빌드 상태 표시

# 5. 코드 리뷰
# → 리뷰어가 코드 확인
# → 빌드 결과 확인

# 6. 수정사항 반영 (필요시)
git commit -m "fix: address review comments"
git push origin feature/user-authentication
# → 워크플로우 다시 실행

# 7. PR 머지
# → 자동으로 배포 실행! 🚀
```

---

## ⚙️ 고급 설정

### PR 머지 시 수동 승인 추가

```yaml
deploy-on-merge:
  environment: production  # GitHub Environments 사용
  # → 배포 전 수동 승인 필요
```

**설정 방법:**
1. GitHub 저장소 → Settings → Environments
2. `production` 환경 생성
3. "Required reviewers" 추가
4. 워크플로우에 `environment: production` 추가

---

### PR에 빌드 상태 배지 표시

PR에 자동으로 빌드 상태가 표시됩니다:
- ✅ 성공: 초록색 체크
- ❌ 실패: 빨간색 X

---

## 🔍 문제 해결

### PR 생성해도 워크플로우가 실행 안 될 때

1. **파일 경로 확인**
   - `.github/workflows/*.yml` 파일이 있는지
   - YAML 문법 오류가 없는지

2. **트리거 확인**
   ```yaml
   on:
     pull_request:
       branches: [main]  # PR의 base 브랜치가 main인지 확인
   ```

3. **GitHub Actions 활성화**
   - Settings → Actions → Allow all actions

### PR 머지 후 배포가 안 될 때

1. **브랜치 확인**
   - main 브랜치에 머지되었는지 확인
   - `github.ref == 'refs/heads/main'` 조건 확인

2. **워크플로우 로그 확인**
   - Actions 탭에서 실행 로그 확인

---

## 💡 추천 워크플로우

**연구소에서 권장하는 방식:**

```
개발 단계: PR 기반 (안전)
  ↓
빠른 데모 필요: Push 기반 (빠름)
  ↓
운영 단계: PR 기반 + 수동 승인 (안정)
```

**프로젝트별 선택:**
- **실험/데모 프로젝트**: Push 기반 (빠른 반복)
- **운영/중요 프로젝트**: PR 기반 (안전성)

---

## 📚 참고

- [GitHub Actions - Pull Request 이벤트](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#pull_request)
- [GitHub Environments](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment)
