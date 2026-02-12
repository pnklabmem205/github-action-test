# 빠른 시작 가이드

## 🚀 지금 바로 적용하기

### 1. NestJS 프로젝트에 적용

```bash
# 1. NestJS 프로젝트로 이동
cd /path/to/your/nestjs-project

# 2. 워크플로우 복사
mkdir -p .github/workflows
cp <이-레포>/githubactiontest/.github/workflows/nestjs-ci-cd.yml .github/workflows/

# 3. Dockerfile 확인 (없으면 생성)
# NestJS 표준 Dockerfile 예시:
# FROM node:20-alpine
# WORKDIR /app
# COPY package*.json ./
# RUN npm ci --only=production
# COPY . .
# RUN npm run build
# EXPOSE 3000
# CMD ["node", "dist/main"]

# 4. GitHub Secrets 설정
# Settings → Secrets and variables → Actions
# - SERVER_HOST
# - SERVER_USER
# - SSH_PASSWORD
# - GHCR_TOKEN (선택)
# - DATABASE_URL (필요시)

# 5. Push!
git add .github/workflows/nestjs-ci-cd.yml
git commit -m "feat: add CI/CD pipeline"
git push
```

---

### 2. ESP32 펌웨어 프로젝트에 적용

```bash
# 1. ESP32 프로젝트로 이동
cd /path/to/your/esp32-project

# 2. 워크플로우 복사
mkdir -p .github/workflows
cp <이-레포>/githubactiontest/.github/workflows/esp32-firmware.yml .github/workflows/

# 3. Push!
git add .github/workflows/esp32-firmware.yml
git commit -m "feat: add firmware build automation"
git push
```

---

### 3. React 프로젝트에 적용

```bash
# 1. React 프로젝트로 이동
cd /path/to/your/react-project

# 2. 워크플로우 복사
mkdir -p .github/workflows
cp <이-레포>/githubactiontest/.github/workflows/react-build-deploy.yml .github/workflows/

# 3. GitHub Secrets 설정
# - FRONTEND_SERVER_HOST
# - FRONTEND_SERVER_USER
# - FRONTEND_SSH_PASSWORD
# - REACT_APP_API_URL (필요시)

# 4. Push!
git add .github/workflows/react-build-deploy.yml
git commit -m "feat: add frontend CI/CD pipeline"
git push
```

---

## 📋 체크리스트

### 공통 설정

- [ ] GitHub 저장소에 `.github/workflows/` 디렉터리 생성
- [ ] 워크플로우 파일 복사
- [ ] GitHub Secrets 설정 (서버 정보 등)
- [ ] 첫 번째 Push 후 Actions 탭에서 실행 확인

### NestJS 프로젝트

- [ ] Dockerfile 존재 확인
- [ ] `package.json`에 빌드 스크립트 확인 (`npm run build`)
- [ ] 데이터베이스 마이그레이션 스크립트 확인 (선택)

### ESP32 프로젝트

- [ ] ESP-IDF 설치 확인 (로컬에서 빌드 가능한지)
- [ ] `firmware/` 디렉터리 구조 확인

### React 프로젝트

- [ ] 빌드 스크립트 확인 (`npm run build`)
- [ ] 환경 변수 설정 확인
- [ ] 웹 서버(Nginx 등) 설정 확인

---

## 🐛 문제 해결

### 워크플로우가 실행되지 않을 때

1. **파일 경로 확인**
   - `.github/workflows/*.yml` 파일이 올바른 위치에 있는지
   - YAML 문법 오류가 없는지

2. **트리거 확인**
   - `on:` 섹션의 브랜치/경로가 맞는지
   - Push한 브랜치가 트리거 조건과 일치하는지

3. **GitHub Actions 활성화 확인**
   - Settings → Actions → Allow all actions

### 배포가 실패할 때

1. **Secrets 확인**
   - 모든 필요한 Secrets가 설정되어 있는지
   - 값이 올바른지 (특히 SSH 비밀번호, 서버 주소)

2. **서버 접근 확인**
   - 서버가 외부에서 접근 가능한지
   - SSH 포트가 열려 있는지
   - Docker가 설치되어 있는지

3. **로그 확인**
   - GitHub Actions 로그에서 정확한 에러 메시지 확인
   - 서버에서 `docker logs app` 확인

---

## 💡 다음 단계

워크플로우가 정상 작동하면:

1. **PR 시 자동 검증 추가** (`.github/workflows/lint.yml`, `test.yml`)
2. **환경별 배포 분리** (개발/스테이징/운영)
3. **알림 설정** (Slack/Discord 웹훅)
4. **성능 모니터링** 추가

자세한 내용은 `.github/LAB-USE-CASES.md` 참고!
