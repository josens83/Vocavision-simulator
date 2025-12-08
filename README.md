# VocaVision - AI 기반 영어 단어 학습 플랫폼

<p align="center">
  <img src="public/logo.png" alt="VocaVision Logo" width="200"/>
</p>

<p align="center">
  <strong>AI 연상법과 과학적 간격 반복 학습으로 영어 단어를 효과적으로 암기하세요</strong>
</p>

<p align="center">
  <a href="#features">기능</a> •
  <a href="#tech-stack">기술 스택</a> •
  <a href="#getting-started">시작하기</a> •
  <a href="#pricing">요금제</a> •
  <a href="#deployment">배포</a>
</p>

---

## 🌟 Features

### 📚 핵심 학습 기능
- **플래시카드 학습**: 직관적인 플래시카드로 단어 학습
- **SM-2 알고리즘**: 과학적 간격 반복 학습으로 장기 기억 강화
- **AI 연상법**: OpenAI를 활용한 창의적인 연상법 생성
- **발음 듣기**: Web Speech API / Google TTS로 정확한 발음 학습

### 🎮 게임화 요소
- **레벨 시스템**: XP 획득 및 레벨업
- **성취 시스템**: 다양한 배지와 업적
- **연속 학습 스트릭**: 꾸준한 학습 동기 부여
- **1인 EdTech 시뮬레이터**: 재미있는 사업 시뮬레이션 게임

### 📊 학습 관리
- **상세 통계**: 학습 진행률, 정확도, 시간 분석
- **복습 알림**: 최적의 타이밍에 복습 알림
- **약점 분석**: 틀린 문제 패턴 분석

### 💼 프리미엄 기능
- 무제한 단어 학습
- AI 연상법 무제한 생성
- 오프라인 학습 지원
- 광고 제거

---

## 🛠 Tech Stack

### Frontend
- **Next.js 14** - App Router, Server Components
- **TypeScript** - 타입 안전성
- **Tailwind CSS** - 스타일링
- **Framer Motion** - 애니메이션
- **Zustand** - 상태 관리

### Backend
- **Next.js API Routes** - API 엔드포인트
- **Prisma** - ORM
- **PostgreSQL** - 데이터베이스

### Authentication & Payments
- **NextAuth.js v5** - 인증 (Google, GitHub, Credentials)
- **Stripe** - 결제 처리

### Infrastructure
- **Vercel** - 호스팅
- **Railway/Supabase** - 데이터베이스
- **PWA** - 모바일 앱 지원

---

## 🚀 Getting Started

### 요구 사항
- Node.js 18+
- PostgreSQL
- pnpm (권장) 또는 npm

### 설치

```bash
# 저장소 클론
git clone https://github.com/josens83/Vocavision-simulator.git
cd Vocavision-simulator

# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env.local
# .env.local 파일을 열어 필요한 값들을 설정하세요

# 데이터베이스 마이그레이션
npx prisma db push

# 시드 데이터 생성
npm run db:seed

# 개발 서버 실행
npm run dev
```

### 환경 변수

```env
# Database
DATABASE_URL="postgresql://..."

# NextAuth
AUTH_SECRET="your-secret"
AUTH_URL="http://localhost:3000"

# OAuth
AUTH_GOOGLE_ID="..."
AUTH_GOOGLE_SECRET="..."
AUTH_GITHUB_ID="..."
AUTH_GITHUB_SECRET="..."

# Stripe
STRIPE_SECRET_KEY="sk_..."
STRIPE_PUBLISHABLE_KEY="pk_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# OpenAI
OPENAI_API_KEY="sk-..."

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 💰 Pricing

| Plan | 가격 | 기능 |
|------|------|------|
| **무료** | ₩0 | 기본 단어 100개, 일일 퀴즈 3회 |
| **베이직** | ₩4,990/월 | 단어 1,000개+, 무제한 퀴즈, AI 연상법 50회/월 |
| **프리미엄** | ₩9,990/월 | 모든 기능 무제한, 오프라인 학습, API 액세스 |
| **평생이용권** | ₩199,000 | 프리미엄 평생 이용 |

---

## 📱 PWA 지원

VocaVision은 PWA(Progressive Web App)를 지원합니다:

- 📲 홈 화면에 앱 설치 가능
- 📴 오프라인 학습 지원 (프리미엄)
- 🔔 푸시 알림 지원
- ⚡ 네이티브 앱 수준의 성능

---

## 🎮 시뮬레이터 게임

VocaVision에는 1인 EdTech 사업 시뮬레이터 게임이 포함되어 있습니다:

- 💰 자금 관리 (서버비, API 비용, 광고비)
- 🐛 버그 발생 및 대응
- 👥 사용자 증가/이탈
- 📧 고객 문의 처리
- 🚀 기능 개발 의사결정
- ⚡ 서버 장애 대응

실제 스타트업 운영에서 마주치는 다양한 상황들을 체험해보세요!

---

## 📦 Deployment

### Vercel 배포

```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel
```

### 환경 변수 설정
Vercel 대시보드에서 환경 변수를 설정하세요.

### 데이터베이스
- Railway 또는 Supabase에서 PostgreSQL 인스턴스 생성
- `DATABASE_URL` 환경 변수 설정

---

## 📄 License

MIT License - 자유롭게 사용, 수정, 배포할 수 있습니다.

---

## 🤝 Contributing

기여를 환영합니다! Issues와 Pull Requests를 통해 참여해주세요.

---

<p align="center">
  Made with ❤️ by VocaVision Team
</p>
