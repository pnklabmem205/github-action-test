# Build & Deploy 워크플로 설정

`main`(또는 `master`) 브랜치에 push하면 **Docker 이미지 빌드 → GHCR 푸시 → 로컬(또는 우리) 서버에 자동 배포**됩니다.

## 1. GitHub 저장소 시크릿 설정

**Settings → Secrets and variables → Actions**에서 아래 시크릿을 등록하세요.

| 시크릿 이름 | 설명 | 필수 |
|------------|------|------|
| `SERVER_HOST` | 배포 대상 서버 주소 (IP 또는 도메인) | ✅ |
| `SERVER_USER` | SSH 로그인 사용자 (예: `ubuntu`, `deploy`) | ✅ |
| `SSH_PASSWORD` | 해당 사용자의 SSH 로그인 비밀번호 | ✅ |
| `GHCR_TOKEN` | GitHub Packages(GHCR) 읽기용 토큰 (비공개 이미지일 때) | ⭕ |

- 현재 워크플로는 **비밀번호 인증**을 사용합니다. PEM 키로 바꾸려면 워크플로에서 `password` 대신 `key: ${{ secrets.SSH_PRIVATE_KEY }}`를 사용하면 됩니다.
- **공개 저장소**이고 패키지도 공개라면 `GHCR_TOKEN` 없이 배포 가능합니다.
- **비공개 저장소/패키지**라면 [Personal Access Token](https://github.com/settings/tokens)을 만들고 `read:packages` 권한을 준 뒤 `GHCR_TOKEN`에 넣으세요.

## 2. 배포 서버 준비

배포 대상 서버에서:

1. **Docker 설치**
   - 예: `curl -fsSL https://get.docker.com | sh`
2. **SSH 접속 가능**
   - 워크플로에서는 **비밀번호 인증**을 사용합니다. 서버에서 해당 계정(`SERVER_USER`)으로 비밀번호 로그인이 허용되어 있어야 합니다. (일부 서버는 보안상 비밀번호 로그인을 비활성화해 두었을 수 있음)
3. **방화벽**
   - SSH 포트(**23**)와 앱 포트(**8888**)를 열어두세요.

## 3. 동작 요약

1. **Push** → 워크플로 실행
2. **build-and-push**  
   - Docker 이미지 빌드  
   - `ghcr.io/<owner>/<repo>:latest` 로 GHCR에 푸시
3. **deploy**  
   - 서버에 SSH 접속 (포트 **23**)  
   - `docker pull` → 기존 `app` 컨테이너 중지/삭제 → 새 컨테이너 `app`으로 실행 (포트 **8888**)

## 4. 수동 실행

**Actions** 탭에서 **Build and Deploy** 워크플로를 선택한 뒤 **Run workflow**로 수동 실행할 수 있습니다.

## 5. 트러블슈팅

### SSH 연결 실패 (`dial tcp ***:22: i/o timeout`)

**가능한 원인:**

1. **서버가 외부에서 접근 불가능**
   - 로컬 네트워크(`192.168.x.x`, `10.x.x.x` 등)에 있으면 GitHub Actions 러너에서 접근 불가
   - **해결**: 공인 IP 할당 또는 VPN/터널링 필요

2. **방화벽에서 SSH 포트 차단**
   - 서버 방화벽 또는 클라우드 보안 그룹에서 SSH 포트(현재 설정: **23**) 차단
   - **해결**: 포트 23 열기
     ```bash
     # Ubuntu/Debian
     sudo ufw allow 23/tcp
     sudo ufw reload
     ```

3. **SERVER_HOST 값 오류**
   - 잘못된 IP/도메인 또는 내부 IP 사용
   - **해결**: 공인 IP 또는 외부 접근 가능한 도메인 사용

4. **SSH 서비스 미실행**
   - **해결**: SSH 서비스 확인
     ```bash
     sudo systemctl status ssh
     sudo systemctl start ssh
     ```

5. **비표준 SSH 포트 사용**
   - 현재 워크플로는 SSH 포트 **23**을 사용합니다.
   - 다른 포트를 사용하려면 워크플로의 `port: 23` 값을 변경하세요.

### 기타 문제

- **비밀번호 로그인 실패**: 서버에서 `PasswordAuthentication yes` 설정 확인 (`/etc/ssh/sshd_config`)
- **docker pull 실패**: 비공개 이미지면 `GHCR_TOKEN` 설정 및 서버에서 `echo "$GHCR_TOKEN" | docker login ghcr.io -u <GitHub사용자명> --password-stdin` 동작 여부 확인.
- **포트 충돌**: 서버에서 이미 8888 포트를 쓰면 `docker run`의 `-p` 값을 바꾸거나, 워크플로의 `-p 8888:3000` 부분을 수정하세요. (현재 설정: 호스트 포트 8888, 컨테이너 내부 포트 3000)
