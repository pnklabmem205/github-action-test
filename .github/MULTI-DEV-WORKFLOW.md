# 다중 개발자 워크플로우 가이드

## 🎯 워크플로우 개요

```
프로젝트
  ├── 브랜치 1 (dev1) → Push → 테스트 서버:포트 9001에 배포
  ├── 브랜치 2 (dev2) → Push → 테스트 서버:포트 9002에 배포
  ├── 브랜치 3 (dev3) → Push → 테스트 서버:포트 9003에 배포
  └── 브랜치 4 (dev4) → Push → 테스트 서버:포트 9004에 배포
        ↓
  결정권자가 선택 → main에 PR
        ↓
  main 머지 → 프로덕션 배포
```

---

## 📋 워크플로우 동작 방식

### 1. 각 개발자가 자신의 브랜치에서 작업

```bash
# 개발자 1
git checkout -b feature/dev1
# ... 코드 작성 ...
git add .
git commit -m "feat: add feature"
git push origin feature/dev1
```

**결과:**
- ✅ 자동 빌드
- ✅ 테스트 서버의 **포트 9001**에 배포
- ✅ 테스트 URL: `http://<DEV1_SERVER_HOST>:9001`

---

### 2. 각 개발자별 테스트 배포

| 개발자 | 브랜치 | 테스트 포트 | 서버 |
|--------|--------|------------|------|
| dev1 | `feature/dev1` | 9001 | DEV1_SERVER_HOST |
| dev2 | `feature/dev2` | 9002 | DEV2_SERVER_HOST |
| dev3 | `feature/dev3` | 9003 | DEV3_SERVER_HOST |
| dev4 | `feature/dev4` | 9004 | DEV4_SERVER_HOST |

**각 브랜치에 Push하면:**
- 해당 개발자의 테스트 서버/포트에 자동 배포
- 다른 개발자에게 영향 없음
- 독립적으로 테스트 가능

---

### 3. 결정권자가 선택하여 main에 PR

```
브랜치 1 (dev1) → 테스트 URL: http://server:9001
브랜치 2 (dev2) → 테스트 URL: http://server:9002
브랜치 3 (dev3) → 테스트 URL: http://server:9003
브랜치 4 (dev4) → 테스트 URL: http://server:9004
  ↓
결정권자가 각 테스트 결과 확인
  ↓
가장 마음에 드는 안 선택 (예: dev2)
  ↓
dev2 브랜치를 main에 PR 생성
  ↓
PR 머지 → 프로덕션 배포 🚀
```

---

### 4. main 머지 시 프로덕션 배포

```
PR 머지 → main 브랜치
  ↓
자동 빌드
  ↓
프로덕션 서버에 배포
  ↓
프로덕션 URL: http://<PROD_SERVER_HOST>:8888
```

---

## 🔧 설정 방법

### 1. GitHub Secrets 설정

**Settings → Secrets and variables → Actions**에서 다음 Secrets 추가:

#### 개발자별 테스트 서버 Secrets

**개발자 1 (dev1):**
- `DEV1_SERVER_HOST` - 테스트 서버 주소
- `DEV1_SERVER_USER` - SSH 사용자명
- `DEV1_SSH_PASSWORD` - SSH 비밀번호

**개발자 2 (dev2):**
- `DEV2_SERVER_HOST`
- `DEV2_SERVER_USER`
- `DEV2_SSH_PASSWORD`

**개발자 3 (dev3):**
- `DEV3_SERVER_HOST`
- `DEV3_SERVER_USER`
- `DEV3_SSH_PASSWORD`

**개발자 4 (dev4):**
- `DEV4_SERVER_HOST`
- `DEV4_SERVER_USER`
- `DEV4_SSH_PASSWORD`

#### 프로덕션 서버 Secrets

- `PROD_SERVER_HOST` - 프로덕션 서버 주소
- `PROD_SERVER_USER` - SSH 사용자명
- `PROD_SSH_PASSWORD` - SSH 비밀번호

#### 공통 Secrets

- `GHCR_TOKEN` - GitHub Container Registry 토큰 (비공개 이미지인 경우)

---

### 2. 브랜치 네이밍 규칙

워크플로우는 다음 브랜치 이름을 인식합니다:

- `feature/dev1` 또는 `dev/dev1` → dev1의 테스트 서버 (포트 9001)
- `feature/dev2` 또는 `dev/dev2` → dev2의 테스트 서버 (포트 9002)
- `feature/dev3` 또는 `dev/dev3` → dev3의 테스트 서버 (포트 9003)
- `feature/dev4` 또는 `dev/dev4` → dev4의 테스트 서버 (포트 9004)

**다른 브랜치 이름을 사용하려면:**
워크플로우 파일의 `Extract branch info` 스텝을 수정하세요.

---

### 3. 서버 준비

각 개발자의 테스트 서버에서:

1. **Docker 설치**
   ```bash
   curl -fsSL https://get.docker.com | sh
   ```

2. **포트 열기**
   - dev1: 포트 9001
   - dev2: 포트 9002
   - dev3: 포트 9003
   - dev4: 포트 9004

3. **SSH 접속 가능**
   - 각 서버에서 SSH 비밀번호 로그인 허용
   - 또는 SSH 키 설정

---

## 📊 워크플로우 동작 흐름

### 시나리오: 4명이 동시에 작업

```
시간: 09:00
  ↓
dev1: feature/dev1 브랜치에 Push
  → 빌드 → 테스트 서버:9001 배포 ✅
  → 테스트 URL: http://server1:9001

dev2: feature/dev2 브랜치에 Push
  → 빌드 → 테스트 서버:9002 배포 ✅
  → 테스트 URL: http://server2:9002

dev3: feature/dev3 브랜치에 Push
  → 빌드 → 테스트 서버:9003 배포 ✅
  → 테스트 URL: http://server3:9003

dev4: feature/dev4 브랜치에 Push
  → 빌드 → 테스트 서버:9004 배포 ✅
  → 테스트 URL: http://server4:9004

시간: 15:00
  ↓
결정권자가 4개 테스트 결과 확인
  → dev2가 가장 좋음
  → dev2 브랜치를 main에 PR 생성
  → PR 머지
  → 프로덕션 배포 🚀
```

---

## 🎯 장점

### 1. 독립적인 개발 환경

- ✅ 각 개발자가 자신의 테스트 환경에서 작업
- ✅ 다른 개발자에게 영향 없음
- ✅ 동시에 여러 안을 테스트 가능

### 2. 빠른 피드백

- ✅ Push만 하면 즉시 테스트 가능
- ✅ 빌드/배포 자동화로 시간 절약
- ✅ 실시간으로 결과 확인 가능

### 3. 안전한 프로덕션 배포

- ✅ 테스트 완료된 코드만 프로덕션 배포
- ✅ 결정권자가 최종 선택
- ✅ PR 기반으로 코드 리뷰 가능

---

## 🔍 문제 해결

### 특정 개발자의 배포가 안 될 때

1. **브랜치 이름 확인**
   - `feature/dev1`, `dev/dev1` 형식인지 확인
   - 대소문자 구분 확인

2. **Secrets 확인**
   - 해당 개발자의 Secrets가 설정되어 있는지 확인
   - `DEV1_SERVER_HOST`, `DEV1_SERVER_USER`, `DEV1_SSH_PASSWORD` 등

3. **서버 접근 확인**
   - 테스트 서버가 외부에서 접근 가능한지 확인
   - SSH 포트(23)가 열려 있는지 확인

### 모든 개발자가 같은 서버를 사용하는 경우

**옵션 1: 같은 서버, 다른 포트 (현재 방식)**
- 각 개발자별로 다른 포트 사용
- 예: dev1 → 9001, dev2 → 9002 등

**옵션 2: 같은 서버, 다른 컨테이너 이름**
- 컨테이너 이름으로 구분
- 예: `app-dev1`, `app-dev2` 등

---

## 📝 커스터마이징

### 다른 브랜치 이름 사용

워크플로우 파일의 `Extract branch info` 스텝을 수정:

```yaml
case "$BRANCH_NAME" in
  feature/john|dev/john)
    echo "server_host=JOHN_SERVER_HOST" >> $GITHUB_OUTPUT
    echo "deploy_port=9010" >> $GITHUB_OUTPUT
    ;;
  # ... 다른 개발자 추가
esac
```

### 다른 포트 사용

`deploy_port` 값을 원하는 포트로 변경:

```yaml
echo "deploy_port=9010" >> $GITHUB_OUTPUT  # 9001 대신 9010 사용
```

### 같은 서버 사용

모든 개발자가 같은 서버를 사용하는 경우:

```yaml
case "$BRANCH_NAME" in
  feature/dev1|dev/dev1)
    echo "server_host=SHARED_SERVER_HOST" >> $GITHUB_OUTPUT
    echo "deploy_port=9001" >> $GITHUB_OUTPUT
    ;;
  feature/dev2|dev/dev2)
    echo "server_host=SHARED_SERVER_HOST" >> $GITHUB_OUTPUT
    echo "deploy_port=9002" >> $GITHUB_OUTPUT
    ;;
  # ...
esac
```

---

## ✅ 체크리스트

### 초기 설정

- [ ] 워크플로우 파일 복사 (`.github/workflows/multi-branch-deploy.yml`)
- [ ] GitHub Secrets 설정 (각 개발자별 + 프로덕션)
- [ ] 각 테스트 서버 준비 (Docker 설치, 포트 열기)
- [ ] 브랜치 네이밍 규칙 확인

### 테스트

- [ ] dev1 브랜치에 Push → 포트 9001 배포 확인
- [ ] dev2 브랜치에 Push → 포트 9002 배포 확인
- [ ] dev3 브랜치에 Push → 포트 9003 배포 확인
- [ ] dev4 브랜치에 Push → 포트 9004 배포 확인
- [ ] main에 PR 머지 → 프로덕션 배포 확인

---

## 💡 요약

**질문: "4명이 각각 브랜치를 맡아서 작업하고, 각자 테스트 서버에 배포한 후, 결정권자가 선택해서 main에 PR하면 프로덕션 배포?"**

**답변:**
- ✅ **완전히 가능합니다!**
- ✅ 각 브랜치 Push → 각자 테스트 서버/포트에 배포
- ✅ PR 생성 → 빌드/테스트만 (배포 안 함)
- ✅ PR 머지 → 프로덕션 배포

**현재 워크플로우:**
- `.github/workflows/multi-branch-deploy.yml` - 다중 브랜치 배포 워크플로우
