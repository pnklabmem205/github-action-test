# 워크플로우 정리

## 활성 워크플로우 (1개)

### `multi-branch-deploy.yml` — 메인 CI/CD
- **트리거**: `feature/dev1`~`feature/dev4` push, `main` push, main 대상 PR
- **동작**
  - **feature/dev1~4 push** → 해당 브랜치 Docker 이미지 빌드·푸시 후 **테스트 서버** 배포 (포트 9901, 9902, 9903, 9904)
  - **main push** → 이미지 빌드·푸시 후 **프로덕션 서버** 배포 (포트 8888)
  - **main 대상 PR** → 빌드·테스트만 (배포 없음)
- **필요 Secrets**: `SERVER_HOST`, `SERVER_USER`, `SSH_PASSWORD`, `GHCR_TOKEN`, `PROD_SERVER_HOST`, `PROD_SERVER_USER`, `PROD_SSH_PASSWORD`

---

## 비활성 워크플로우 (`.disabled.yml`)

| 파일 | 비활성화 사유 |
|------|----------------|
| `build-and-deploy.disabled.yml` | main 배포는 `multi-branch-deploy`의 프로덕션 job에서 처리 |
| `hello-world.disabled.yml` | 데모/테스트용, 정리로 비활성화 |

### 다시 쓰고 싶을 때
```bash
# 예: build-and-deploy 다시 사용
mv build-and-deploy.disabled.yml build-and-deploy.yml
```

**참고**: `.disabled.yml` 확장자는 GitHub Actions가 인식하지 않아 실행되지 않습니다.
