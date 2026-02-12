# 테스트 예시

## 🧪 실제 테스트 시나리오

### 시나리오 1: 개발자 1이 작업하고 배포

```bash
# 1. 브랜치 생성
git checkout -b feature/dev1

# 2. 코드 수정 (예시)
cat >> server.js << 'EOF'
// dev1의 추가 작업
console.log('dev1 feature added');
EOF

# 3. 커밋 및 Push
git add .
git commit -m "feat: dev1 작업 추가"
git push origin feature/dev1
```

**예상 결과:**
- ✅ GitHub Actions에서 워크플로우 실행
- ✅ Docker 이미지 빌드 및 GHCR에 푸시
- ✅ 테스트 서버의 포트 9001에 배포
- ✅ 테스트 URL: `http://<DEV1_SERVER_HOST>:9001`
- ✅ API 응답:
  ```json
  {
    "app": "githubactiontest",
    "status": "ok",
    "branch": "feature/dev1",
    "developer": "dev1",
    "time": "2026-02-11T...",
    "message": "This is deployed from branch: feature/dev1 by dev1"
  }
  ```

---

### 시나리오 2: 4명이 동시에 작업

```bash
# 개발자 1
git checkout -b feature/dev1
echo "// dev1 work" >> server.js
git add . && git commit -m "feat: dev1" && git push origin feature/dev1

# 개발자 2
git checkout -b feature/dev2
echo "// dev2 work" >> server.js
git add . && git commit -m "feat: dev2" && git push origin feature/dev2

# 개발자 3
git checkout -b feature/dev3
echo "// dev3 work" >> server.js
git add . && git commit -m "feat: dev3" && git push origin feature/dev3

# 개발자 4
git checkout -b feature/dev4
echo "// dev4 work" >> server.js
git add . && git commit -m "feat: dev4" && git push origin feature/dev4
```

**예상 결과:**
- ✅ 각 개발자별로 독립적으로 배포
- ✅ dev1 → 포트 9001
- ✅ dev2 → 포트 9002
- ✅ dev3 → 포트 9003
- ✅ dev4 → 포트 9004
- ✅ 서로 영향 없음

---

### 시나리오 3: 결정권자가 선택하여 PR 생성

1. **각 테스트 결과 확인**
   ```bash
   # 브라우저 또는 curl로 확인
   curl http://<DEV1_SERVER_HOST>:9001
   curl http://<DEV2_SERVER_HOST>:9002
   curl http://<DEV3_SERVER_HOST>:9003
   curl http://<DEV4_SERVER_HOST>:9004
   ```

2. **가장 마음에 드는 안 선택** (예: dev2)

3. **GitHub에서 PR 생성**
   - Base: `main`
   - Compare: `feature/dev2`

4. **PR 생성 시 자동 실행**
   - ✅ 빌드 및 테스트 실행
   - ✅ 배포는 안 됨
   - ✅ PR에 빌드 상태 표시

5. **PR 머지**
   - 코드 리뷰 후 머지
   - ✅ 프로덕션 배포 자동 실행

---

## 🔍 확인 방법

### 1. GitHub Actions 로그 확인

1. GitHub 저장소 → **Actions** 탭
2. 워크플로우 실행 이력 확인
3. 각 단계별 로그 확인

### 2. 배포 상태 확인

**서버에 SSH 접속:**
```bash
ssh <USER>@<SERVER_HOST> -p 23

# 컨테이너 확인
docker ps | grep app-dev

# 로그 확인
docker logs app-dev1
docker logs app-dev2
docker logs app-dev3
docker logs app-dev4
```

### 3. API 응답 확인

```bash
# 각 개발자별 테스트 URL 확인
curl http://<DEV1_SERVER_HOST>:9001
curl http://<DEV2_SERVER_HOST>:9002
curl http://<DEV3_SERVER_HOST>:9003
curl http://<DEV4_SERVER_HOST>:9004

# 프로덕션 확인
curl http://<PROD_SERVER_HOST>:8888
```

---

## 📝 테스트 체크리스트

### 기본 테스트

- [ ] dev1 브랜치 Push → 포트 9001 배포 확인
- [ ] dev2 브랜치 Push → 포트 9002 배포 확인
- [ ] dev3 브랜치 Push → 포트 9003 배포 확인
- [ ] dev4 브랜치 Push → 포트 9004 배포 확인

### PR 테스트

- [ ] dev1 브랜치를 main에 PR 생성 → 빌드/테스트만 실행 확인
- [ ] PR 머지 → 프로덕션 배포 확인

### 동시 작업 테스트

- [ ] 4명이 동시에 Push → 각자 배포 확인
- [ ] 서로 영향 없는지 확인

---

## 🐛 문제 발생 시

### 배포가 안 될 때

1. **워크플로우 로그 확인**
   - Actions 탭 → 실패한 워크플로우 → 로그 확인

2. **Secrets 확인**
   - Settings → Secrets and variables → Actions
   - 필요한 Secrets가 모두 있는지 확인

3. **서버 접근 확인**
   - SSH 접속 가능한지 확인
   - Docker가 설치되어 있는지 확인

### 포트 충돌

```bash
# 서버에서 포트 사용 확인
sudo lsof -i :9001
sudo lsof -i :9002
sudo lsof -i :9003
sudo lsof -i :9004

# 기존 컨테이너 중지
docker stop app-dev1 app-dev2 app-dev3 app-dev4
docker rm app-dev1 app-dev2 app-dev3 app-dev4
```

---

## 💡 팁

### 빠른 테스트

로컬에서 빠르게 테스트하려면:

```bash
# 브랜치 생성 및 Push
git checkout -b feature/dev1
git push origin feature/dev1

# GitHub Actions에서 실행 확인
# → Actions 탭에서 워크플로우 실행 확인
```

### 브랜치 이름 변경

다른 브랜치 이름을 사용하려면 워크플로우 파일의 `Extract branch info` 스텝을 수정하세요.

---

## ✅ 성공 확인

워크플로우가 정상 작동하면:

1. ✅ 각 브랜치 Push 시 자동 배포
2. ✅ 각 개발자별 독립적인 테스트 환경
3. ✅ PR 생성 시 빌드/테스트만 실행
4. ✅ PR 머지 시 프로덕션 배포

이제 실제로 사용할 수 있습니다! 🎉
