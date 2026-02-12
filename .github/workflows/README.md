# 워크플로우 관리

## 현재 활성화된 워크플로우

### `multi-branch-deploy.yml`
- **용도**: 다중 개발자 브랜치별 테스트 배포 + 프로덕션 배포
- **상태**: ✅ 활성화
- **설명**: 4명의 개발자가 각각 브랜치에서 작업하고, 각자 테스트 서버에 배포한 후, 결정권자가 선택하여 main에 PR하면 프로덕션 배포

---

## 비활성화된 워크플로우

다음 워크플로우들은 현재 사용 중단 상태입니다 (`.disabled.yml` 확장자):

- `build-and-deploy.disabled.yml` - 기본 빌드/배포 워크플로우
- `esp32-firmware.disabled.yml` - ESP32 펌웨어 빌드 워크플로우
- `hello-world.disabled.yml` - Hello World 테스트 워크플로우
- `nestjs-ci-cd.disabled.yml` - NestJS CI/CD 워크플로우
- `pr-based-ci-cd.disabled.yml` - PR 기반 CI/CD 워크플로우
- `react-build-deploy.disabled.yml` - React 빌드/배포 워크플로우

### 비활성화된 워크플로우를 다시 활성화하려면

1. 파일 이름에서 `.disabled` 제거
   ```bash
   # 예시
   mv build-and-deploy.disabled.yml build-and-deploy.yml
   ```

2. 또는 GitHub에서 직접 파일 이름 변경

---

## 워크플로우 활성화/비활성화 방법

### 비활성화
파일 이름에 `.disabled` 추가:
```bash
mv workflow.yml workflow.disabled.yml
```

### 활성화
파일 이름에서 `.disabled` 제거:
```bash
mv workflow.disabled.yml workflow.yml
```

**참고:** GitHub Actions는 `.yml` 또는 `.yaml` 확장자를 가진 파일만 인식합니다. `.disabled.yml` 확장자는 인식하지 않아 자동으로 비활성화됩니다.
