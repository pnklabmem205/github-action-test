# GitHub Actions 적용 가이드

## 📋 목표

GitHub에서 모든 것을 처리하고, AI Agent를 통해 분석 가능한 형태로 진행사항을 관리하는 것

## 🎯 핵심 원칙

1. **모든 작업은 GitHub에서 추적 가능해야 함**
2. **AI Agent가 분석할 수 있는 구조화된 데이터 생성**
3. **단계적 적용으로 학습 곡선 완화**

---

## 📚 1단계: GitHub Actions 기초 이해

### 1.1 GitHub Actions란?

- GitHub 저장소에서 자동화된 워크플로우를 실행하는 CI/CD 플랫폼
- 코드 푸시, PR 생성, 이슈 생성 등 다양한 이벤트에 반응
- YAML 파일로 워크플로우 정의

### 1.2 기본 구조

```
.github/
└── workflows/
    └── workflow-name.yml
```

### 1.3 워크플로우 파일 기본 템플릿

```yaml
name: Workflow Name

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  job-name:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Step name
        run: echo "Hello World"
```

---

## 🚀 2단계: 단계별 적용 계획

### Phase 1: 기본 자동화 (1주차)

**목표**: 간단한 자동화로 GitHub Actions 경험 쌓기

#### 1.1 Hello World 워크플로우
- 저장소에 간단한 워크플로우 추가
- 수동 트리거로 실행 테스트

#### 1.2 코드 체크 자동화
- 코드 포맷팅 체크
- 린터 실행
- 기본 테스트 실행

**AI 분석 가능 데이터**:
- 워크플로우 실행 결과 (성공/실패)
- 실행 시간
- 각 단계별 로그

### Phase 2: 빌드 및 테스트 자동화 (2주차)

**목표**: 실제 프로젝트 빌드/테스트 파이프라인 구축

#### 2.1 빌드 자동화
- 프로젝트 빌드
- 의존성 설치
- 빌드 아티팩트 생성

#### 2.2 테스트 자동화
- 단위 테스트 실행
- 통합 테스트 실행
- 테스트 커버리지 리포트 생성

**AI 분석 가능 데이터**:
- 빌드 성공률
- 테스트 통과율
- 커버리지 추이
- 실패한 테스트 목록

### Phase 3: 배포 자동화 (3주차)

**목표**: 자동 배포 파이프라인 구축

#### 3.1 환경별 배포
- 개발 환경 자동 배포
- 스테이징 환경 배포 (수동 승인)
- 프로덕션 배포 (태그 기반)

**AI 분석 가능 데이터**:
- 배포 빈도
- 배포 성공률
- 배포 후 오류율

### Phase 4: 진행사항 추적 및 리포트 (4주차)

**목표**: AI Agent가 분석할 수 있는 구조화된 데이터 생성

#### 4.1 워크플로우 메타데이터 수집
- 워크플로우 실행 통계
- 작업별 실행 시간
- 리소스 사용량

#### 4.2 구조화된 리포트 생성
- JSON/CSV 형태의 실행 리포트
- GitHub Releases에 아티팩트 첨부
- 커밋 메시지에 메타데이터 포함

#### 4.3 이슈 자동 생성
- 실패한 워크플로우에 대한 이슈 자동 생성
- 성능 저하 감지 시 알림
- 주간/월간 리포트 이슈 생성

**AI 분석 가능 데이터**:
- 구조화된 JSON 리포트
- 시계열 데이터 (트렌드 분석)
- 실패 패턴 분석
- 성능 메트릭

---

## 🤖 AI Agent 분석을 위한 데이터 구조

### 3.1 워크플로우 실행 리포트 (JSON)

```json
{
  "workflow": {
    "name": "CI Pipeline",
    "run_id": 12345,
    "run_number": 42,
    "status": "success",
    "conclusion": "success",
    "created_at": "2024-01-15T10:00:00Z",
    "updated_at": "2024-01-15T10:05:00Z",
    "duration_seconds": 300
  },
  "jobs": [
    {
      "name": "build",
      "status": "completed",
      "conclusion": "success",
      "duration_seconds": 120,
      "steps": [
        {
          "name": "Checkout",
          "status": "completed",
          "duration_seconds": 5
        },
        {
          "name": "Build",
          "status": "completed",
          "duration_seconds": 100
        }
      ]
    },
    {
      "name": "test",
      "status": "completed",
      "conclusion": "success",
      "duration_seconds": 180,
      "test_results": {
        "total": 150,
        "passed": 148,
        "failed": 2,
        "coverage": 85.5
      }
    }
  ],
  "artifacts": [
    {
      "name": "build-artifact",
      "size_bytes": 1024000
    }
  ]
}
```

### 3.2 진행사항 추적 데이터

```json
{
  "period": "2024-01-01 to 2024-01-31",
  "summary": {
    "total_runs": 150,
    "successful_runs": 142,
    "failed_runs": 8,
    "success_rate": 94.67,
    "average_duration_seconds": 280
  },
  "trends": {
    "success_rate_trend": "improving",
    "duration_trend": "stable",
    "failure_patterns": [
      {
        "pattern": "test_timeout",
        "frequency": 5,
        "last_occurrence": "2024-01-28"
      }
    ]
  }
}
```

---

## 📊 4단계: 실전 적용 예시

### 4.1 NestJS 프로젝트용 CI/CD

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Run tests
        run: npm run test
      
      - name: Generate test coverage
        run: npm run test:cov
      
      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
      
      - name: Generate workflow report
        id: report
        run: |
          echo "::set-output name=status::${{ job.status }}"
          echo "::set-output name=timestamp::$(date -u +%Y-%m-%dT%H:%M:%SZ)"
      
      - name: Create workflow artifact
        uses: actions/upload-artifact@v3
        with:
          name: workflow-report
          path: |
            coverage/
            test-results.json
```

### 4.2 리포트 생성 워크플로우

```yaml
name: Generate Progress Report

on:
  schedule:
    - cron: '0 0 * * 0'  # 매주 일요일 자정
  workflow_dispatch:  # 수동 실행 가능

jobs:
  generate-report:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Generate weekly report
        uses: actions/github-script@v6
        with:
          script: |
            const fs = require('fs');
            const report = {
              period: process.env.PERIOD,
              workflows: await github.rest.actions.listWorkflowRunsForRepo({
                owner: context.repo.owner,
                repo: context.repo.repo,
                per_page: 100
              })
            };
            fs.writeFileSync('progress-report.json', JSON.stringify(report, null, 2));
      
      - name: Create report issue
        uses: actions/github-script@v6
        with:
          script: |
            const report = fs.readFileSync('progress-report.json', 'utf8');
            await github.rest.issues.create({
              owner: context.repo.owner,
              repo: context.repo.repo,
              title: `Weekly Progress Report - ${new Date().toISOString().split('T')[0]}`,
              body: `\`\`\`json\n${report}\n\`\`\``,
              labels: ['report', 'automated']
            });
```

---

## 🔍 5단계: AI Agent 분석 최적화

### 5.1 구조화된 로그 출력

워크플로우에서 구조화된 로그를 출력하면 AI가 분석하기 쉬움:

```yaml
- name: Output structured data
  run: |
    echo "::set-output name=test_count::150"
    echo "::set-output name=test_passed::148"
    echo "::set-output name=test_failed::2"
    echo "::notice title=Test Results::Passed: 148/150"
```

### 5.2 커밋 메시지에 메타데이터 포함

```yaml
- name: Commit with metadata
  run: |
    git commit -m "feat: add new feature
    
    [workflow-metadata]
    build_time: 120s
    test_coverage: 85.5%
    lint_errors: 0
    [/workflow-metadata]"
```

### 5.3 GitHub API를 통한 데이터 수집

```yaml
- name: Collect workflow data
  uses: actions/github-script@v6
  with:
    script: |
      const runs = await github.rest.actions.listWorkflowRunsForRepo({
        owner: context.repo.owner,
        repo: context.repo.repo,
        workflow_id: 'ci.yml',
        per_page: 100
      });
      
      // 구조화된 데이터를 파일로 저장
      const data = runs.data.workflow_runs.map(run => ({
        id: run.id,
        status: run.status,
        conclusion: run.conclusion,
        created_at: run.created_at,
        updated_at: run.updated_at
      }));
      
      fs.writeFileSync('workflow-data.json', JSON.stringify(data, null, 2));
```

---

## 📝 체크리스트

### 초기 설정
- [ ] `.github/workflows` 디렉터리 생성
- [ ] 첫 번째 워크플로우 파일 작성
- [ ] GitHub 저장소에 푸시
- [ ] Actions 탭에서 실행 확인

### 기본 자동화
- [ ] 코드 체크 워크플로우
- [ ] 테스트 자동화
- [ ] 빌드 자동화

### 고급 기능
- [ ] 환경 변수 설정
- [ ] 시크릿 관리
- [ ] 아티팩트 업로드/다운로드
- [ ] 조건부 실행

### AI 분석 준비
- [ ] 구조화된 리포트 생성
- [ ] 주기적 리포트 생성
- [ ] 이슈 자동 생성
- [ ] 메타데이터 수집

---

## 🎓 학습 리소스

1. **공식 문서**: https://docs.github.com/en/actions
2. **워크플로우 예시**: https://github.com/actions/starter-workflows
3. **마켓플레이스**: https://github.com/marketplace?type=actions

---

## 💡 다음 단계

1. 이 가이드를 기반으로 첫 번째 워크플로우 작성
2. 실제 프로젝트에 적용
3. AI Agent가 분석할 수 있는 리포트 형식 결정
4. 주기적 리포트 생성 자동화

---

## 📌 참고사항

- GitHub Actions는 무료 플랜에서도 월 2,000분 제공 (공개 저장소는 무제한)
- 워크플로우 파일은 YAML 문법을 정확히 따라야 함
- 시크릿은 GitHub 저장소 설정에서 관리
- 워크플로우 실행 로그는 90일간 보관
