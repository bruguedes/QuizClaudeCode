import type { Lang } from '@/types/quiz';

const strings: Record<string, Record<Lang, string>> = {
  'welcome.title': {
    pt: 'Teste seu conhecimento sobre Claude Code',
    en: 'Test your Claude Code knowledge',
  },
  'welcome.subtitle': {
    pt: '10 perguntas • Verdadeiro ou Falso • Progressivo',
    en: '10 questions • True or False • Adaptive',
  },
  'welcome.start': { pt: 'Começar Quiz', en: 'Start Quiz' },
  'welcome.lang.pt': { pt: 'Português', en: 'Portuguese' },
  'welcome.lang.en': { pt: 'Inglês', en: 'English' },

  'quiz.true': { pt: 'Verdadeiro', en: 'True' },
  'quiz.false': { pt: 'Falso', en: 'False' },
  'quiz.question': { pt: 'Pergunta', en: 'Question' },
  'quiz.of': { pt: 'de', en: 'of' },

  'quiz.level.beginner': { pt: 'Iniciante', en: 'Beginner' },
  'quiz.level.intermediate': { pt: 'Intermediário', en: 'Intermediate' },
  'quiz.level.advanced': { pt: 'Avançado', en: 'Advanced' },

  'feedback.correct': { pt: 'Correto! ✅', en: 'Correct! ✅' },
  'feedback.wrong': { pt: 'Incorreto ❌', en: 'Wrong ❌' },
  'feedback.timeout': { pt: 'Tempo esgotado ⏱️', en: "Time's up ⏱️" },
  'feedback.doc': { pt: 'Ver documentação', en: 'View documentation' },
  'feedback.next': { pt: 'Próxima', en: 'Next' },

  'result.title': { pt: 'Resultado Final', en: 'Final Result' },
  'result.score': { pt: 'Pontuação', en: 'Score' },
  'result.maxLevel': { pt: 'Nível máximo atingido', en: 'Max level reached' },
  'result.msg.low': { pt: 'Continue aprendendo! 📖', en: 'Keep learning! 📖' },
  'result.msg.mid': { pt: 'Bom progresso! 🚀', en: 'Good progress! 🚀' },
  'result.msg.high': { pt: 'Expert em Claude Code! 🏆', en: 'Claude Code Expert! 🏆' },
  'result.share': { pt: 'Compartilhar resultado', en: 'Share result' },
  'result.retry': { pt: 'Jogar novamente', en: 'Play again' },
  'result.share.text': {
    pt: 'Fiz o Claude Code Quiz e tirei {score}/10! 🤖\nTeste seu conhecimento: {url}',
    en: 'I took the Claude Code Quiz and scored {score}/10! 🤖\nTest your knowledge: {url}',
  },

  'error.load': {
    pt: 'Erro ao carregar perguntas. Verifique sua conexão.',
    en: 'Error loading questions. Check your connection.',
  },
  'error.retry': { pt: 'Tentar novamente', en: 'Try again' },
};

export function t(key: string, lang: Lang, vars?: Record<string, string>): string {
  const entry = strings[key];
  if (!entry) return key;
  let text = entry[lang] ?? entry['pt'] ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      text = text.replace(`{${k}}`, v);
    }
  }
  return text;
}
