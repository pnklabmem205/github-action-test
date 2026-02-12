# 다중 개발자 워크플로우 설정 가이드

## 🚀 빠른 시작

### 1단계: GitHub Secrets 설정

**Settings → Secrets and variables → Actions**에서 다음 Secrets를 추가하세요.

#### 개발자별 테스트 서버 Secrets

**개발자 1 (dev1):**
```
DEV1_SERVER_HOST = <서버 IP 또는 도메인>
DEV1_SERVER_USER = <SSH 사용자명>
DEV1_SSH_PASSWORD = <SSH 비밀번호>
```

**개발자 2 (dev2):**
```
DEV2_SERVER_HOST = <서버 IP 또는 도메인>
DEV2_SERVER_USER = <SSH 사용자명>
DEV2_SSH_PASSWORD = <SSH 비밀번호>
```

**개발자 3 (dev3):**
```
DEV3_SERVER_HOST = <서버 IP 또는 도메인>
DEV3_SERVER_USER = <SSH 사용자명>
DEV3_SSH_PASSWORD = <SSH 비밀번호>
```

**개발자 4 (dev4):**
```
DEV4_SERVER_HOST = <서버 IP 또는 도메인>
DEV4_SERVER_USER = <SSH 사용자명>
DEV4_SSH_PASSWORD = <SSH 비밀번호>
```

#### 프로덕션 서버 Secrets

```
PROD_SERVER_HOST = <프로덕션 서버 IP 또는 도메인>
PROD_SERVER_USER = <SSH 사용자명>
PROD_SSH_PASSWORD = <SSH 비밀번호>
```

#### 공통 Secrets (선택사항)

```
GHCR_TOKEN = <GitHub Container Registry 토큰>
```
- 비공개 이미지를 사용하는 경우만 필요합니다.
- 공개 저장소/이미지인 경우 생략 가능합니다.

---

### 2단계: 서버 준비

각 테스트 서버에서:

1. **Docker 설치**
   ```bash
   curl -fsSL https://get.docker.com | sh
   ```

2. **포트 열기**
   - dev1 서버: 포트 **9001** 열기
   - dev2 서버: 포트 **9002** 열기
   - dev3 서버: 포트 **9003** 열기
   - dev4 서버: 포트 **9004** 열기
   
   ```bash
   # Ubuntu/Debian 예시
   sudo ufw allow 9001/tcp
   sudo ufw allow 9002/tcp
   sudo ufw allow 9003/tcp
   sudo ufw allow 9004/tcp
   ```

3. **SSH 접속 확인**
   - 각 서버에서 SSH 비밀번호 로그인 허용 확인
   - SSH 포트(23)가 열려 있는지 확인

---

### 3단계: 브랜치 생성 및 테스트

#### 개발자 1 (dev1)

```bash
# 브랜치 생성
git checkout -b feature/dev1

# 코드 수정 (예시)
echo "// dev1의 작업" >> server.js

# 커밋 및 Push
git add .
git commit -m "feat: dev1 작업"
git push origin feature/dev1
```

**결과:**
- ✅ 자동 빌드 시작
- ✅ 테스트 서버의 **포트 9001**에 배포
- ✅ 테스트 URL: `http://<DEV1_SERVER_HOST>:9001`

#### 개발자 2, 3, 4도 동일하게

```bash
# dev2
git checkout -b feature/dev2
# ... 작업 ...
git push origin feature/dev2
# → 포트 9002에 배포

# dev3
git checkout -b feature/dev3
# ... 작업 ...
git push origin feature/dev3
# → 포트 9003에 배포

# dev4
git checkout -b feature/dev4
# ... 작업 ...
git push origin feature/dev4
# → 포트 9004에 배포
```

---

### 4단계: 결정권자가 선택하여 PR 생성

1. **각 테스트 결과 확인**
   - dev1: `http://<DEV1_SERVER_HOST>:9001`
   - dev2: `http://<DEV2_SERVER_HOST>:9002`
   - dev3: `http://<DEV3_SERVER_HOST>:9003`
   - dev4: `http://<DEV4_SERVER_HOST>:9004`

2. **가장 마음에 드는 안 선택** (예: dev2)

3. **PR 생성**
   - GitHub에서 `feature/dev2` 브랜치를 `main`에 PR 생성
   - PR 생성 시 자동으로 빌드/테스트 실행 (배포 안 함)

4. **PR 머지**
   - 코드 리뷰 후 PR 머지
   - 자동으로 프로덕션 배포 실행! 🚀

---

## 📋 브랜치 네이밍 규칙

워크플로우는 다음 브랜치 이름을 인식합니다:

- `feature/dev1` 또는 `dev/dev1` → dev1의 테스트 서버 (포트 9001)
- `feature/dev2` 또는 `dev/dev2` → dev2의 테스트 서버 (포트 9002)
- `feature/dev3` 또는 `dev/dev3` → dev3의 테스트 서버 (포트 9003)
- `feature/dev4` 또는 `dev/dev4` → dev4의 테스트 서버 (포트 9004)

**다른 브랜치 이름을 사용하면:**
- 워크플로우가 실패합니다
- "지원하지 않는 브랜치입니다" 에러 발생

---

## 🔍 테스트 방법

### 1. 각 개발자 브랜치에 Push

```bash
# dev1 브랜치
git checkout -b feature/dev1
echo "console.log('dev1 work');" >> server.js
git add .
git commit -m "feat: dev1 작업"
git push origin feature/dev1
```

**확인:**
- GitHub Actions 탭에서 워크플로우 실행 확인
- 테스트 URL로 접속하여 결과 확인

### 2. PR 생성

```bash
# GitHub에서 feature/dev1을 main에 PR 생성
```

**확인:**
- PR에 빌드 상태 표시 확인
- 빌드/테스트만 실행되고 배포는 안 됨

### 3. PR 머지

```bash
# GitHub에서 PR 머지
```

**확인:**
- 프로덕션 배포 워크플로우 실행 확인
- 프로덕션 URL로 접속하여 결과 확인

---

## 🐛 문제 해결

### 워크플로우가 실행되지 않을 때

1. **브랜치 이름 확인**
   - `feature/dev1`, `dev/dev1` 형식인지 확인
   - 대소문자 구분 확인

2. **워크플로우 파일 확인**
   - `.github/workflows/multi-branch-deploy.yml` 파일이 있는지 확인
   - YAML 문법 오류가 없는지 확인

3. **GitHub Actions 활성화 확인**
   - Settings → Actions → General
   - "Allow all actions and reusable workflows" 선택 확인

### 배포가 실패할 때

1. **Secrets 확인**
   - 필요한 Secrets가 모두 설정되어 있는지 확인
   - Secrets 값이 올바른지 확인

2. **서버 접근 확인**
   - 테스트 서버가 외부에서 접근 가능한지 확인
   - SSH 포트(23)가 열려 있는지 확인
   - Docker가 설치되어 있는지 확인

3. **워크플로우 로그 확인**
   - Actions 탭 → 실패한 워크플로우 → 로그 확인
   - 에러 메시지 확인

---

## 💡 같은 서버 사용하기

모든 개발자가 같은 서버를 사용하는 경우:

**Secrets 설정:**
```
DEV1_SERVER_HOST = <공통 서버 주소>
DEV2_SERVER_HOST = <공통 서버 주소>
DEV3_SERVER_HOST = <공통 서버 주소>
DEV4_SERVER_HOST = <공통 서버 주소>

DEV1_SERVER_USER = <공통 사용자명>
DEV2_SERVER_USER = <공통 사용자명>
DEV3_SERVER_USER = <공통 사용자명>
DEV4_SERVER_USER = <공통 사용자명>

DEV1_SSH_PASSWORD = <공통 비밀번호>
DEV2_SSH_PASSWORD = <공통 비밀번호>
DEV3_SSH_PASSWORD = <공통 비밀번호>
DEV4_SSH_PASSWORD = <공통 비밀번호>
```

**포트만 다르게:**
- dev1 → 9001
- dev2 → 9002
- dev3 → 9003
- dev4 → 9004

---

## 📊 워크플로우 동작 요약

```
브랜치 Push
  ↓
브랜치 이름 확인 (dev1/dev2/dev3/dev4)
  ↓
해당 개발자의 테스트 서버/포트에 배포
  ↓
커밋에 배포 정보 댓글 추가
  ↓
테스트 URL 제공
```

---

## ✅ 체크리스트

### 초기 설정

- [ ] GitHub Secrets 설정 (각 개발자별 + 프로덕션)
- [ ] 각 테스트 서버 준비 (Docker 설치, 포트 열기)
- [ ] 워크플로우 파일 확인 (`.github/workflows/multi-branch-deploy.yml`)

### 테스트

- [ ] dev1 브랜치에 Push → 포트 9001 배포 확인
- [ ] dev2 브랜치에 Push → 포트 9002 배포 확인
- [ ] dev3 브랜치에 Push → 포트 9003 배포 확인
- [ ] dev4 브랜치에 Push → 포트 9004 배포 확인
- [ ] main에 PR 생성 → 빌드/테스트만 실행 확인
- [ ] PR 머지 → 프로덕션 배포 확인

---

## 🎯 다음 단계

워크플로우가 정상 작동하면:

1. **각 개발자가 자신의 브랜치에서 작업**
2. **Push만 하면 자동 배포**
3. **결정권자가 테스트 결과 확인 후 선택**
4. **PR 머지 시 프로덕션 배포**

자세한 내용은 `.github/MULTI-DEV-WORKFLOW.md` 참고!
