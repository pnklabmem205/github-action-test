# 다중 브랜치 워크플로우 가이드

## 🎯 시나리오: 여러 브랜치에서 작업 후 배포

### 시나리오 1: 각 브랜치를 개별 PR로 (권장)

```
브랜치 A (feature/auth) → 작업 → Push → PR 생성 → 빌드/테스트 → 머지 → 배포
브랜치 B (feature/payment) → 작업 → Push → PR 생성 → 빌드/테스트 → 머지 → 배포
브랜치 C (feature/ui) → 작업 → Push → PR 생성 → 빌드/테스트 → 머지 → 배포
브랜치 D (feature/api) → 작업 → Push → PR 생성 → 빌드/테스트 → 머지 → 배포
```

**동작 방식:**
1. 각 브랜치에서 작업 → Push (여러 번 가능)
2. 각 브랜치를 main에 PR 생성
3. **PR 생성 시**: 빌드/테스트만 실행 (배포 안 함)
4. 코드 리뷰 후 PR 머지
5. **PR 머지 시**: 빌드 + 배포 실행 🚀

**장점:**
- ✅ 각 기능별로 독립적으로 검증
- ✅ 문제 있는 브랜치는 머지 전에 발견
- ✅ 점진적 배포 (하나씩 배포)

---

### 시나리오 2: 여러 브랜치를 하나의 PR로 합치기

```
브랜치 A → 작업 → Push
브랜치 B → 작업 → Push
브랜치 C → 작업 → Push
브랜치 D → 작업 → Push
  ↓
브랜치 E (통합) → A+B+C+D 머지 → PR 생성 → 빌드/테스트 → 머지 → 배포
```

**동작 방식:**
1. 각 브랜치에서 작업 → Push
2. 통합 브랜치 생성 → 각 브랜치 머지
3. 통합 브랜치를 main에 PR 생성
4. **PR 생성 시**: 빌드/테스트만 실행
5. PR 머지 시: 빌드 + 배포 실행 🚀

**주의사항:**
- ⚠️ 여러 기능이 한 번에 배포됨
- ⚠️ 문제 발생 시 원인 파악 어려움
- ⚠️ 롤백 시 여러 기능이 함께 롤백됨

---

## 📋 실제 워크플로우 동작

### 각 브랜치별 PR 생성 시

```yaml
# PR 생성 시 실행되는 Job
pr-build-and-test:
  if: github.event_name == 'pull_request'
  # 빌드 + 테스트만 실행
  # 배포는 안 함
```

**실행되는 것:**
- ✅ Docker 이미지 빌드 (태그: `pr-123`)
- ✅ 테스트 실행
- ✅ PR에 빌드 상태 표시

**실행 안 되는 것:**
- ❌ 배포 (서버에 배포 안 함)

---

### PR 머지 시 (main에 머지)

```yaml
# main 브랜치에 머지 시 실행되는 Job
deploy-on-merge:
  if: github.event_name == 'push' && github.ref == 'refs/heads/main'
  # 빌드 + 배포 실행
```

**실행되는 것:**
- ✅ Docker 이미지 빌드 (태그: `latest`)
- ✅ 서버에 배포 🚀

---

## 🔄 실제 사용 예시

### 예시: 4개 기능을 각각 개발

```bash
# 1. 브랜치 A: 인증 기능
git checkout -b feature/auth
# ... 코드 작성 ...
git add .
git commit -m "feat: add authentication"
git push origin feature/auth
# → GitHub에서 PR 생성
# → 빌드/테스트 실행 (배포 안 함)
# → 코드 리뷰 후 머지
# → 배포 실행! 🚀

# 2. 브랜치 B: 결제 기능
git checkout -b feature/payment
# ... 코드 작성 ...
git add .
git commit -m "feat: add payment"
git push origin feature/payment
# → GitHub에서 PR 생성
# → 빌드/테스트 실행 (배포 안 함)
# → 코드 리뷰 후 머지
# → 배포 실행! 🚀

# 3. 브랜치 C: UI 개선
git checkout -b feature/ui
# ... 코드 작성 ...
git add .
git commit -m "feat: improve UI"
git push origin feature/ui
# → GitHub에서 PR 생성
# → 빌드/테스트 실행 (배포 안 함)
# → 코드 리뷰 후 머지
# → 배포 실행! 🚀

# 4. 브랜치 D: API 추가
git checkout -b feature/api
# ... 코드 작성 ...
git add .
git commit -m "feat: add new API"
git push origin feature/api
# → GitHub에서 PR 생성
# → 빌드/테스트 실행 (배포 안 함)
# → 코드 리뷰 후 머지
# → 배포 실행! 🚀
```

**결과:**
- 각 기능이 독립적으로 검증됨
- 각 기능이 하나씩 배포됨
- 문제 발생 시 해당 기능만 롤백 가능

---

## 🎯 여러 브랜치를 하나로 합치는 경우

### 통합 브랜치 생성

```bash
# 1. 통합 브랜치 생성
git checkout -b feature/integration

# 2. 각 브랜치 머지
git merge feature/auth
git merge feature/payment
git merge feature/ui
git merge feature/api

# 3. 충돌 해결 (필요시)
# ... 충돌 해결 ...

# 4. Push 및 PR 생성
git push origin feature/integration
# → GitHub에서 PR 생성
# → 빌드/테스트 실행 (배포 안 함)
# → 코드 리뷰 후 머지
# → 배포 실행! 🚀
```

**주의:**
- 여러 기능이 한 번에 배포됨
- 문제 발생 시 원인 파악이 어려울 수 있음

---

## 📊 워크플로우 트리거 조건

### PR 생성 시

```yaml
on:
  pull_request:
    branches: [main]
    types: [opened, synchronize, reopened]
```

**트리거:**
- ✅ PR 생성 (`opened`)
- ✅ PR에 새 커밋 Push (`synchronize`)
- ✅ PR 재오픈 (`reopened`)

**실행:**
- 빌드 + 테스트만
- 배포 안 함

---

### PR 머지 시 (main에 Push)

```yaml
on:
  push:
    branches: [main]
```

**트리거:**
- ✅ main 브랜치에 Push (PR 머지 포함)

**실행:**
- 빌드 + 배포 🚀

---

## 💡 권장 워크플로우

### 연구소에서 권장하는 방식

```
각 기능별 브랜치 생성
  ↓
각 브랜치에서 작업 → Push (여러 번 가능)
  ↓
각 브랜치를 main에 PR 생성
  ↓
PR 생성 시: 빌드/테스트만 실행
  ↓
코드 리뷰
  ↓
PR 머지 → main
  ↓
자동 배포! 🚀
```

**장점:**
- ✅ 각 기능별로 독립 검증
- ✅ 점진적 배포 (하나씩)
- ✅ 문제 발생 시 해당 기능만 롤백

---

## 🔧 워크플로우 파일 확인

현재 PR 기반 워크플로우는 다음과 같이 동작합니다:

1. **PR 생성 시**: `.github/workflows/pr-based-ci-cd.yml`의 `pr-build-and-test` Job 실행
   - 빌드 + 테스트만
   - 배포 안 함

2. **PR 머지 시**: `.github/workflows/pr-based-ci-cd.yml`의 `deploy-on-merge` Job 실행
   - 빌드 + 배포 🚀

---

## 📝 요약

**질문: "4개 브랜치를 만들어서 각각 푸시하고, 하나로 모아서 PR해서 main으로 만들 때 배포?"**

**답변:**
- ✅ 맞습니다!
- 다만 "하나로 모아서"는 두 가지 방식이 있습니다:
  1. **각 브랜치를 개별 PR로** (권장) - 각각 머지되면 각각 배포
  2. **통합 브랜치로 합쳐서 하나의 PR로** - 한 번에 배포

**현재 워크플로우:**
- PR 생성 시: 빌드/테스트만 (배포 안 함)
- PR 머지 시: 빌드 + 배포 🚀

---

## 🚀 다음 단계

1. **각 브랜치를 개별 PR로** 만드는 방식 권장
2. 각 PR이 머지될 때마다 자동 배포
3. 문제 발생 시 해당 기능만 롤백 가능
