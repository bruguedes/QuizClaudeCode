# PRD — Quiz Web: Claude Code Knowledge Check

## Contexto e Motivação

O Claude Code é uma ferramenta poderosa da Anthropic, mas seu potencial é subutilizado por falta de conhecimento tanto no nível técnico quanto de negócio. Este quiz educacional serve como ferramenta de enablement para equipes: nivelar o conhecimento sobre Claude Code de forma gamificada, engajante e bilíngue (PT/EN), cobrindo desde conceitos básicos de negócio até configurações avançadas de uso.

---

## 1. Visão Geral do Produto

| Campo | Valor |
|---|---|
| Nome | Claude Code Knowledge Quiz |
| Versão | 1.0 MVP |
| Idiomas | Português (PT-BR) e Inglês (EN) |
| Formato das perguntas | Verdadeiro ou Falso |
| Total de perguntas | 30 (banco no Supabase) |
| Hospedagem | Vercel |
| Stack | Next.js 16.2.4 + Tailwind CSS v4 + Supabase |

---

## 2. Objetivos de Negócio

- **Educar** times técnicos e de negócio sobre as capacidades reais do Claude Code
- **Corrigir mitos** e desinformação sobre o que a ferramenta pode ou não fazer
- **Engajar** usuários com gamificação leve (timer, score, explicações, compartilhamento)
- **Ser referência** como recurso de onboarding para novos usuários de Claude Code

### Métricas de sucesso (KPIs sugeridos)
- Taxa de conclusão do quiz > 70%
- Score médio por sessão
- Taxa de compartilhamento de resultado
- Tempo médio por sessão

---

## 3. Público-alvo

| Perfil | Nível sugerido | O que aprende |
|---|---|---|
| PMs, stakeholders, gestores | Fácil (Beginner) | Capacidades, limites, casos de uso do Claude Code |
| Devs que nunca usaram | Médio (Intermediate) | Fluxos práticos, integrações, comandos principais |
| Devs experientes em AI/CLI | Avançado (Advanced) | Hooks, MCP, settings, subagentes, worktrees |

---

## 4. Funcionalidades (Features)

### 4.1 Modo Progressivo Adaptativo
- O quiz começa com perguntas do nível **Fácil**
- A cada **3 acertos consecutivos**, sobe um nível de dificuldade
- A cada **2 erros consecutivos**, desce um nível (mínimo: Fácil)
- Perguntas são selecionadas aleatoriamente do banco do nível atual
- O quiz termina após **10 perguntas** respondidas

### 4.2 Seleção de Idioma
- Tela inicial com selector de idioma: 🇧🇷 Português / 🇺🇸 English
- Todo o conteúdo (perguntas, explicações, UI) é traduzido
- Idioma salvo em `localStorage` para sessões futuras

### 4.3 Timer por Pergunta
- Cada pergunta tem **15 segundos** de tempo
- Barra de progresso visual que esvazia gradualmente
- Resposta não dada = conta como **erro**
- Timer pausado durante exibição da explicação pós-resposta

### 4.4 Feedback Pós-Resposta
- Imediatamente após responder (ou timer expirar), exibe:
  - ✅ Correto / ❌ Incorreto / ⏱️ Tempo esgotado
  - Explicação textual do porquê a afirmação é V ou F (1–3 linhas)
  - Link para documentação oficial quando relevante
- Avança automaticamente após 3 segundos ou clique

### 4.5 Tela de Resultado Final
- Score: X/10 com percentual
- Breakdown: quantas por nível (Fácil/Médio/Avançado)
- Nível máximo atingido durante o quiz
- Mensagem personalizada por faixa de score:
  - 0–4: "Continue aprendendo! 📖"
  - 5–7: "Bom progresso! 🚀"
  - 8–10: "Expert em Claude Code! 🏆"
- Botão **Jogar novamente** (reinicia com shuffle diferente)
- Botão **Compartilhar** → copia texto formatado para clipboard:
  ```
  Fiz o Claude Code Quiz e tirei X/10! 🤖
  Teste seu conhecimento: [URL]
  ```

---

## 5. Banco de Perguntas

### Schema no Supabase (PostgreSQL)
```sql
CREATE TABLE questions (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  level       text NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  statement_pt text NOT NULL,
  statement_en text NOT NULL,
  answer      boolean NOT NULL,
  explanation_pt text NOT NULL,
  explanation_en text NOT NULL,
  doc_link    text,
  created_at  timestamptz DEFAULT now()
);

-- Row Level Security: leitura pública, escrita apenas via service role
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read" ON questions FOR SELECT USING (true);
```

### Tipagem TypeScript (mapeada do banco)
```typescript
interface Question {
  id: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  statement: { pt: string; en: string };
  answer: boolean; // true = Verdadeiro, false = Falso
  explanation: { pt: string; en: string };
  docLink?: string; // URL opcional para docs oficiais
}
```

### Nível Fácil — Negócio e Conceitos Básicos (10 perguntas)

| # | Afirmação (PT) | Resposta | Explicação resumida |
|---|---|---|---|
| 1 | Claude Code é uma ferramenta de linha de comando (CLI) oficial da Anthropic. | ✅ Verdadeiro | É um CLI que roda no terminal, criado pela Anthropic. |
| 2 | Claude Code pode substituir completamente um desenvolvedor humano no processo de desenvolvimento. | ❌ Falso | É uma ferramenta de apoio; decisões de arquitetura, revisão de negócio e contexto ainda dependem de humanos. |
| 3 | Claude Code consegue ler e editar arquivos do seu projeto automaticamente. | ✅ Verdadeiro | Tem acesso ao sistema de arquivos local com permissão do usuário. |
| 4 | Para usar Claude Code, é necessário ter uma conta Anthropic ou chave de API. | ✅ Verdadeiro | Requer autenticação via `claude login` ou variável `ANTHROPIC_API_KEY`. |
| 5 | Claude Code é totalmente gratuito, sem nenhum custo de uso. | ❌ Falso | Consome tokens da API Anthropic, que tem custo por uso (exceto em planos com acesso incluído). |
| 6 | Claude Code pode ajudar a criar testes automatizados para código existente. | ✅ Verdadeiro | Pode ler o código e gerar suites de teste em diversas linguagens. |
| 7 | Claude Code só funciona com projetos JavaScript/TypeScript. | ❌ Falso | Suporta qualquer linguagem de programação. |
| 8 | Claude Code pode criar commits no Git em nome do usuário. | ✅ Verdadeiro | Pode executar comandos `git commit` como parte de suas ações. |
| 9 | Claude Code é um produto da OpenAI. | ❌ Falso | É desenvolvido e mantido pela Anthropic. |
| 10 | Claude Code pode ser usado para revisar código e sugerir melhorias antes de um pull request. | ✅ Verdadeiro | É um caso de uso comum: revisar diffs e dar feedback antes do merge. |

### Nível Intermediário — Uso Prático (10 perguntas)

| # | Afirmação (PT) | Resposta | Explicação resumida |
|---|---|---|---|
| 11 | Claude Code se integra nativamente com VS Code e JetBrains via extensão. | ✅ Verdadeiro | Existem extensões oficiais para ambos os IDEs. |
| 12 | O arquivo CLAUDE.md serve para dar instruções persistentes ao Claude Code sobre o projeto. | ✅ Verdadeiro | É carregado automaticamente em cada sessão como contexto base. |
| 13 | Claude Code não consegue executar comandos bash ou shell no terminal. | ❌ Falso | Possui a ferramenta Bash para executar comandos, com permissão do usuário. |
| 14 | "Hooks" no Claude Code permitem executar scripts automáticos em resposta a eventos do agente. | ✅ Verdadeiro | Podem ser configurados para rodar antes/depois de chamadas de ferramentas específicas. |
| 15 | Claude Code suporta servidores MCP (Model Context Protocol) para expandir suas capacidades. | ✅ Verdadeiro | MCP permite integrar ferramentas externas como bancos de dados, APIs e muito mais. |
| 16 | O modo `/plan` permite ao Claude planejar uma implementação sem executar nenhuma mudança. | ✅ Verdadeiro | Entra em modo de leitura, pesquisa e planeja antes de obter aprovação. |
| 17 | Claude Code armazena todo o histórico de conversas nos servidores da Anthropic. | ❌ Falso | O histórico de sessão fica localmente na máquina do usuário. |
| 18 | É possível usar Claude Code completamente offline, sem internet. | ❌ Falso | Requer conexão com a API da Anthropic para processar as requisições. |
| 19 | O arquivo `.claude/settings.json` pode definir permissões de ferramentas para o projeto. | ✅ Verdadeiro | Configura permissões, hooks, e comportamentos padrão por projeto. |
| 20 | Claude Code pode trabalhar em múltiplos arquivos do projeto simultaneamente numa mesma sessão. | ✅ Verdadeiro | Pode ler, editar e criar vários arquivos como parte de uma única tarefa. |

### Nível Avançado — Configuração e Internals (10 perguntas)

| # | Afirmação (PT) | Resposta | Explicação resumida |
|---|---|---|---|
| 21 | Hooks do Claude Code podem ser disparados especificamente antes ou depois de chamadas de ferramentas individuais. | ✅ Verdadeiro | Suportam eventos `PreToolCall` e `PostToolCall` por nome de ferramenta. |
| 22 | O MCP (Model Context Protocol) é um protocolo proprietário exclusivo do Claude Code. | ❌ Falso | É um protocolo aberto (open standard) criado pela Anthropic mas adotado por múltiplos players. |
| 23 | Claude Code suporta o uso de subagentes via a ferramenta `Agent`, permitindo trabalho paralelo. | ✅ Verdadeiro | Subagentes podem ser lançados em paralelo para tarefas independentes. |
| 24 | É possível configurar qual modelo Claude usar (Opus, Sonnet, Haiku) via settings do Claude Code. | ✅ Verdadeiro | O modelo pode ser configurado via settings ou flag `--model`. |
| 25 | O modo `worktree` cria uma cópia isolada do repositório git para o agente trabalhar sem afetar a branch principal. | ✅ Verdadeiro | Usa `git worktree` para isolamento; limpeza automática se sem mudanças. |
| 26 | Claude Code não pode ser integrado a pipelines de CI/CD por questões de segurança. | ❌ Falso | Pode ser usado em CI/CD com as permissões corretas e modo não-interativo. |
| 27 | O flag `--dangerously-skip-permissions` deve ser evitado em ambientes de produção pois desativa confirmações de segurança. | ✅ Verdadeiro | Remove todas as confirmações de ações; recomendado apenas em sandboxes controladas. |
| 28 | Claude Code usa um único modelo fixo para todas as tarefas, sem possibilidade de escolha pelo usuário. | ❌ Falso | O usuário pode escolher o modelo via configurações ou flags de linha de comando. |
| 29 | Sessões do Claude Code podem ser retomadas usando o flag `--resume` com o ID da sessão. | ✅ Verdadeiro | Permite continuar uma conversa anterior com todo o contexto preservado. |
| 30 | Claude Code só consegue trabalhar em projetos que já têm Git inicializado. | ❌ Falso | Funciona em qualquer diretório; Git é opcional e usado quando disponível. |

---

## 6. Especificações Técnicas

### Stack
```
Frontend: Next.js 16.2.4 (App Router)
Estilização: Tailwind CSS v4 (configurado via @theme em globals.css)
Animações: Framer Motion
Ícones: Lucide React
Banco de dados: Supabase (PostgreSQL)
Deploy: Vercel
Linguagem: TypeScript
Gerenciador de pacotes: npm
```

### Variáveis de Ambiente
```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
```

### Estrutura de Diretórios
```
quiz-claude-code/
├── app/
│   ├── layout.tsx            # Layout raiz com provider de idioma
│   ├── page.tsx              # Tela inicial (Welcome Screen)
│   └── quiz/
│       └── page.tsx          # Tela do quiz
├── components/
│   ├── WelcomeScreen.tsx     # Seleção de idioma + botão iniciar
│   ├── QuizCard.tsx          # Card da pergunta atual
│   ├── TimerBar.tsx          # Barra de progresso do timer
│   ├── AnswerFeedback.tsx    # Overlay de feedback pós-resposta
│   ├── ResultScreen.tsx      # Tela de resultado final
│   └── LevelBadge.tsx        # Badge de nível atual (Fácil/Médio/Avançado)
├── lib/
│   ├── supabase.ts           # Client Supabase (createBrowserClient)
│   ├── questions.ts          # Funções de fetch do banco (getQuestionsByLevel)
│   ├── quiz-engine.ts        # Lógica adaptativa (progressão de nível)
│   └── i18n.ts               # Strings de UI em PT e EN
├── hooks/
│   ├── useQuiz.ts            # Hook principal de estado do quiz
│   └── useTimer.ts           # Hook do countdown timer
├── types/
│   └── quiz.ts               # Interfaces TypeScript + Database types
├── supabase/
│   └── seed.sql              # Script de seed com as 30 perguntas
└── public/
    └── claude-icon.svg       # Ícone Claude
```

### Cliente Supabase (`lib/supabase.ts`)
```typescript
import { createBrowserClient } from '@supabase/ssr';

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

### Funções de Fetch (`lib/questions.ts`)
```typescript
import { supabase } from './supabase';
import type { Question, Level } from '@/types/quiz';

export async function getQuestionsByLevel(level: Level): Promise<Question[]> {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('level', level);

  if (error) throw error;

  return data.map(row => ({
    id: row.id,
    level: row.level,
    statement: { pt: row.statement_pt, en: row.statement_en },
    answer: row.answer,
    explanation: { pt: row.explanation_pt, en: row.explanation_en },
    docLink: row.doc_link ?? undefined,
  }));
}

export async function getAllQuestions(): Promise<Question[]> {
  const { data, error } = await supabase.from('questions').select('*');
  if (error) throw error;

  return data.map(row => ({
    id: row.id,
    level: row.level,
    statement: { pt: row.statement_pt, en: row.statement_en },
    answer: row.answer,
    explanation: { pt: row.explanation_pt, en: row.explanation_en },
    docLink: row.doc_link ?? undefined,
  }));
}
```

### Modelo de Dados Principal
```typescript
// types/quiz.ts
export type Level = 'beginner' | 'intermediate' | 'advanced';
export type Lang = 'pt' | 'en';

export interface Question {
  id: string;
  level: Level;
  statement: Record<Lang, string>;
  answer: boolean;
  explanation: Record<Lang, string>;
  docLink?: string;
}

export interface QuizState {
  currentQuestion: Question | null;
  questionIndex: number; // 0–9
  currentLevel: Level;
  consecutiveCorrect: number;
  consecutiveWrong: number;
  answers: AnswerRecord[];
  phase: 'welcome' | 'playing' | 'feedback' | 'result';
  lang: Lang;
}

export interface AnswerRecord {
  questionId: string;
  level: Level;
  correct: boolean;
  timedOut: boolean;
}
```

### Lógica Adaptativa (quiz-engine.ts)
```typescript
// Regras de progressão
const LEVEL_UP_THRESHOLD = 3;   // acertos consecutivos para subir
const LEVEL_DOWN_THRESHOLD = 2; // erros consecutivos para descer
const TOTAL_QUESTIONS = 10;

function getNextLevel(current: Level, consecutiveCorrect: number, consecutiveWrong: number): Level {
  if (consecutiveCorrect >= LEVEL_UP_THRESHOLD) {
    return current === 'beginner' ? 'intermediate'
         : current === 'intermediate' ? 'advanced'
         : 'advanced';
  }
  if (consecutiveWrong >= LEVEL_DOWN_THRESHOLD) {
    return current === 'advanced' ? 'intermediate'
         : current === 'intermediate' ? 'beginner'
         : 'beginner';
  }
  return current;
}
```

---

## 7. Design System

### Paleta de Cores
```css
--color-primary: #D97757;       /* Laranja Claude — CTAs, destaques */
--color-primary-light: #F5C6B0; /* Laranja claro — hover states */
--color-bg: #FAFAF8;            /* Fundo principal */
--color-surface: #FFFFFF;       /* Cards e superfícies */
--color-text: #1A1A1A;          /* Texto principal */
--color-text-muted: #6B7280;    /* Texto secundário */
--color-correct: #16A34A;       /* Verde — resposta correta */
--color-wrong: #DC2626;         /* Vermelho — resposta errada */
--color-timer: #D97757;         /* Barra de timer */
--color-border: #E5E7EB;        /* Bordas suaves */
```

### Tipografia
- **Fonte**: Inter (Google Fonts)
- **Heading**: `font-bold text-2xl` (32px)
- **Body**: `text-base` (16px)
- **Caption**: `text-sm text-muted` (14px)

### Componentes UI
- **Cards**: `rounded-2xl shadow-sm border border-gray-100 bg-white`
- **Botão Verdadeiro**: `bg-green-600 hover:bg-green-700 text-white rounded-xl`
- **Botão Falso**: `bg-red-600 hover:bg-red-700 text-white rounded-xl`
- **Level Badge**: pill colorido — Fácil (azul), Médio (amarelo), Avançado (vermelho)
- **Timer Bar**: barra horizontal que muda de laranja → vermelho nos últimos 5s

---

## 8. Internacionalização (i18n)

Strings de UI a traduzir (arquivo `lib/i18n.ts`):

| Chave | PT | EN |
|---|---|---|
| `welcome.title` | "Teste seu conhecimento sobre Claude Code" | "Test your Claude Code knowledge" |
| `welcome.subtitle` | "10 perguntas • Verdadeiro ou Falso • Progressivo" | "10 questions • True or False • Adaptive" |
| `welcome.start` | "Começar Quiz" | "Start Quiz" |
| `quiz.true` | "Verdadeiro" | "True" |
| `quiz.false` | "Falso" | "False" |
| `quiz.level.beginner` | "Iniciante" | "Beginner" |
| `quiz.level.intermediate` | "Intermediário" | "Intermediate" |
| `quiz.level.advanced` | "Avançado" | "Advanced" |
| `feedback.correct` | "Correto! ✅" | "Correct! ✅" |
| `feedback.wrong` | "Incorreto ❌" | "Wrong ❌" |
| `feedback.timeout` | "Tempo esgotado ⏱️" | "Time's up ⏱️" |
| `result.share` | "Compartilhar resultado" | "Share result" |
| `result.retry` | "Jogar novamente" | "Play again" |

---

## 9. Fluxo de Telas

```
[Tela Inicial]
  → Selecionar idioma (PT 🇧🇷 / EN 🇺🇸)
  → Botão "Começar"
      ↓
[Tela do Quiz]
  → Exibe: nível atual | progresso (1/10) | timer
  → Afirmação em destaque
  → Botões: [VERDADEIRO] [FALSO]
  → Timer expirado → marca como errado automaticamente
      ↓
[Feedback Pós-Resposta] (overlay por 3s)
  → Ícone ✅/❌/⏱️
  → Explicação da resposta correta
      ↓ (próxima pergunta ou resultado)
[Tela de Resultado]
  → Score X/10
  → Nível máximo atingido
  → Mensagem motivacional
  → [Compartilhar] [Jogar novamente]
```

---

## 10. Critérios de Aceitação

### Funcionais
- [ ] Usuário consegue selecionar idioma na tela inicial e o quiz roda completamente no idioma escolhido
- [ ] O quiz começa sempre no nível Fácil e progride/regride conforme acertos/erros consecutivos
- [ ] Timer de 15s funciona por pergunta; timeout conta como erro
- [ ] Após cada resposta, exibe feedback com explicação antes de avançar
- [ ] Tela de resultado exibe score, nível máximo e botões de compartilhar/reiniciar
- [ ] Botão de compartilhar copia texto formatado para o clipboard
- [ ] Perguntas são selecionadas aleatoriamente do nível atual (sem repetição na sessão)

### Não-Funcionais
- [ ] Lighthouse Score ≥ 90 em Performance e Acessibilidade
- [ ] Responsivo: funciona em mobile (320px) e desktop (1440px)
- [ ] Deploy na Vercel com URL pública acessível
- [ ] Perguntas carregadas do Supabase com tratamento de erro (fallback visual se offline)
- [ ] Tempo de carregamento inicial < 2s em 4G
- [ ] Row Level Security ativo no Supabase: leitura pública, sem escrita pelo client

---

## 11. Plano de Implementação (para Claude Code)

1. Inicializar projeto Next.js com TypeScript e Tailwind: `npx create-next-app@latest quiz-claude-code --typescript --tailwind --app`
2. Instalar dependências: `npm install framer-motion lucide-react @supabase/supabase-js @supabase/ssr`
3. **Configurar Supabase**:
   - Criar projeto no [supabase.com](https://supabase.com)
   - Copiar `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` para `.env.local`
   - Executar o schema SQL (seção 5) no SQL Editor do Supabase
   - Executar `supabase/seed.sql` com as 30 perguntas para popular o banco
4. Criar `lib/supabase.ts` com o browser client
5. Criar `types/quiz.ts` com todas as interfaces
6. Criar `lib/questions.ts` com as funções `getQuestionsByLevel` e `getAllQuestions`
7. Criar `lib/i18n.ts` com todas as strings de UI
8. Criar `lib/quiz-engine.ts` com a lógica adaptativa
9. Criar hooks: `useTimer.ts` e `useQuiz.ts` (useQuiz chama `getAllQuestions` na inicialização)
10. Criar componentes na ordem: `LevelBadge`, `TimerBar`, `QuizCard`, `AnswerFeedback`, `ResultScreen`, `WelcomeScreen`
11. Montar páginas: `app/page.tsx` (welcome) e `app/quiz/page.tsx`
12. Testar fluxo completo localmente (`npm run dev`)
13. Configurar variáveis de ambiente na Vercel (NEXT_PUBLIC_SUPABASE_URL e ANON_KEY)
14. Deploy na Vercel via `vercel --prod`
