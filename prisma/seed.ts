import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const categories = [
  { name: 'basic', nameKorean: '기초 영단어', icon: '📚', color: '#10b981', order: 1 },
  { name: 'toeic', nameKorean: 'TOEIC', icon: '📝', color: '#3b82f6', order: 2 },
  { name: 'toefl', nameKorean: 'TOEFL', icon: '🎓', color: '#8b5cf6', order: 3 },
  { name: 'ielts', nameKorean: 'IELTS', icon: '🌍', color: '#ec4899', order: 4 },
  { name: 'business', nameKorean: '비즈니스', icon: '💼', color: '#f59e0b', order: 5 },
  { name: 'academic', nameKorean: '학술', icon: '🔬', color: '#06b6d4', order: 6 },
  { name: 'daily', nameKorean: '일상 회화', icon: '💬', color: '#22c55e', order: 7 },
  { name: 'idioms', nameKorean: '숙어/관용구', icon: '🎭', color: '#a855f7', order: 8 },
];

const words = [
  // Basic Words
  { english: 'Ephemeral', korean: '일시적인, 덧없는', pronunciation: '/ɪˈfem.ər.əl/', example: 'Fame in the modern world is often ephemeral.', exampleKorean: '현대 사회에서 명성은 종종 일시적이다.', difficulty: 'MEDIUM', category: 'basic', level: 5, tags: ['고급', '형용사'] },
  { english: 'Ubiquitous', korean: '어디에나 있는', pronunciation: '/juːˈbɪk.wɪ.təs/', example: 'Smartphones have become ubiquitous in modern society.', exampleKorean: '스마트폰은 현대 사회에서 어디에나 있게 되었다.', difficulty: 'HARD', category: 'basic', level: 6, tags: ['고급', '형용사'] },
  { english: 'Serendipity', korean: '뜻밖의 행운', pronunciation: '/ˌser.ənˈdɪp.ə.ti/', example: 'Finding that rare book was pure serendipity.', exampleKorean: '그 희귀한 책을 발견한 것은 순전히 뜻밖의 행운이었다.', difficulty: 'HARD', category: 'basic', level: 7, tags: ['고급', '명사'] },
  { english: 'Eloquent', korean: '웅변의, 유창한', pronunciation: '/ˈel.ə.kwənt/', example: 'She gave an eloquent speech about climate change.', exampleKorean: '그녀는 기후 변화에 대해 유창한 연설을 했다.', difficulty: 'MEDIUM', category: 'basic', level: 5, tags: ['중급', '형용사'] },
  { english: 'Meticulous', korean: '꼼꼼한, 세심한', pronunciation: '/məˈtɪk.jə.ləs/', example: 'The artist was meticulous in her attention to detail.', exampleKorean: '그 예술가는 세부 사항에 대해 매우 꼼꼼했다.', difficulty: 'MEDIUM', category: 'basic', level: 5, tags: ['중급', '형용사'] },

  // TOEIC Words
  { english: 'Inventory', korean: '재고, 목록', pronunciation: '/ˈɪn.vən.tɔːr.i/', example: 'We need to update our inventory before the sale.', exampleKorean: '세일 전에 재고를 업데이트해야 합니다.', difficulty: 'EASY', category: 'toeic', level: 3, tags: ['비즈니스', '명사'] },
  { english: 'Implement', korean: '실행하다, 구현하다', pronunciation: '/ˈɪm.plɪ.ment/', example: 'The company will implement new policies next month.', exampleKorean: '회사는 다음 달에 새로운 정책을 실행할 것입니다.', difficulty: 'MEDIUM', category: 'toeic', level: 4, tags: ['비즈니스', '동사'] },
  { english: 'Negotiate', korean: '협상하다', pronunciation: '/nɪˈɡəʊ.ʃi.eɪt/', example: 'They are trying to negotiate a better deal.', exampleKorean: '그들은 더 나은 거래를 협상하려고 합니다.', difficulty: 'MEDIUM', category: 'toeic', level: 4, tags: ['비즈니스', '동사'] },

  // Business Words
  { english: 'Leverage', korean: '활용하다, 지렛대', pronunciation: '/ˈlev.ər.ɪdʒ/', example: 'We should leverage our existing resources.', exampleKorean: '우리는 기존 자원을 활용해야 합니다.', difficulty: 'MEDIUM', category: 'business', level: 4, tags: ['경영', '동사/명사'] },
  { english: 'Stakeholder', korean: '이해관계자', pronunciation: '/ˈsteɪkˌhəʊl.dər/', example: 'All stakeholders should be informed of the decision.', exampleKorean: '모든 이해관계자에게 결정 사항을 알려야 합니다.', difficulty: 'EASY', category: 'business', level: 3, tags: ['경영', '명사'] },

  // Academic Words
  { english: 'Hypothesis', korean: '가설', pronunciation: '/haɪˈpɒθ.ə.sɪs/', example: 'The scientist tested her hypothesis through experiments.', exampleKorean: '과학자는 실험을 통해 가설을 검증했습니다.', difficulty: 'MEDIUM', category: 'academic', level: 5, tags: ['학술', '명사'] },
  { english: 'Paradigm', korean: '패러다임, 모범', pronunciation: '/ˈpær.ə.daɪm/', example: 'This discovery represents a paradigm shift in physics.', exampleKorean: '이 발견은 물리학의 패러다임 전환을 나타냅니다.', difficulty: 'HARD', category: 'academic', level: 6, tags: ['학술', '명사'] },
];

const achievements = [
  { code: 'FIRST_WORD', name: '첫 걸음', description: '첫 번째 단어를 학습했습니다!', icon: '👶', category: 'LEARNING', requirement: 1, points: 10 },
  { code: 'WORDS_10', name: '단어 수집가', description: '10개의 단어를 학습했습니다!', icon: '📚', category: 'LEARNING', requirement: 10, points: 20 },
  { code: 'WORDS_50', name: '어휘 마스터', description: '50개의 단어를 학습했습니다!', icon: '🎓', category: 'LEARNING', requirement: 50, points: 50 },
  { code: 'WORDS_100', name: '단어 박사', description: '100개의 단어를 학습했습니다!', icon: '🏆', category: 'LEARNING', requirement: 100, points: 100 },
  { code: 'STREAK_3', name: '꾸준함의 시작', description: '3일 연속 학습!', icon: '🔥', category: 'STREAK', requirement: 3, points: 30 },
  { code: 'STREAK_7', name: '일주일 전사', description: '7일 연속 학습!', icon: '💪', category: 'STREAK', requirement: 7, points: 70 },
  { code: 'STREAK_30', name: '한 달의 기적', description: '30일 연속 학습!', icon: '⭐', category: 'STREAK', requirement: 30, points: 300 },
  { code: 'QUIZ_PERFECT', name: '완벽주의자', description: '퀴즈에서 100점 획득!', icon: '💯', category: 'QUIZ', requirement: 1, points: 50 },
  { code: 'QUIZ_10', name: '퀴즈 도전자', description: '10개의 퀴즈를 완료했습니다!', icon: '🎯', category: 'QUIZ', requirement: 10, points: 40 },
  { code: 'MASTERY_10', name: '마스터의 길', description: '10개의 단어를 완벽히 암기!', icon: '🌟', category: 'MASTERY', requirement: 10, points: 80 },
];

const levels = Array.from({ length: 50 }, (_, i) => ({
  number: i + 1,
  name: getLevelName(i + 1),
  description: `레벨 ${i + 1}에 도달했습니다!`,
  requiredXP: calculateRequiredXP(i + 1),
  rewards: { coins: (i + 1) * 100, badges: i % 10 === 0 ? [`level_${i + 1}_badge`] : [] },
}));

function getLevelName(level: number): string {
  if (level <= 5) return '초보 학습자';
  if (level <= 10) return '열정적인 학습자';
  if (level <= 20) return '성실한 학습자';
  if (level <= 30) return '숙련된 학습자';
  if (level <= 40) return '전문가';
  return '마스터';
}

function calculateRequiredXP(level: number): number {
  return Math.floor(100 * Math.pow(1.5, level - 1));
}

async function main() {
  console.log('🌱 Seeding database...');

  // Create categories
  console.log('📁 Creating categories...');
  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: category,
      create: category,
    });
  }

  // Create words
  console.log('📝 Creating words...');
  for (const word of words) {
    await prisma.word.upsert({
      where: { english_category: { english: word.english, category: word.category } },
      update: word,
      create: word,
    });
  }

  // Create achievements
  console.log('🏆 Creating achievements...');
  for (const achievement of achievements) {
    await prisma.achievement.upsert({
      where: { code: achievement.code },
      update: achievement,
      create: achievement,
    });
  }

  // Create levels
  console.log('📊 Creating levels...');
  for (const level of levels) {
    await prisma.level.upsert({
      where: { number: level.number },
      update: level,
      create: level,
    });
  }

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
