# 배포 확인 방법

워크플로가 성공했다고 나와도, 실제로 서버에서 앱이 정상 실행 중인지 확인해야 합니다.

## 1. 서버에 SSH 접속해서 확인

### 컨테이너 실행 상태 확인

```bash
# 서버에 SSH 접속
ssh <SERVER_USER>@<SERVER_HOST> -p 23

# Docker 컨테이너 목록 확인
docker ps

# "app" 컨테이너가 실행 중이어야 함
# 예시 출력:
# CONTAINER ID   IMAGE                                          STATUS         PORTS                    NAMES
# abc123def456   ghcr.io/pnklabmem205/github-action-test:latest   Up 2 minutes   0.0.0.0:8888->3000/tcp   app
```

### 컨테이너 로그 확인

```bash
# 최근 로그 확인
docker logs app

# 실시간 로그 확인 (종료: Ctrl+C)
docker logs -f app
```

### 컨테이너 상세 정보 확인

```bash
# 컨테이너 상세 정보
docker inspect app

# 컨테이너가 사용하는 포트 확인
docker port app
```

---

## 2. 앱이 실제로 응답하는지 확인

### 방법 1: curl로 확인 (서버에서)

```bash
# 서버에 SSH 접속한 상태에서
curl http://localhost:8888

# 예상 출력:
# {"app":"githubactiontest","status":"ok","time":"2026-02-11T07:45:00.000Z"}
```

### 방법 2: 외부에서 접속 확인

**브라우저에서:**
```
http://<SERVER_HOST>:8888
```

**또는 curl로:**
```bash
# 로컬 PC에서
curl http://<SERVER_HOST>:8888

# 예상 출력:
# {"app":"githubactiontest","status":"ok","time":"2026-02-11T07:45:00.000Z"}
```

**PowerShell에서:**
```powershell
Invoke-WebRequest -Uri "http://<SERVER_HOST>:8888" | Select-Object -ExpandProperty Content
```

---

## 3. 빠른 확인 스크립트

서버에 SSH 접속해서 한 번에 확인:

```bash
#!/bin/bash
echo "=== 컨테이너 상태 ==="
docker ps --filter "name=app" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo ""
echo "=== 앱 응답 테스트 ==="
curl -s http://localhost:8888 | jq . || curl -s http://localhost:8888

echo ""
echo "=== 최근 로그 (마지막 10줄) ==="
docker logs --tail 10 app
```

---

## 4. 문제가 있을 때 확인할 것들

### 컨테이너가 없거나 중지된 경우

```bash
# 모든 컨테이너 확인 (중지된 것 포함)
docker ps -a

# 컨테이너가 중지되어 있다면 로그 확인
docker logs app

# 재시작
docker start app
```

### 포트가 이미 사용 중인 경우

```bash
# 포트 8888을 사용하는 프로세스 확인
sudo lsof -i :8888
# 또는
sudo netstat -tulpn | grep 8888

# 기존 컨테이너 중지 후 재시작
docker stop app
docker rm app
# 워크플로 다시 실행하거나 수동으로 실행
docker run -d --name app --restart unless-stopped -p 8888:3000 ghcr.io/<owner>/<repo>:latest
```

### 이미지 pull 실패

```bash
# 이미지가 있는지 확인
docker images | grep github-action-test

# 수동으로 pull 시도
docker pull ghcr.io/<owner>/<repo>:latest
```

---

## 5. GitHub Actions 로그에서 확인

워크플로 실행 로그에서 다음 메시지들이 보여야 합니다:

- ✅ `Pull latest image...`
- ✅ `Login Succeeded` (GHCR 로그인)
- ✅ `latest: Pulling from ...`
- ✅ `Stop old container (if any)...`
- ✅ `Run new container...`
- ✅ `Deploy done.`

---

## 6. 자동 확인 스크립트 (선택사항)

배포 후 자동으로 확인하는 스크립트를 워크플로에 추가할 수도 있습니다:

```yaml
- name: Verify deployment
  uses: appleboy/ssh-action@v1.0.3
  with:
    host: ${{ secrets.SERVER_HOST }}
    username: ${{ secrets.SERVER_USER }}
    password: ${{ secrets.SSH_PASSWORD }}
    port: 23
    script: |
      sleep 5  # 컨테이너 시작 대기
      docker ps --filter "name=app" --format "{{.Status}}"
      curl -f http://localhost:8888 || exit 1
```
