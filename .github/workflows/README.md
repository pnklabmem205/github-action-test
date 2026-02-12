# 워크플로우

## 활성 워크플로우 (이 폴더에는 1개만 유지)

### `multi-branch-deploy.yml`
- **트리거**: `feature/dev1`~`feature/dev4` push, `main` push, main 대상 PR
- **동작**
  - **feature/dev1~4 push** → 테스트 서버 배포 (포트 9901, 9902, 9903, 9904)
  - **main push** → 프로덕션 배포 (포트 8888)
  - **main 대상 PR** → 빌드·테스트만
- **필요 Secrets**: `SERVER_HOST`, `SERVER_USER`, `SSH_PASSWORD`, `GHCR_TOKEN` (테스트·프로덕션 동일 서버 사용)

**이 폴더에 `.yml`은 이 파일만 두어, Actions 탭에는 Multi-Branch Development Deploy만 보이도록 했습니다.**

---

## 예전/테스트용 보관

예전에 쓰던 Build and Deploy, Hello World 등은 **실행되지 않도록** `.github/workflows-archive/`로 옮겨 두었습니다.  
다시 쓰려면 해당 파일을 이 폴더로 복사한 뒤 `.disabled`를 제거해 사용하면 됩니다.
