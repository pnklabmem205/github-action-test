# AI Agent를 위한 GitHub Actions 분석 가이드

## 🎯 목적

이 문서는 AI Agent가 GitHub Actions 워크플로우 실행 데이터를 효과적으로 분석할 수 있도록 구조화된 데이터 형식과 분석 포인트를 정의합니다.

---

## 📊 데이터 수집 전략

### 1. 구조화된 리포트 생성

모든 워크플로우는 실행 후 구조화된 JSON 리포트를 생성해야 합니다.

**리포트 위치**: `.github/reports/{workflow-name}-{run-id}.json`

**리포트 형식**:
```json
{
  "metadata": {
    "workflow_name": "CI Pipeline",
    "run_id": 12345,
    "run_number": 42,
    "trigger": "push",
    "branch": "main",
    "commit_sha": "abc123...",
    "actor": "username",
    "created_at": "2024-01-15T10:00:00Z",
    "updated_at": "2024-01-15T10:05:00Z",
    "duration_seconds": 300
  },
  "status": {
    "overall": "success",
    "jobs": {
      "total": 3,
      "successful": 3,
      "failed": 0,
      "cancelled": 0
    }
  },
  "jobs": [
    {
      "name": "lint",
      "status": "completed",
      "conclusion": "success",
      "duration_seconds": 45,
      "steps": [
        {
          "name": "Checkout",
          "status": "completed",
          "duration_seconds": 5
        },
        {
          "name": "Run Linter",
          "status": "completed",
          "duration_seconds": 35,
          "output": {
            "errors": 0,
            "warnings": 2
          }
        }
      ]
    }
  ],
  "artifacts": [
    {
      "name": "test-results",
      "size_bytes": 102400,
      "type": "json"
    }
  ],
  "metrics": {
    "total_duration": 300,
    "queue_time": 10,
    "execution_time": 290,
    "resource_usage": {
      "cpu_percent": 45,
      "memory_mb": 512
    }
  }
}
```

### 2. 주기적 집계 리포트

주간/월간 집계 리포트를 생성하여 트렌드 분석을 가능하게 합니다.

**리포트 위치**: `.github/reports/aggregated/{period}-summary.json`

**집계 리포트 형식**:
```json
{
  "period": {
    "start": "2024-01-01T00:00:00Z",
    "end": "2024-01-31T23:59:59Z",
    "type": "monthly"
  },
  "summary": {
    "total_runs": 150,
    "successful_runs": 142,
    "failed_runs": 8,
    "cancelled_runs": 0,
    "success_rate": 94.67,
    "average_duration_seconds": 280,
    "total_duration_seconds": 42000
  },
  "workflows": {
    "ci": {
      "runs": 80,
      "success_rate": 96.25,
      "average_duration": 250
    },
    "deploy": {
      "runs": 20,
      "success_rate": 90.0,
      "average_duration": 180
    }
  },
  "trends": {
    "success_rate": {
      "current": 94.67,
      "previous": 92.5,
      "change": "+2.17",
      "direction": "improving"
    },
    "duration": {
      "current_avg": 280,
      "previous_avg": 275,
      "change": "+5",
      "direction": "stable"
    }
  },
  "failure_analysis": {
    "total_failures": 8,
    "common_causes": [
      {
        "cause": "test_timeout",
        "count": 5,
        "percentage": 62.5,
        "last_occurrence": "2024-01-28T14:30:00Z"
      },
      {
        "cause": "dependency_error",
        "count": 2,
        "percentage": 25.0,
        "last_occurrence": "2024-01-25T09:15:00Z"
      }
    ]
  },
  "performance_insights": [
    {
      "type": "slowdown_detected",
      "workflow": "ci",
      "severity": "medium",
      "description": "Average duration increased by 15% compared to previous period"
    }
  ]
}
```

---

## 🔍 AI Agent 분석 포인트

### 1. 성능 분석

**분석 항목**:
- 워크플로우 실행 시간 추이
- 작업별 실행 시간 비교
- 병목 지점 식별
- 리소스 사용량 패턴

**질문 예시**:
- "어떤 워크플로우가 가장 오래 걸리나요?"
- "최근 실행 시간이 증가했나요?"
- "어떤 작업이 병목인가요?"

### 2. 안정성 분석

**분석 항목**:
- 성공률 추이
- 실패 패턴 분석
- 재현 가능한 실패 식별
- 특정 브랜치/커밋과의 연관성

**질문 예시**:
- "실패율이 높아지고 있나요?"
- "가장 자주 실패하는 워크플로우는?"
- "특정 시간대에 실패가 집중되나요?"

### 3. 효율성 분석

**분석 항목**:
- 불필요한 워크플로우 실행
- 중복 작업 식별
- 캐시 활용도
- 리소스 낭비 지점

**질문 예시**:
- "불필요하게 자주 실행되는 워크플로우가 있나요?"
- "캐시를 더 활용할 수 있는 부분은?"
- "병렬화로 개선할 수 있는 작업은?"

### 4. 트렌드 예측

**분석 항목**:
- 성능 저하 예측
- 실패 가능성 예측
- 리소스 사용량 예측
- 비용 최적화 기회

**질문 예시**:
- "다음 주에 실패율이 증가할 가능성이 있나요?"
- "리소스 사용량이 증가 추세인가요?"
- "최적화가 필요한 부분은?"

---

## 📝 워크플로우 작성 가이드라인

### 필수 요소

1. **메타데이터 출력**: 모든 워크플로우는 실행 메타데이터를 출력해야 함
2. **구조화된 로그**: 중요한 정보는 구조화된 형식으로 출력
3. **리포트 생성**: 실행 후 JSON 리포트 생성
4. **에러 처리**: 실패 시 상세한 에러 정보 포함

### 권장 사항

1. **타임스탬프**: 모든 단계에 타임스탬프 포함
2. **단계별 지속 시간**: 각 단계의 실행 시간 측정
3. **조건부 출력**: 중요한 이벤트만 로그에 출력
4. **아티팩트 저장**: 분석에 필요한 데이터는 아티팩트로 저장

---

## 🛠️ 구현 예시

### 리포트 생성 워크플로우

```yaml
name: Generate Workflow Report

on:
  workflow_run:
    workflows: ["CI", "Deploy"]
    types: [completed]

jobs:
  generate-report:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Collect workflow data
        uses: actions/github-script@v6
        id: collect
        with:
          script: |
            const run = await github.rest.actions.getWorkflowRun({
              owner: context.repo.owner,
              repo: context.repo.repo,
              run_id: context.payload.workflow_run.id
            });
            
            const jobs = await github.rest.actions.listJobsForWorkflowRun({
              owner: context.repo.owner,
              repo: context.repo.repo,
              run_id: context.payload.workflow_run.id
            });
            
            const report = {
              metadata: {
                workflow_name: run.data.name,
                run_id: run.data.id,
                run_number: run.data.run_number,
                status: run.data.status,
                conclusion: run.data.conclusion,
                created_at: run.data.created_at,
                updated_at: run.data.updated_at,
                duration_seconds: Math.floor(
                  (new Date(run.data.updated_at) - new Date(run.data.created_at)) / 1000
                )
              },
              jobs: jobs.data.jobs.map(job => ({
                name: job.name,
                status: job.status,
                conclusion: job.conclusion,
                duration_seconds: job.steps
                  .reduce((sum, step) => sum + (step.completed_at && step.started_at 
                    ? Math.floor((new Date(step.completed_at) - new Date(step.started_at)) / 1000)
                    : 0), 0)
              }))
            };
            
            const fs = require('fs');
            const reportPath = `.github/reports/${run.data.name}-${run.data.id}.json`;
            fs.mkdirSync('.github/reports', { recursive: true });
            fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
            
            return report;
      
      - name: Upload report
        uses: actions/upload-artifact@v3
        with:
          name: workflow-report
          path: .github/reports/*.json
      
      - name: Commit report
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add .github/reports/
          git commit -m "chore: add workflow report for run ${{ github.run_id }}" || exit 0
          git push
```

---

## 📈 분석 쿼리 예시

### GitHub API를 통한 데이터 수집

```javascript
// 모든 워크플로우 실행 데이터 수집
const runs = await github.rest.actions.listWorkflowRunsForRepo({
  owner: context.repo.owner,
  repo: context.repo.repo,
  per_page: 100
});

// 특정 워크플로우의 실행 통계
const workflowRuns = await github.rest.actions.listWorkflowRuns({
  owner: context.repo.owner,
  repo: context.repo.repo,
  workflow_id: 'ci.yml',
  per_page: 100
});

// 실행 상세 정보
const run = await github.rest.actions.getWorkflowRun({
  owner: context.repo.owner,
  repo: context.repo.repo,
  run_id: runId
});
```

---

## 🎯 AI Agent 질문 예시

다음과 같은 질문에 답할 수 있어야 합니다:

1. **성능 관련**
   - "지난 달 평균 워크플로우 실행 시간은?"
   - "어떤 워크플로우가 가장 느린가요?"
   - "최근 실행 시간이 증가했나요?"

2. **안정성 관련**
   - "이번 주 성공률은 몇 퍼센트인가요?"
   - "가장 자주 실패하는 워크플로우는?"
   - "실패 원인 분석을 해주세요"

3. **효율성 관련**
   - "불필요하게 실행되는 워크플로우가 있나요?"
   - "캐시 활용도를 높일 수 있는 부분은?"
   - "병렬화로 개선할 수 있는 작업은?"

4. **트렌드 관련**
   - "성능 저하 추세가 있나요?"
   - "다음 주 실패율 예측은?"
   - "최적화가 필요한 부분은?"

---

## 📌 체크리스트

워크플로우가 AI 분석 가능한지 확인:

- [ ] 실행 후 구조화된 리포트 생성
- [ ] 메타데이터 포함 (실행 시간, 상태 등)
- [ ] 주기적 집계 리포트 생성
- [ ] 실패 시 상세 에러 정보 포함
- [ ] 트렌드 분석 가능한 시계열 데이터
- [ ] GitHub API를 통한 데이터 접근 가능
