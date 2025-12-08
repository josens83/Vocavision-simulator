/**
 * Chapter 3: Content & Narrative - Technical Events (기술 이벤트)
 * 서버, 코드, 인프라, 보안 관련 50+ 이벤트
 */

import type { GameState } from '../../types';
import type { ProbabilisticEvent } from '../../systems/eventEngine';

export const TECHNICAL_EVENTS: ProbabilisticEvent[] = [
  // ============================================
  // 서버/인프라 이벤트 (15개)
  // ============================================
  {
    id: 'tech_server_memory_leak',
    name: '메모리 누수 발견',
    description: '서버 모니터링에서 점진적인 메모리 증가가 감지되었습니다. 몇 시간 후면 서버가 다운될 수 있습니다.',
    icon: '🧠',
    severity: 'warning',
    probability: (state) => (state.business.product.technicalDebt || 0) > 30 ? 0.02 : 0.005,
    choices: [
      {
        id: 'immediate_fix',
        text: '즉시 원인 파악 및 수정 (-30 에너지)',
        effects: [
          { type: 'energy', value: -30 },
          { type: 'technical_debt', value: -10 },
          { type: 'skill_coding', value: 2 },
        ],
        resultText: '프로파일링으로 이벤트 리스너 누수를 찾아 수정했습니다!',
      },
      {
        id: 'restart_cron',
        text: '매일 새벽 서버 재시작 예약',
        effects: [
          { type: 'stability', value: -5 },
          { type: 'technical_debt', value: 5 },
        ],
        resultText: '임시방편이지만 당장은 문제없이 돌아갑니다.',
      },
      {
        id: 'hire_expert',
        text: '성능 전문가 컨설팅 (-800,000원)',
        effects: [
          { type: 'cash', value: -800000 },
          { type: 'technical_debt', value: -20 },
          { type: 'stability', value: 15 },
        ],
        resultText: '전문가가 여러 최적화 포인트를 찾아주었습니다!',
      },
    ],
  },
  {
    id: 'tech_database_slow',
    name: '데이터베이스 성능 저하',
    description: '쿼리 응답 시간이 평소의 5배로 느려졌습니다. 사용자들이 로딩이 느리다고 불평합니다.',
    icon: '🐢',
    severity: 'warning',
    probability: (state) => state.business.users.total > 1000 ? 0.02 : 0.005,
    choices: [
      {
        id: 'add_index',
        text: '인덱스 최적화 (-20 에너지)',
        effects: [
          { type: 'energy', value: -20 },
          { type: 'stability', value: 10 },
          { type: 'skill_coding', value: 1 },
        ],
        resultText: 'EXPLAIN ANALYZE로 분석 후 적절한 인덱스를 추가했습니다!',
      },
      {
        id: 'upgrade_db',
        text: '데이터베이스 스펙 업그레이드 (비용 2배)',
        effects: [
          { type: 'cash', value: -50000 },
          { type: 'stability', value: 15 },
        ],
        resultText: '더 빠른 DB 인스턴스로 마이그레이션했습니다.',
      },
      {
        id: 'implement_cache',
        text: 'Redis 캐싱 레이어 추가 (-40 에너지)',
        effects: [
          { type: 'energy', value: -40 },
          { type: 'stability', value: 20 },
          { type: 'skill_coding', value: 3 },
        ],
        resultText: '자주 조회되는 데이터를 캐싱하니 10배 빨라졌습니다!',
      },
    ],
  },
  {
    id: 'tech_ssl_expiring',
    name: 'SSL 인증서 만료 임박',
    description: 'SSL 인증서가 3일 후 만료됩니다! 갱신하지 않으면 사이트가 "안전하지 않음"으로 표시됩니다.',
    icon: '🔐',
    severity: 'critical',
    probability: () => 0.005,
    choices: [
      {
        id: 'auto_renew',
        text: 'Let\'s Encrypt 자동 갱신 설정 (-15 에너지)',
        effects: [
          { type: 'energy', value: -15 },
          { type: 'stability', value: 5 },
        ],
        resultText: 'certbot으로 자동 갱신을 설정했습니다. 이제 걱정 없어요!',
      },
      {
        id: 'manual_renew',
        text: '수동으로 갱신',
        effects: [
          { type: 'energy', value: -5 },
        ],
        resultText: '갱신 완료! 하지만 다음에도 수동으로 해야 합니다.',
      },
      {
        id: 'premium_ssl',
        text: '유료 SSL 구매 (-50,000원/년)',
        effects: [
          { type: 'cash', value: -50000 },
          { type: 'reputation', value: 5 },
        ],
        resultText: 'EV SSL로 녹색 주소창 표시! 신뢰도가 올랐습니다.',
      },
    ],
  },
  {
    id: 'tech_cdn_outage',
    name: 'CDN 장애',
    description: '사용 중인 CDN 서비스에 글로벌 장애가 발생했습니다. 이미지와 정적 파일이 로드되지 않습니다.',
    icon: '🌐',
    severity: 'critical',
    probability: () => 0.003,
    choices: [
      {
        id: 'fallback_origin',
        text: '오리진 서버로 폴백',
        effects: [
          { type: 'server_health', value: -20 },
          { type: 'stability', value: -10 },
        ],
        resultText: '서버 부하가 늘었지만 서비스는 유지됩니다.',
      },
      {
        id: 'multi_cdn',
        text: '멀티 CDN 구성 (-30 에너지, -100,000원)',
        effects: [
          { type: 'energy', value: -30 },
          { type: 'cash', value: -100000 },
          { type: 'stability', value: 20 },
        ],
        resultText: '이제 CDN이 이중화되어 장애에 강해졌습니다!',
      },
      {
        id: 'wait',
        text: 'CDN 복구를 기다린다',
        effects: [
          { type: 'reputation', value: -15 },
          { type: 'users', value: -10 },
        ],
        resultText: '2시간 후 복구되었지만 많은 사용자가 불편을 겪었습니다.',
      },
    ],
  },
  {
    id: 'tech_backup_failed',
    name: '백업 실패 알림',
    description: '자동 백업이 3일째 실패하고 있습니다. 데이터 손실 위험이 있습니다.',
    icon: '💾',
    severity: 'warning',
    probability: () => 0.01,
    choices: [
      {
        id: 'fix_backup',
        text: '백업 시스템 점검 (-20 에너지)',
        effects: [
          { type: 'energy', value: -20 },
          { type: 'stability', value: 10 },
        ],
        resultText: '디스크 공간 부족이 원인! 정리하고 백업을 재설정했습니다.',
      },
      {
        id: 'manual_backup',
        text: '수동으로 긴급 백업',
        effects: [
          { type: 'energy', value: -10 },
        ],
        resultText: '일단 백업은 받았지만 근본 원인은 해결하지 못했습니다.',
      },
      {
        id: 'upgrade_storage',
        text: '스토리지 업그레이드 (-80,000원/월)',
        effects: [
          { type: 'cash', value: -80000 },
          { type: 'stability', value: 15 },
        ],
        resultText: '넉넉한 스토리지로 백업 걱정이 없어졌습니다!',
      },
    ],
  },
  {
    id: 'tech_traffic_spike',
    name: '예상치 못한 트래픽 급증',
    description: '갑자기 평소의 10배 트래픽이 들어오고 있습니다! 서버가 버거워합니다.',
    icon: '📈',
    severity: 'warning',
    probability: (state) => state.business.users.total > 500 ? 0.015 : 0.005,
    choices: [
      {
        id: 'scale_up',
        text: '서버 스케일 업 (-150,000원)',
        effects: [
          { type: 'cash', value: -150000 },
          { type: 'server_health', value: 20 },
          { type: 'users', value: 50 },
        ],
        resultText: '서버를 증설해서 모든 트래픽을 처리했습니다!',
      },
      {
        id: 'rate_limit',
        text: '일시적 속도 제한 적용',
        effects: [
          { type: 'reputation', value: -5 },
          { type: 'users', value: 20 },
        ],
        resultText: '일부 사용자가 대기해야 했지만 서비스는 안정적이었습니다.',
      },
      {
        id: 'wait_and_see',
        text: '상황을 지켜본다',
        effects: [
          { type: 'server_health', value: -30 },
          { type: 'reputation', value: -10 },
        ],
        resultText: '서버가 잠시 다운되어 많은 신규 사용자를 놓쳤습니다.',
        probability: 0.4,
      },
    ],
  },
  {
    id: 'tech_vercel_limit',
    name: 'Vercel 무료 한도 초과',
    description: 'Vercel 무료 플랜의 월간 대역폭 한도를 초과했습니다.',
    icon: '▲',
    severity: 'warning',
    probability: (state) => state.business.users.dau > 200 ? 0.03 : 0,
    choices: [
      {
        id: 'upgrade_pro',
        text: 'Pro 플랜 업그레이드 (-$20/월)',
        effects: [
          { type: 'cash', value: -26000 },
          { type: 'stability', value: 10 },
        ],
        resultText: 'Pro 플랜으로 여유로워졌습니다!',
      },
      {
        id: 'optimize_assets',
        text: '에셋 최적화로 대역폭 절감 (-25 에너지)',
        effects: [
          { type: 'energy', value: -25 },
          { type: 'skill_coding', value: 2 },
        ],
        resultText: '이미지 압축과 코드 스플리팅으로 50% 절감!',
      },
      {
        id: 'wait_next_month',
        text: '다음 달까지 사이트 일시 중단',
        effects: [
          { type: 'reputation', value: -20 },
          { type: 'users', value: -30 },
        ],
        resultText: '최악의 선택... 많은 사용자가 떠났습니다.',
      },
    ],
  },
  {
    id: 'tech_supabase_free_limit',
    name: 'Supabase 무료 DB 한계',
    description: 'Supabase 무료 플랜의 500MB 스토리지 한도에 도달했습니다.',
    icon: '🗃️',
    severity: 'warning',
    probability: (state) => state.business.users.total > 2000 ? 0.05 : 0.01,
    choices: [
      {
        id: 'upgrade_supabase',
        text: 'Pro 플랜 업그레이드 (-$25/월)',
        effects: [
          { type: 'cash', value: -32500 },
          { type: 'stability', value: 15 },
        ],
        resultText: '8GB까지 사용 가능! 당분간 여유롭습니다.',
      },
      {
        id: 'cleanup_data',
        text: '오래된 데이터 정리 (-15 에너지)',
        effects: [
          { type: 'energy', value: -15 },
        ],
        resultText: '불필요한 로그를 삭제하여 20% 확보했습니다.',
      },
      {
        id: 'migrate_selfhost',
        text: '자체 PostgreSQL 서버로 마이그레이션 (-60 에너지)',
        effects: [
          { type: 'energy', value: -60 },
          { type: 'skill_coding', value: 3 },
          { type: 'cash', value: -30000 },
        ],
        resultText: '힘들었지만 완전한 제어권을 얻었습니다!',
      },
    ],
  },
  {
    id: 'tech_dns_propagation',
    name: 'DNS 전파 지연',
    description: '도메인 설정 변경 후 DNS 전파가 예상보다 오래 걸리고 있습니다. 일부 지역에서 접속 불가.',
    icon: '🔄',
    severity: 'normal',
    probability: () => 0.005,
    choices: [
      {
        id: 'lower_ttl',
        text: 'TTL 값 낮추고 기다린다',
        effects: [
          { type: 'stress', value: 5 },
        ],
        resultText: '24시간 후 전 세계에서 정상 접속 가능해졌습니다.',
      },
      {
        id: 'cdn_dns',
        text: 'Cloudflare DNS로 전환 (-10 에너지)',
        effects: [
          { type: 'energy', value: -10 },
          { type: 'stability', value: 5 },
        ],
        resultText: 'Cloudflare의 빠른 DNS로 문제 해결!',
      },
    ],
  },
  {
    id: 'tech_lambda_cold_start',
    name: 'Serverless 콜드 스타트 문제',
    description: 'API 응답 시간이 불규칙합니다. 콜드 스타트 시 5초 이상 걸리는 경우가 있습니다.',
    icon: '❄️',
    severity: 'normal',
    probability: (state) => state.business.users.dau > 100 ? 0.015 : 0,
    choices: [
      {
        id: 'provisioned_concurrency',
        text: 'Provisioned Concurrency 설정 (-$50/월)',
        effects: [
          { type: 'cash', value: -65000 },
          { type: 'stability', value: 15 },
        ],
        resultText: '항상 따뜻한 인스턴스가 대기! 응답이 일정해졌습니다.',
      },
      {
        id: 'optimize_bundle',
        text: '번들 사이즈 최적화 (-30 에너지)',
        effects: [
          { type: 'energy', value: -30 },
          { type: 'skill_coding', value: 2 },
        ],
        resultText: '의존성 정리로 콜드 스타트가 2초로 줄었습니다!',
      },
      {
        id: 'warm_ping',
        text: '5분마다 Warm-up 핑 설정',
        effects: [
          { type: 'stability', value: 5 },
        ],
        resultText: '간단한 해결책이지만 효과적입니다!',
      },
    ],
  },

  // ============================================
  // 코드/개발 이벤트 (15개)
  // ============================================
  {
    id: 'tech_major_bug_report',
    name: '크리티컬 버그 리포트',
    description: '여러 사용자가 학습 진행률이 저장되지 않는 치명적인 버그를 신고했습니다!',
    icon: '🐛',
    severity: 'critical',
    probability: (state) => (state.business.product.bugs?.length || 0) > 3 ? 0.03 : 0.01,
    choices: [
      {
        id: 'hotfix',
        text: '핫픽스 배포 (-35 에너지)',
        effects: [
          { type: 'energy', value: -35 },
          { type: 'reputation', value: 10 },
          { type: 'stability', value: 15 },
        ],
        resultText: '긴급 수정 후 사과문과 함께 배포했습니다!',
      },
      {
        id: 'compensate',
        text: '보상 + 다음 버전에 수정',
        effects: [
          { type: 'cash', value: -100000 },
          { type: 'reputation', value: 5 },
        ],
        resultText: '프리미엄 1개월 연장으로 사용자를 달랬습니다.',
      },
      {
        id: 'investigate',
        text: '원인 조사 후 완벽한 수정',
        effects: [
          { type: 'energy', value: -50 },
          { type: 'stability', value: 25 },
          { type: 'technical_debt', value: -10 },
        ],
        resultText: '근본 원인을 찾아 완벽히 수정했습니다!',
      },
    ],
  },
  {
    id: 'tech_typescript_migration',
    name: 'TypeScript 마이그레이션 고민',
    description: 'JavaScript 코드베이스가 커지면서 타입 에러가 자주 발생합니다. TypeScript 도입을 고려해봐야 할까요?',
    icon: '📘',
    severity: 'normal',
    probability: (state) => state.time.totalDays > 60 && (state.business.product.technicalDebt || 0) > 20 ? 0.02 : 0,
    minDay: 60,
    choices: [
      {
        id: 'full_migration',
        text: '전체 마이그레이션 (-100 에너지, 2주)',
        effects: [
          { type: 'energy', value: -100 },
          { type: 'skill_coding', value: 8 },
          { type: 'technical_debt', value: -30 },
          { type: 'stability', value: 20 },
        ],
        resultText: '힘들었지만 코드 품질이 크게 향상되었습니다!',
      },
      {
        id: 'gradual',
        text: '점진적 도입 (새 파일만)',
        effects: [
          { type: 'energy', value: -20 },
          { type: 'skill_coding', value: 3 },
          { type: 'technical_debt', value: -5 },
        ],
        resultText: '새로운 코드부터 TypeScript로 작성합니다.',
      },
      {
        id: 'jsdoc',
        text: 'JSDoc 타입 주석으로 대체',
        effects: [
          { type: 'energy', value: -15 },
          { type: 'stability', value: 5 },
        ],
        resultText: 'IDE 지원을 받으면서 마이그레이션 없이 타입 체크!',
      },
    ],
  },
  {
    id: 'tech_refactoring_need',
    name: '리팩토링 필요성',
    description: '스파게티 코드가 쌓이고 있습니다. 새 기능 추가가 점점 어려워집니다.',
    icon: '🍝',
    severity: 'normal',
    probability: (state) => (state.business.product.technicalDebt || 0) > 40 ? 0.03 : 0.01,
    choices: [
      {
        id: 'major_refactor',
        text: '대규모 리팩토링 (-60 에너지)',
        effects: [
          { type: 'energy', value: -60 },
          { type: 'technical_debt', value: -40 },
          { type: 'skill_coding', value: 5 },
        ],
        resultText: '깔끔한 구조로 재정비! 개발 속도가 빨라질 것입니다.',
      },
      {
        id: 'boy_scout',
        text: '보이스카웃 규칙 적용 (점진적)',
        effects: [
          { type: 'technical_debt', value: -10 },
        ],
        resultText: '코드를 만질 때마다 조금씩 개선하기로 했습니다.',
      },
      {
        id: 'defer',
        text: '나중에... (기능 개발 우선)',
        effects: [
          { type: 'technical_debt', value: 10 },
          { type: 'stress', value: 5 },
        ],
        resultText: '당장은 넘어가지만 나중에 더 큰 고통이 올 수 있습니다.',
      },
    ],
  },
  {
    id: 'tech_test_coverage',
    name: '테스트 커버리지 경고',
    description: '테스트 커버리지가 20%로 떨어졌습니다. 버그 발생 확률이 높아지고 있습니다.',
    icon: '🧪',
    severity: 'warning',
    probability: (state) => (state.business.product.technicalDebt || 0) > 30 ? 0.02 : 0.005,
    choices: [
      {
        id: 'write_tests',
        text: '핵심 기능 테스트 작성 (-40 에너지)',
        effects: [
          { type: 'energy', value: -40 },
          { type: 'stability', value: 20 },
          { type: 'skill_coding', value: 3 },
        ],
        resultText: '80% 커버리지 달성! 안심하고 배포할 수 있습니다.',
      },
      {
        id: 'e2e_only',
        text: 'E2E 테스트에 집중 (-25 에너지)',
        effects: [
          { type: 'energy', value: -25 },
          { type: 'stability', value: 10 },
        ],
        resultText: '주요 사용자 플로우는 안전하게 테스트됩니다.',
      },
      {
        id: 'manual_qa',
        text: '수동 QA 강화',
        effects: [
          { type: 'stress', value: 10 },
          { type: 'stability', value: 5 },
        ],
        resultText: '매 배포 전 수동으로 꼼꼼히 확인합니다...',
      },
    ],
  },
  {
    id: 'tech_dependency_hell',
    name: '의존성 지옥',
    description: 'npm install이 실패합니다. 여러 패키지의 버전 충돌이 발생했습니다.',
    icon: '📦',
    severity: 'warning',
    probability: () => 0.01,
    choices: [
      {
        id: 'resolve_manually',
        text: '수동으로 버전 해결 (-30 에너지)',
        effects: [
          { type: 'energy', value: -30 },
          { type: 'stress', value: 10 },
        ],
        resultText: 'package-lock.json을 삭제하고 하나씩 해결했습니다.',
      },
      {
        id: 'use_legacy',
        text: '--legacy-peer-deps 플래그 사용',
        effects: [
          { type: 'technical_debt', value: 10 },
        ],
        resultText: '일단 돌아가지만 근본적인 해결은 아닙니다.',
      },
      {
        id: 'update_all',
        text: '모든 의존성 최신화 (-50 에너지)',
        effects: [
          { type: 'energy', value: -50 },
          { type: 'stability', value: -10 },
          { type: 'technical_debt', value: -15 },
        ],
        resultText: '대대적인 업데이트! 일부 API 변경 대응이 필요했습니다.',
      },
    ],
  },
  {
    id: 'tech_ci_broken',
    name: 'CI/CD 파이프라인 실패',
    description: 'GitHub Actions가 실패합니다. 배포가 막혔습니다!',
    icon: '🔴',
    severity: 'warning',
    probability: () => 0.015,
    choices: [
      {
        id: 'fix_ci',
        text: '워크플로우 수정 (-20 에너지)',
        effects: [
          { type: 'energy', value: -20 },
          { type: 'skill_coding', value: 1 },
        ],
        resultText: 'Node 버전 문제였습니다. 수정 완료!',
      },
      {
        id: 'manual_deploy',
        text: '수동 배포로 우회',
        effects: [
          { type: 'stress', value: 10 },
          { type: 'stability', value: -5 },
        ],
        resultText: '급한 불은 껐지만 자동화가 깨진 상태입니다.',
      },
      {
        id: 'new_pipeline',
        text: '파이프라인 재구축 (-40 에너지)',
        effects: [
          { type: 'energy', value: -40 },
          { type: 'stability', value: 15 },
          { type: 'skill_coding', value: 2 },
        ],
        resultText: '더 견고한 CI/CD를 구축했습니다!',
      },
    ],
  },
  {
    id: 'tech_code_review_request',
    name: '오픈소스 PR 코드 리뷰',
    description: '사용 중인 오픈소스 라이브러리에 버그 수정 PR을 올렸는데 메인테이너가 리뷰를 요청했습니다.',
    icon: '👀',
    severity: 'good',
    probability: () => 0.01,
    choices: [
      {
        id: 'respond',
        text: '피드백 반영 (-15 에너지)',
        effects: [
          { type: 'energy', value: -15 },
          { type: 'skill_coding', value: 3 },
          { type: 'reputation', value: 10 },
        ],
        resultText: 'PR이 머지되었습니다! 오픈소스 기여자가 되었어요!',
      },
      {
        id: 'abandon',
        text: 'PR 포기 (시간 없음)',
        effects: [
          { type: 'reputation', value: -2 },
        ],
        resultText: '아쉽지만 다음 기회에...',
      },
    ],
  },
  {
    id: 'tech_new_framework',
    name: '새로운 프레임워크 등장',
    description: '화제의 새 프레임워크가 등장했습니다. 현재 스택보다 성능이 2배라고 합니다.',
    icon: '✨',
    severity: 'normal',
    probability: () => 0.008,
    choices: [
      {
        id: 'experiment',
        text: '사이드 프로젝트로 실험 (-20 에너지)',
        effects: [
          { type: 'energy', value: -20 },
          { type: 'skill_coding', value: 4 },
        ],
        resultText: '새 기술을 배웠습니다! 나중에 적용할 수도 있겠네요.',
      },
      {
        id: 'wait_and_see',
        text: '안정화될 때까지 관망',
        effects: [],
        resultText: '현명한 선택. 검증된 기술에 집중합니다.',
      },
      {
        id: 'adopt_early',
        text: '바로 도입 시도 (-80 에너지)',
        effects: [
          { type: 'energy', value: -80 },
          { type: 'skill_coding', value: 6 },
          { type: 'stability', value: -15 },
          { type: 'reputation', value: 10 },
        ],
        resultText: '얼리어답터가 되었습니다! 불안정하지만 신선합니다.',
        probability: 0.6,
      },
    ],
  },
  {
    id: 'tech_ai_code_assistant',
    name: 'AI 코딩 어시스턴트 도입',
    description: 'GitHub Copilot이나 Cursor 같은 AI 도구를 도입할까요?',
    icon: '🤖',
    severity: 'normal',
    probability: (state) => state.time.totalDays > 30 ? 0.015 : 0,
    minDay: 30,
    choices: [
      {
        id: 'copilot',
        text: 'GitHub Copilot 구독 (-$10/월)',
        effects: [
          { type: 'cash', value: -13000 },
          { type: 'skill_coding', value: 2 },
        ],
        resultText: '코딩 속도가 30% 빨라진 느낌입니다!',
      },
      {
        id: 'cursor',
        text: 'Cursor 에디터 사용 (-$20/월)',
        effects: [
          { type: 'cash', value: -26000 },
          { type: 'skill_coding', value: 3 },
        ],
        resultText: 'AI와 대화하며 코딩하니 생산성이 폭증!',
      },
      {
        id: 'stay_vanilla',
        text: '기존 방식 유지',
        effects: [],
        resultText: 'AI 없이도 충분히 잘하고 있습니다.',
      },
    ],
  },
  {
    id: 'tech_performance_issue',
    name: 'Core Web Vitals 경고',
    description: 'Google Search Console에서 모바일 페이지 속도 문제를 경고하고 있습니다. SEO에 영향을 줄 수 있습니다.',
    icon: '⚡',
    severity: 'warning',
    probability: (state) => state.business.users.total > 100 ? 0.02 : 0.005,
    choices: [
      {
        id: 'optimize',
        text: '성능 최적화 (-35 에너지)',
        effects: [
          { type: 'energy', value: -35 },
          { type: 'users', value: 20 },
          { type: 'skill_coding', value: 2 },
        ],
        resultText: 'LCP, FID, CLS 모두 개선! 녹색 점수를 받았습니다.',
      },
      {
        id: 'lazy_load',
        text: '이미지 지연 로딩만 적용 (-15 에너지)',
        effects: [
          { type: 'energy', value: -15 },
          { type: 'users', value: 10 },
        ],
        resultText: '간단한 조치로 어느 정도 개선되었습니다.',
      },
      {
        id: 'ignore',
        text: '무시한다',
        effects: [
          { type: 'users', value: -10 },
          { type: 'reputation', value: -5 },
        ],
        resultText: '검색 노출이 줄어들고 있는 것 같습니다...',
      },
    ],
  },

  // ============================================
  // 보안 이벤트 (10개)
  // ============================================
  {
    id: 'tech_sql_injection_attempt',
    name: 'SQL 인젝션 시도 감지',
    description: '로그에서 의심스러운 SQL 인젝션 시도가 감지되었습니다!',
    icon: '🛡️',
    severity: 'warning',
    probability: (state) => state.business.users.total > 500 ? 0.015 : 0.005,
    choices: [
      {
        id: 'security_audit',
        text: '보안 점검 + WAF 설정 (-25 에너지)',
        effects: [
          { type: 'energy', value: -25 },
          { type: 'stability', value: 15 },
          { type: 'skill_coding', value: 2 },
        ],
        resultText: 'ORM을 사용 중이라 안전했지만, WAF로 추가 방어!',
      },
      {
        id: 'block_ip',
        text: 'IP 차단',
        effects: [
          { type: 'stability', value: 5 },
        ],
        resultText: '해당 IP를 차단했습니다. 하지만 다른 IP로 올 수 있습니다.',
      },
      {
        id: 'report_police',
        text: '사이버수사대 신고',
        effects: [
          { type: 'energy', value: -10 },
          { type: 'reputation', value: 5 },
        ],
        resultText: '정식 신고했습니다. 추적이 시작됩니다.',
      },
    ],
  },
  {
    id: 'tech_data_breach_risk',
    name: '데이터 유출 위험',
    description: '.env 파일이 git에 커밋된 것을 발견했습니다! API 키가 노출되었을 수 있습니다.',
    icon: '🚨',
    severity: 'critical',
    probability: () => 0.005,
    choices: [
      {
        id: 'rotate_keys',
        text: '모든 키 즉시 교체 (-30 에너지)',
        effects: [
          { type: 'energy', value: -30 },
          { type: 'stress', value: 20 },
          { type: 'stability', value: 10 },
        ],
        resultText: '모든 API 키를 교체하고 git history를 정리했습니다!',
      },
      {
        id: 'scan_usage',
        text: '비정상 사용량 모니터링',
        effects: [
          { type: 'stress', value: 15 },
        ],
        resultText: '다행히 악용 흔적은 없지만 불안합니다.',
      },
      {
        id: 'hire_security',
        text: '보안 전문가 긴급 고용 (-1,500,000원)',
        effects: [
          { type: 'cash', value: -1500000 },
          { type: 'stability', value: 30 },
          { type: 'reputation', value: 10 },
        ],
        resultText: '전문가가 전체 보안을 점검하고 강화했습니다!',
      },
    ],
  },
  {
    id: 'tech_xss_vulnerability',
    name: 'XSS 취약점 발견',
    description: '사용자 입력이 제대로 sanitize되지 않는 부분을 발견했습니다.',
    icon: '💉',
    severity: 'warning',
    probability: () => 0.01,
    choices: [
      {
        id: 'fix_sanitize',
        text: '즉시 수정 + sanitize 라이브러리 도입 (-20 에너지)',
        effects: [
          { type: 'energy', value: -20 },
          { type: 'stability', value: 15 },
        ],
        resultText: 'DOMPurify를 도입하고 모든 입력을 검증합니다!',
      },
      {
        id: 'csp_header',
        text: 'CSP 헤더 설정',
        effects: [
          { type: 'energy', value: -10 },
          { type: 'stability', value: 10 },
        ],
        resultText: 'Content Security Policy로 인라인 스크립트 차단!',
      },
    ],
  },
  {
    id: 'tech_bruteforce_login',
    name: '로그인 무차별 대입 공격',
    description: '특정 계정에 대한 로그인 시도가 비정상적으로 많습니다.',
    icon: '🔑',
    severity: 'warning',
    probability: (state) => state.business.users.premium > 50 ? 0.015 : 0.005,
    choices: [
      {
        id: 'rate_limit',
        text: '로그인 시도 횟수 제한 (-15 에너지)',
        effects: [
          { type: 'energy', value: -15 },
          { type: 'stability', value: 10 },
        ],
        resultText: '5회 실패 시 30분 차단을 적용했습니다!',
      },
      {
        id: 'captcha',
        text: 'reCAPTCHA 추가',
        effects: [
          { type: 'energy', value: -10 },
          { type: 'stability', value: 8 },
          { type: 'reputation', value: -3 },
        ],
        resultText: '봇은 막았지만 사용자가 살짝 불편해합니다.',
      },
      {
        id: 'mfa',
        text: '2단계 인증 도입 (-30 에너지)',
        effects: [
          { type: 'energy', value: -30 },
          { type: 'stability', value: 25 },
          { type: 'reputation', value: 10 },
        ],
        resultText: '보안이 크게 강화되었습니다! 프리미엄 사용자들이 좋아합니다.',
      },
    ],
  },
  {
    id: 'tech_outdated_dependencies',
    name: '오래된 의존성 보안 경고',
    description: 'npm audit에서 12개의 high severity 취약점이 발견되었습니다.',
    icon: '⚠️',
    severity: 'warning',
    probability: () => 0.02,
    choices: [
      {
        id: 'update_all',
        text: '모든 의존성 업데이트 (-25 에너지)',
        effects: [
          { type: 'energy', value: -25 },
          { type: 'stability', value: 15 },
          { type: 'skill_coding', value: 1 },
        ],
        resultText: '취약점이 모두 해결되었습니다!',
      },
      {
        id: 'selective_update',
        text: 'critical만 선택적 업데이트',
        effects: [
          { type: 'energy', value: -10 },
          { type: 'stability', value: 8 },
        ],
        resultText: '급한 것만 해결했습니다. 나머지는 나중에...',
      },
      {
        id: 'audit_fix',
        text: 'npm audit fix --force',
        effects: [
          { type: 'stability', value: -5 },
          { type: 'technical_debt', value: 5 },
        ],
        resultText: '자동으로 해결됐지만 일부 호환성 문제가 있을 수 있습니다.',
        probability: 0.7,
      },
    ],
  },

  // ============================================
  // AI/ML 이벤트 (10개)
  // ============================================
  {
    id: 'tech_openai_api_change',
    name: 'OpenAI API 변경',
    description: 'OpenAI가 API를 업데이트했습니다. 기존 코드 일부가 deprecated 됩니다.',
    icon: '🔄',
    severity: 'normal',
    probability: () => 0.01,
    choices: [
      {
        id: 'migrate_new',
        text: '새 API로 마이그레이션 (-30 에너지)',
        effects: [
          { type: 'energy', value: -30 },
          { type: 'skill_coding', value: 2 },
          { type: 'stability', value: 10 },
        ],
        resultText: 'GPT-4 Turbo로 업그레이드! 더 빠르고 저렴해졌습니다.',
      },
      {
        id: 'stay_old',
        text: '기존 API 계속 사용 (1년 유예)',
        effects: [
          { type: 'technical_debt', value: 10 },
        ],
        resultText: '일단은 동작하지만 언젠가는 마이그레이션해야 합니다.',
      },
    ],
  },
  {
    id: 'tech_ai_hallucination',
    name: 'AI 할루시네이션 신고',
    description: '사용자가 AI가 잘못된 단어 뜻을 알려줬다고 신고했습니다.',
    icon: '🤯',
    severity: 'warning',
    probability: (state) => state.business.users.total > 100 ? 0.02 : 0.005,
    choices: [
      {
        id: 'add_verification',
        text: '사전 API로 교차 검증 추가 (-25 에너지)',
        effects: [
          { type: 'energy', value: -25 },
          { type: 'stability', value: 15 },
          { type: 'cash', value: -20000 },
        ],
        resultText: 'AI 응답을 사전으로 검증하는 레이어를 추가했습니다!',
      },
      {
        id: 'disclaimer',
        text: '"AI 생성 콘텐츠" 면책 조항 추가',
        effects: [
          { type: 'reputation', value: -5 },
        ],
        resultText: '법적 책임은 피하지만 신뢰도가 약간 떨어집니다.',
      },
      {
        id: 'user_feedback',
        text: '사용자 피드백 기능 추가',
        effects: [
          { type: 'energy', value: -15 },
          { type: 'reputation', value: 5 },
        ],
        resultText: '사용자가 오류를 신고할 수 있게 되었습니다!',
      },
    ],
  },
  {
    id: 'tech_model_cost_spike',
    name: 'AI 모델 비용 급증',
    description: '이번 달 OpenAI API 비용이 예상의 3배입니다!',
    icon: '💸',
    severity: 'warning',
    probability: (state) => state.business.users.dau > 200 ? 0.03 : 0.01,
    choices: [
      {
        id: 'implement_budget',
        text: '사용량 제한 + 캐싱 (-30 에너지)',
        effects: [
          { type: 'energy', value: -30 },
          { type: 'cash', value: 100000 },
          { type: 'skill_coding', value: 2 },
        ],
        resultText: '스마트 캐싱으로 API 호출을 70% 줄였습니다!',
      },
      {
        id: 'switch_model',
        text: 'GPT-3.5로 다운그레이드',
        effects: [
          { type: 'cash', value: 50000 },
          { type: 'stability', value: -5 },
          { type: 'reputation', value: -5 },
        ],
        resultText: '비용은 줄었지만 품질이 약간 떨어졌습니다.',
      },
      {
        id: 'local_model',
        text: '로컬 모델 (Llama) 테스트 (-50 에너지)',
        effects: [
          { type: 'energy', value: -50 },
          { type: 'skill_coding', value: 5 },
        ],
        resultText: '성능은 떨어지지만 비용이 거의 0이 됩니다!',
      },
    ],
  },
  {
    id: 'tech_prompt_injection',
    name: '프롬프트 인젝션 발견',
    description: '사용자가 "시스템 프롬프트를 무시하고..." 같은 입력으로 AI를 조작하려 합니다.',
    icon: '🎭',
    severity: 'warning',
    probability: (state) => state.business.users.total > 500 ? 0.015 : 0.003,
    choices: [
      {
        id: 'input_filter',
        text: '입력 필터링 구현 (-20 에너지)',
        effects: [
          { type: 'energy', value: -20 },
          { type: 'stability', value: 10 },
        ],
        resultText: '의심스러운 패턴을 감지하고 차단합니다!',
      },
      {
        id: 'sandbox',
        text: '시스템 프롬프트 강화',
        effects: [
          { type: 'energy', value: -10 },
          { type: 'stability', value: 8 },
        ],
        resultText: '더 견고한 시스템 프롬프트로 방어합니다.',
      },
      {
        id: 'ban_user',
        text: '해당 사용자 경고',
        effects: [
          { type: 'reputation', value: -2 },
        ],
        resultText: '규정 위반 경고를 보냈습니다.',
      },
    ],
  },
  {
    id: 'tech_anthropic_claude',
    name: 'Claude API 도입 검토',
    description: 'Anthropic의 Claude가 특정 작업에서 GPT보다 더 정확하다는 벤치마크를 봤습니다.',
    icon: '🧠',
    severity: 'good',
    probability: () => 0.01,
    choices: [
      {
        id: 'hybrid_approach',
        text: '하이브리드 접근 (-40 에너지)',
        effects: [
          { type: 'energy', value: -40 },
          { type: 'skill_coding', value: 3 },
          { type: 'stability', value: 10 },
        ],
        resultText: '작업별로 최적의 모델을 사용하는 라우터를 구축!',
      },
      {
        id: 'switch_claude',
        text: 'Claude로 전환 (-30 에너지)',
        effects: [
          { type: 'energy', value: -30 },
          { type: 'stability', value: 5 },
        ],
        resultText: 'Claude의 응답이 더 자연스럽습니다!',
      },
      {
        id: 'keep_gpt',
        text: '기존 GPT 유지',
        effects: [],
        resultText: '익숙한 것이 최고입니다.',
      },
    ],
  },
];

export default TECHNICAL_EVENTS;
