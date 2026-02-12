# 연구소에서 GitHub Actions 활용 방안

## 🎯 해결할 수 있는 문제들

### 1. **수동 배포의 번거로움 해결**

**현재 문제:**
- 코드 수정 → 빌드 → 서버 접속 → Docker 이미지 빌드 → 배포 (수동 반복)
- 실수로 이전 버전 배포하거나, 빌드 실패를 늦게 발견

**해결:**
- ✅ Push만 하면 자동 빌드 → 배포
- ✅ 빌드 실패 시 즉시 알림
- ✅ 배포 이력 자동 추적 (GitHub Actions 로그)

---

### 2. **데모 → 운영 전환 시 품질 보장**

**현재 문제:**
- 데모 단계에서는 빠르게 만들지만, 운영 전환 시 테스트/검증 부족
- 운영 환경에서만 발견되는 버그

**해결:**
- ✅ **단계별 배포 파이프라인** 구축
  - `develop` 브랜치 → 개발 서버 자동 배포
  - `main` 브랜치 → 스테이징 서버 (수동 승인)
  - 태그 생성 → 프로덕션 배포
- ✅ **자동 테스트** 실행 (코드 품질 검증)
- ✅ **환경별 설정 분리** (개발/스테이징/운영)

---

### 3. **다중 프로젝트 관리**

**현재 문제:**
- 여러 데모 프로젝트 동시 진행
- 각 프로젝트마다 배포 방식이 다름
- 누가 언제 배포했는지 추적 어려움

**해결:**
- ✅ **표준화된 배포 워크플로우** (모든 프로젝트 동일 패턴)
- ✅ **프로젝트별 자동화** (각 레포지토리에 동일한 워크플로우)
- ✅ **배포 이력 자동 기록** (GitHub Actions 로그)

---

### 4. **IoT 디바이스(ESP32) 펌웨어 배포**

**현재 문제:**
- ESP32 펌웨어 빌드/배포가 수동
- 여러 디바이스에 일괄 업데이트 어려움

**해결:**
- ✅ **펌웨어 자동 빌드** (코드 push 시)
- ✅ **OTA(Over-The-Air) 업데이트** 자동화
- ✅ **펌웨어 버전 관리** (Git 태그 기반)

---

### 5. **데이터베이스 마이그레이션 자동화**

**현재 문제:**
- NestJS 프로젝트에서 DB 스키마 변경 시 수동 마이그레이션
- 개발/운영 환경 간 스키마 불일치

**해결:**
- ✅ **배포 시 자동 마이그레이션** 실행
- ✅ **마이그레이션 롤백** 자동화
- ✅ **스키마 변경 이력** 추적

---

### 6. **프론트엔드(React/Flutter) 빌드 및 배포**

**현재 문제:**
- React 웹 빌드 후 수동 배포
- Flutter 앱 빌드/배포 복잡

**해결:**
- ✅ **React 빌드 자동화** → 정적 파일 서버 배포
- ✅ **Flutter 앱 빌드 자동화** (Android APK, iOS IPA)
- ✅ **앱 스토어 배포 자동화** (선택사항)

---

## 🚀 단계별 적용 계획

### Phase 1: 현재 프로젝트에 적용 (1-2주)

**목표:** 지금 만든 워크플로우를 실제 NestJS 프로젝트에 적용

**할 일:**
1. **기존 NestJS 프로젝트에 워크플로우 복사**
   ```bash
   # 기존 프로젝트에 추가
   cp .github/workflows/build-and-deploy.yml <NestJS프로젝트>/.github/workflows/
   ```

2. **Dockerfile 확인/수정**
   - NestJS 프로젝트용 Dockerfile이 있는지 확인
   - 없으면 생성 (NestJS 표준 Dockerfile 사용)

3. **환경 변수 설정**
   - GitHub Secrets에 DB 연결 정보 등 추가
   - 환경별 설정 분리 (개발/운영)

4. **테스트 실행**
   - Push → 자동 배포 확인
   - 실제 서비스 동작 확인

---

### Phase 2: CI 파이프라인 강화 (2-3주)

**목표:** 코드 품질 검증 자동화

**추가할 워크플로우:**

#### 2.1 린터 및 포맷팅 체크
```yaml
# .github/workflows/lint.yml
name: Lint and Format Check
on: [push, pull_request]
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run lint
      - run: npm run format:check
```

#### 2.2 자동 테스트 실행
```yaml
# .github/workflows/test.yml
name: Run Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test
      - run: npm run test:e2e
      - uses: codecov/codecov-action@v3  # 테스트 커버리지 리포트
```

#### 2.3 빌드 검증
```yaml
# .github/workflows/build-check.yml
name: Build Check
on: [pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build Docker image
        run: docker build -t test-image .
```

**효과:**
- PR 생성 시 자동으로 코드 검증
- 문제 있는 코드가 main에 머지되는 것 방지
- 코드 품질 일관성 유지

---

### Phase 3: 환경별 배포 파이프라인 (3-4주)

**목표:** 개발 → 스테이징 → 운영 단계별 배포

**워크플로우 구조:**

```
develop 브랜치 push
  ↓
자동: 개발 서버 배포 (deploy-dev.yml)

main 브랜치 merge
  ↓
자동: 스테이징 서버 배포 (deploy-staging.yml)
  ↓
수동 승인 (GitHub Actions)
  ↓
프로덕션 배포 (deploy-prod.yml)
```

**환경별 설정:**
- 개발: 빠른 배포, 자동 승인
- 스테이징: 실제 운영과 유사한 환경, 수동 승인
- 운영: 안정성 우선, 태그 기반 배포

---

### Phase 4: IoT/프론트엔드 확장 (4-6주)

**ESP32 펌웨어 자동화:**
```yaml
# .github/workflows/firmware-build.yml
name: Build ESP32 Firmware
on:
  push:
    branches: [main]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup ESP-IDF
        uses: espressif/esp-idf-ci-action@v1
      - name: Build firmware
        run: idf.py build
      - name: Upload firmware artifact
        uses: actions/upload-artifact@v3
        with:
          name: firmware
          path: build/*.bin
```

**React 빌드/배포:**
```yaml
# .github/workflows/frontend-deploy.yml
name: Deploy Frontend
on:
  push:
    branches: [main]
    paths:
      - 'frontend/**'
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: cd frontend && npm ci && npm run build
      - name: Deploy to static server
        # 정적 파일 서버에 배포
```

---

## 💡 연구소 특화 활용 사례

### 1. **실험 결과 자동 수집 및 리포트 생성**

**시나리오:** IoT 센서 데이터 수집 실험

```yaml
# .github/workflows/experiment-report.yml
name: Generate Experiment Report
on:
  schedule:
    - cron: '0 0 * * *'  # 매일 자정
  workflow_dispatch:
jobs:
  collect-data:
    runs-on: ubuntu-latest
    steps:
      - name: Collect sensor data
        run: |
          # MQTT 브로커에서 데이터 수집
          python scripts/collect_sensor_data.py
      - name: Generate report
        run: |
          python scripts/generate_report.py
      - name: Create GitHub Issue
        uses: actions/github-script@v6
        with:
          script: |
            # 실험 결과를 이슈로 자동 생성
```

---

### 2. **데모 프로젝트 자동 문서화**

**시나리오:** 코드 변경 시 API 문서 자동 업데이트

```yaml
# .github/workflows/docs.yml
name: Update Documentation
on:
  push:
    branches: [main]
jobs:
  docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Generate API docs
        run: npm run docs:generate
      - name: Deploy docs
        # GitHub Pages 또는 별도 서버에 배포
```

---

### 3. **데이터베이스 백업 자동화**

**시나리오:** 매일 DB 백업 → 필요 시 복원

```yaml
# .github/workflows/db-backup.yml
name: Database Backup
on:
  schedule:
    - cron: '0 2 * * *'  # 매일 새벽 2시
jobs:
  backup:
    runs-on: ubuntu-latest
    steps:
      - name: Backup MySQL
        run: |
          mysqldump -h ${{ secrets.DB_HOST }} ... > backup.sql
      - name: Upload backup
        uses: actions/upload-artifact@v3
        with:
          name: db-backup
          path: backup.sql
```

---

### 4. **성능 모니터링 및 알림**

**시나리오:** 배포 후 성능 저하 감지 시 알림

```yaml
# .github/workflows/monitor.yml
name: Performance Monitor
on:
  workflow_run:
    workflows: ["Build and Deploy"]
    types: [completed]
jobs:
  monitor:
    runs-on: ubuntu-latest
    steps:
      - name: Check API response time
        run: |
          response_time=$(curl -o /dev/null -s -w '%{time_total}' http://${{ secrets.SERVER_HOST }}:8888)
          if (( $(echo "$response_time > 1.0" | bc -l) )); then
            echo "::error::Response time too high: ${response_time}s"
            exit 1
          fi
```

---

## 📊 효과 측정

### 정량적 효과

- **배포 시간 단축:** 수동 30분 → 자동 5분 (83% 감소)
- **배포 실수 감소:** 수동 배포 실수 0% (자동화로 방지)
- **코드 품질 향상:** 린터/테스트 자동 실행으로 버그 조기 발견

### 정성적 효과

- **개발 집중도 향상:** 배포 걱정 없이 코드 작성에 집중
- **협업 효율성:** PR 시 자동 검증으로 코드 리뷰 시간 단축
- **운영 안정성:** 단계별 배포로 운영 환경 안정성 향상

---

## 🎯 다음 단계 액션 아이템

### 이번 주 할 일

1. [ ] **현재 NestJS 프로젝트에 워크플로우 적용**
   - 기존 프로젝트에 `.github/workflows/build-and-deploy.yml` 복사
   - Dockerfile 확인/생성
   - GitHub Secrets 설정
   - 테스트 배포

2. [ ] **PR 시 자동 검증 추가**
   - `.github/workflows/lint.yml` 추가
   - `.github/workflows/test.yml` 추가

### 다음 주 할 일

3. [ ] **환경별 배포 파이프라인 구축**
   - 개발/스테이징/운영 환경 분리
   - 단계별 배포 워크플로우 작성

4. [ ] **배포 알림 설정**
   - Slack/Discord 웹훅 연동
   - 배포 성공/실패 알림

---

## 📚 참고 자료

- [GitHub Actions 공식 문서](https://docs.github.com/en/actions)
- [Docker 공식 문서](https://docs.docker.com/)
- [NestJS 배포 가이드](https://docs.nestjs.com/)

---

## 💬 질문 및 피드백

실제 적용하면서 생기는 문제나 개선 사항은 GitHub Issues에 기록하거나, 팀 내에서 공유하세요.
