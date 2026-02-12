# GitHub Actions 다중 개발자 워크플로우

4명의 개발자가 각각 브랜치에서 작업하고, 각자 테스트 서버에 자동 배포하는 워크플로우입니다.

## 🎯 워크플로우 개요

```
프로젝트
  ├── 브랜치 1 (dev1) → Push → 테스트 서버:포트 9001에 배포 ✅
  ├── 브랜치 2 (dev2) → Push → 테스트 서버:포트 9002에 배포 ✅
  ├── 브랜치 3 (dev3) → Push → 테스트 서버:포트 9003에 배포 ✅
  └── 브랜치 4 (dev4) → Push → 테스트 서버:포트 9004에 배포 ✅
        ↓
  결정권자가 선택 → main에 PR
        ↓
  PR 머지 → 프로덕션 배포 🚀
```

## 🚀 빠른 시작

### 1. GitHub Secrets 설정

**Settings → Secrets and variables → Actions**에서 다음 Secrets 추가:

#### 개발자별 테스트 서버
- `DEV1_SERVER_HOST`, `DEV1_SERVER_USER`, `DEV1_SSH_PASSWORD`
- `DEV2_SERVER_HOST`, `DEV2_SERVER_USER`, `DEV2_SSH_PASSWORD`
- `DEV3_SERVER_HOST`, `DEV3_SERVER_USER`, `DEV3_SSH_PASSWORD`
- `DEV4_SERVER_HOST`, `DEV4_SERVER_USER`, `DEV4_SSH_PASSWORD`

#### 프로덕션 서버
- `PROD_SERVER_HOST`, `PROD_SERVER_USER`, `PROD_SSH_PASSWORD`

### 2. 브랜치 생성 및 Push

```bash
# 개발자 1
git checkout -b feature/dev1
git add .
git commit -m "feat: dev1 작업"
git push origin feature/dev1
# → 자동으로 포트 9001에 배포
```

### 3. 테스트 확인

각 개발자별 테스트 URL:
- dev1: `http://<DEV1_SERVER_HOST>:9001`
- dev2: `http://<DEV2_SERVER_HOST>:9002`
- dev3: `http://<DEV3_SERVER_HOST>:9003`
- dev4: `http://<DEV4_SERVER_HOST>:9004`

### 4. PR 생성 및 머지

1. 결정권자가 테스트 결과 확인
2. 가장 마음에 드는 안 선택
3. 해당 브랜치를 main에 PR 생성
4. PR 머지 → 프로덕션 배포 🚀

## 📚 상세 가이드

- [`.github/SETUP-GUIDE.md`](.github/SETUP-GUIDE.md) - 설정 가이드
- [`.github/MULTI-DEV-WORKFLOW.md`](.github/MULTI-DEV-WORKFLOW.md) - 워크플로우 상세 설명
- [`TEST-EXAMPLES.md`](TEST-EXAMPLES.md) - 테스트 예시

## 📋 브랜치 네이밍 규칙

- `feature/dev1` 또는 `dev/dev1` → dev1의 테스트 서버 (포트 9001)
- `feature/dev2` 또는 `dev/dev2` → dev2의 테스트 서버 (포트 9002)
- `feature/dev3` 또는 `dev/dev3` → dev3의 테스트 서버 (포트 9003)
- `feature/dev4` 또는 `dev/dev4` → dev4의 테스트 서버 (포트 9004)

## 🔧 파일 구조

```
.
├── .github/
│   ├── workflows/
│   │   └── multi-branch-deploy.yml  # 다중 브랜치 배포 워크플로우
│   ├── SETUP-GUIDE.md               # 설정 가이드
│   └── MULTI-DEV-WORKFLOW.md        # 워크플로우 상세 설명
├── server.js                         # 간단한 Node.js 앱
├── Dockerfile                        # Docker 이미지 빌드 파일
├── package.json                      # Node.js 패키지 설정
└── README.md                         # 이 파일
```

## ✅ 체크리스트

### 초기 설정
- [ ] GitHub Secrets 설정 (각 개발자별 + 프로덕션)
- [ ] 각 테스트 서버 준비 (Docker 설치, 포트 열기)
- [ ] 워크플로우 파일 확인

### 테스트
- [ ] dev1 브랜치에 Push → 포트 9001 배포 확인
- [ ] dev2 브랜치에 Push → 포트 9002 배포 확인
- [ ] dev3 브랜치에 Push → 포트 9003 배포 확인
- [ ] dev4 브랜치에 Push → 포트 9004 배포 확인
- [ ] main에 PR 생성 → 빌드/테스트만 실행 확인
- [ ] PR 머지 → 프로덕션 배포 확인

## 🎯 주요 기능

- ✅ 각 브랜치 Push 시 자동 배포
- ✅ 각 개발자별 독립적인 테스트 환경
- ✅ PR 생성 시 빌드/테스트만 실행 (배포 안 함)
- ✅ PR 머지 시 프로덕션 배포
- ✅ Docker 이미지 자동 빌드 및 GHCR 푸시
- ✅ 멀티 아키텍처 지원 (amd64, arm64)

## 📖 더 알아보기

자세한 내용은 [`.github/SETUP-GUIDE.md`](.github/SETUP-GUIDE.md)를 참고하세요.
