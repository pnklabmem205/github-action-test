# 워크플로우 아카이브

이 폴더는 **실행되지 않는** 예전/테스트용 워크플로우 보관용입니다.  
GitHub Actions는 `.github/workflows/` 아래의 `.yml`/`.yaml`만 실행하므로, 여기 있는 파일은 트리거되지 않습니다.

- `build-and-deploy.disabled.yml` — 예전 main 배포용 (현재는 multi-branch-deploy가 담당)
- `hello-world.disabled.yml` — 데모/테스트용

다시 쓰려면 `.github/workflows/`로 복사한 뒤 `.disabled`를 제거해 사용하면 됩니다.
