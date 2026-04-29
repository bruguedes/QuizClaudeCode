-- Schema
CREATE TABLE IF NOT EXISTS questions (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  level          text NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  statement_pt   text NOT NULL,
  statement_en   text NOT NULL,
  answer         boolean NOT NULL,
  explanation_pt text NOT NULL,
  explanation_en text NOT NULL,
  doc_link       text,
  created_at     timestamptz DEFAULT now()
);

ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read" ON questions FOR SELECT USING (true);

-- ============================================================
-- BEGINNER (10 perguntas)
-- ============================================================
INSERT INTO questions (level, statement_pt, statement_en, answer, explanation_pt, explanation_en, doc_link) VALUES
(
  'beginner',
  'Claude Code é uma ferramenta de linha de comando (CLI) oficial da Anthropic.',
  'Claude Code is an official command-line tool (CLI) from Anthropic.',
  true,
  'Correto. Claude Code é um CLI que roda diretamente no terminal, desenvolvido e mantido pela Anthropic.',
  'Correct. Claude Code is a CLI that runs directly in the terminal, developed and maintained by Anthropic.',
  'https://docs.anthropic.com/en/docs/claude-code/overview'
),
(
  'beginner',
  'Claude Code pode substituir completamente um desenvolvedor humano no processo de desenvolvimento.',
  'Claude Code can completely replace a human developer in the development process.',
  false,
  'Falso. Claude Code é uma ferramenta de apoio; decisões de arquitetura, revisão de negócio e contexto humano ainda são necessários.',
  'False. Claude Code is an assistive tool; architecture decisions, business review, and human context are still required.',
  null
),
(
  'beginner',
  'Claude Code consegue ler e editar arquivos do seu projeto automaticamente.',
  'Claude Code can read and edit project files automatically.',
  true,
  'Verdadeiro. Claude Code tem acesso ao sistema de arquivos local com permissão do usuário, podendo ler e modificar arquivos.',
  'True. Claude Code has access to the local filesystem with user permission, being able to read and modify files.',
  null
),
(
  'beginner',
  'Para usar Claude Code, é necessário ter uma conta Anthropic ou chave de API.',
  'To use Claude Code, you need an Anthropic account or API key.',
  true,
  'Verdadeiro. É necessário autenticação via `claude login` ou a variável de ambiente ANTHROPIC_API_KEY.',
  'True. Authentication via `claude login` or the ANTHROPIC_API_KEY environment variable is required.',
  'https://docs.anthropic.com/en/docs/claude-code/setup'
),
(
  'beginner',
  'Claude Code é totalmente gratuito, sem nenhum custo de uso.',
  'Claude Code is completely free with no usage costs.',
  false,
  'Falso. Claude Code consome tokens da API Anthropic, que tem custo por uso, exceto em planos com acesso incluído.',
  'False. Claude Code consumes Anthropic API tokens, which have a per-use cost, except in plans with included access.',
  null
),
(
  'beginner',
  'Claude Code pode ajudar a criar testes automatizados para código existente.',
  'Claude Code can help create automated tests for existing code.',
  true,
  'Verdadeiro. Claude Code pode ler o código-fonte e gerar suites de teste em diversas linguagens de programação.',
  'True. Claude Code can read source code and generate test suites in various programming languages.',
  null
),
(
  'beginner',
  'Claude Code só funciona com projetos JavaScript/TypeScript.',
  'Claude Code only works with JavaScript/TypeScript projects.',
  false,
  'Falso. Claude Code suporta qualquer linguagem de programação, desde Python e Go até Rust e Java.',
  'False. Claude Code supports any programming language, from Python and Go to Rust and Java.',
  null
),
(
  'beginner',
  'Claude Code pode criar commits no Git em nome do usuário.',
  'Claude Code can create Git commits on behalf of the user.',
  true,
  'Verdadeiro. Claude Code pode executar comandos `git commit` como parte de suas ações, com aprovação do usuário.',
  'True. Claude Code can execute `git commit` commands as part of its actions, with user approval.',
  null
),
(
  'beginner',
  'Claude Code é um produto da OpenAI.',
  'Claude Code is a product from OpenAI.',
  false,
  'Falso. Claude Code é desenvolvido e mantido pela Anthropic, não pela OpenAI.',
  'False. Claude Code is developed and maintained by Anthropic, not OpenAI.',
  null
),
(
  'beginner',
  'Claude Code pode ser usado para revisar código e sugerir melhorias antes de um pull request.',
  'Claude Code can be used to review code and suggest improvements before a pull request.',
  true,
  'Verdadeiro. Revisar diffs e fornecer feedback antes do merge é um dos casos de uso mais comuns do Claude Code.',
  'True. Reviewing diffs and providing feedback before a merge is one of the most common use cases for Claude Code.',
  null
);

-- ============================================================
-- INTERMEDIATE (10 perguntas)
-- ============================================================
INSERT INTO questions (level, statement_pt, statement_en, answer, explanation_pt, explanation_en, doc_link) VALUES
(
  'intermediate',
  'Claude Code se integra nativamente com VS Code e JetBrains via extensão.',
  'Claude Code integrates natively with VS Code and JetBrains via extensions.',
  true,
  'Verdadeiro. Existem extensões oficiais para VS Code e IDEs JetBrains, permitindo usar Claude Code dentro do editor.',
  'True. There are official extensions for VS Code and JetBrains IDEs, allowing Claude Code to be used inside the editor.',
  'https://docs.anthropic.com/en/docs/claude-code/ide-integrations'
),
(
  'intermediate',
  'O arquivo CLAUDE.md serve para dar instruções persistentes ao Claude Code sobre o projeto.',
  'The CLAUDE.md file is used to give persistent instructions to Claude Code about the project.',
  true,
  'Verdadeiro. CLAUDE.md é carregado automaticamente em cada sessão como contexto base, permitindo instruções persistentes.',
  'True. CLAUDE.md is automatically loaded in each session as base context, enabling persistent instructions.',
  'https://docs.anthropic.com/en/docs/claude-code/memory'
),
(
  'intermediate',
  'Claude Code não consegue executar comandos bash ou shell no terminal.',
  'Claude Code cannot execute bash or shell commands in the terminal.',
  false,
  'Falso. Claude Code possui a ferramenta Bash para executar comandos no terminal, mediante aprovação do usuário.',
  'False. Claude Code has a Bash tool to execute terminal commands, with user approval.',
  null
),
(
  'intermediate',
  '"Hooks" no Claude Code permitem executar scripts automáticos em resposta a eventos do agente.',
  '"Hooks" in Claude Code allow automatic scripts to run in response to agent events.',
  true,
  'Verdadeiro. Hooks podem ser configurados para executar scripts antes ou depois de chamadas de ferramentas específicas.',
  'True. Hooks can be configured to run scripts before or after specific tool calls.',
  'https://docs.anthropic.com/en/docs/claude-code/hooks'
),
(
  'intermediate',
  'Claude Code suporta servidores MCP (Model Context Protocol) para expandir suas capacidades.',
  'Claude Code supports MCP (Model Context Protocol) servers to expand its capabilities.',
  true,
  'Verdadeiro. MCP permite integrar ferramentas externas como bancos de dados, APIs e serviços de terceiros ao Claude Code.',
  'True. MCP allows integrating external tools such as databases, APIs, and third-party services with Claude Code.',
  'https://docs.anthropic.com/en/docs/claude-code/mcp'
),
(
  'intermediate',
  'O modo `/plan` permite ao Claude planejar uma implementação sem executar nenhuma mudança.',
  'The `/plan` mode allows Claude to plan an implementation without executing any changes.',
  true,
  'Verdadeiro. No modo /plan, Claude apenas lê e pesquisa o código, planejando antes de obter aprovação para agir.',
  'True. In /plan mode, Claude only reads and researches code, planning before getting approval to act.',
  null
),
(
  'intermediate',
  'Claude Code armazena todo o histórico de conversas nos servidores da Anthropic.',
  'Claude Code stores all conversation history on Anthropic servers.',
  false,
  'Falso. O histórico de sessão fica armazenado localmente na máquina do usuário, não nos servidores da Anthropic.',
  'False. Session history is stored locally on the user''s machine, not on Anthropic servers.',
  null
),
(
  'intermediate',
  'É possível usar Claude Code completamente offline, sem internet.',
  'It is possible to use Claude Code completely offline, without internet.',
  false,
  'Falso. Claude Code requer conexão com a API da Anthropic para processar as requisições de linguagem.',
  'False. Claude Code requires a connection to the Anthropic API to process language requests.',
  null
),
(
  'intermediate',
  'O arquivo `.claude/settings.json` pode definir permissões de ferramentas para o projeto.',
  'The `.claude/settings.json` file can define tool permissions for the project.',
  true,
  'Verdadeiro. O settings.json por projeto configura permissões, hooks e comportamentos padrão específicos ao repositório.',
  'True. The per-project settings.json configures permissions, hooks, and default behaviors specific to the repository.',
  'https://docs.anthropic.com/en/docs/claude-code/settings'
),
(
  'intermediate',
  'Claude Code pode trabalhar em múltiplos arquivos do projeto simultaneamente numa mesma sessão.',
  'Claude Code can work on multiple project files simultaneously in the same session.',
  true,
  'Verdadeiro. Claude Code pode ler, editar e criar vários arquivos como parte de uma única tarefa na mesma sessão.',
  'True. Claude Code can read, edit, and create multiple files as part of a single task in the same session.',
  null
);

-- ============================================================
-- ADVANCED (10 perguntas)
-- ============================================================
INSERT INTO questions (level, statement_pt, statement_en, answer, explanation_pt, explanation_en, doc_link) VALUES
(
  'advanced',
  'Hooks do Claude Code podem ser disparados especificamente antes ou depois de chamadas de ferramentas individuais.',
  'Claude Code hooks can be triggered specifically before or after individual tool calls.',
  true,
  'Verdadeiro. Hooks suportam eventos PreToolCall e PostToolCall, podendo ser filtrados por nome de ferramenta específica.',
  'True. Hooks support PreToolCall and PostToolCall events, which can be filtered by specific tool name.',
  'https://docs.anthropic.com/en/docs/claude-code/hooks'
),
(
  'advanced',
  'O MCP (Model Context Protocol) é um protocolo proprietário exclusivo do Claude Code.',
  'MCP (Model Context Protocol) is a proprietary protocol exclusive to Claude Code.',
  false,
  'Falso. MCP é um protocolo aberto (open standard) criado pela Anthropic, mas adotado por múltiplos players e ferramentas.',
  'False. MCP is an open standard created by Anthropic but adopted by multiple players and tools.',
  'https://modelcontextprotocol.io'
),
(
  'advanced',
  'Claude Code suporta o uso de subagentes via a ferramenta `Agent`, permitindo trabalho paralelo.',
  'Claude Code supports the use of subagents via the `Agent` tool, enabling parallel work.',
  true,
  'Verdadeiro. Subagentes podem ser lançados em paralelo para executar tarefas independentes simultaneamente.',
  'True. Subagents can be launched in parallel to execute independent tasks simultaneously.',
  'https://docs.anthropic.com/en/docs/claude-code/sub-agents'
),
(
  'advanced',
  'É possível configurar qual modelo Claude usar (Opus, Sonnet, Haiku) via settings do Claude Code.',
  'It is possible to configure which Claude model to use (Opus, Sonnet, Haiku) via Claude Code settings.',
  true,
  'Verdadeiro. O modelo pode ser configurado via settings.json ou pelo flag --model na linha de comando.',
  'True. The model can be configured via settings.json or via the --model flag on the command line.',
  'https://docs.anthropic.com/en/docs/claude-code/settings'
),
(
  'advanced',
  'O modo `worktree` cria uma cópia isolada do repositório git para o agente trabalhar sem afetar a branch principal.',
  'The `worktree` mode creates an isolated copy of the git repository for the agent to work without affecting the main branch.',
  true,
  'Verdadeiro. Usa `git worktree` para isolamento; a cópia é limpa automaticamente se não houver mudanças.',
  'True. Uses `git worktree` for isolation; the copy is automatically cleaned up if no changes are made.',
  null
),
(
  'advanced',
  'Claude Code não pode ser integrado a pipelines de CI/CD por questões de segurança.',
  'Claude Code cannot be integrated into CI/CD pipelines for security reasons.',
  false,
  'Falso. Claude Code pode ser usado em CI/CD com as permissões corretas e modo não-interativo (--print ou --dangerously-skip-permissions em sandbox).',
  'False. Claude Code can be used in CI/CD with the correct permissions and non-interactive mode (--print or --dangerously-skip-permissions in a sandbox).',
  'https://docs.anthropic.com/en/docs/claude-code/github-actions'
),
(
  'advanced',
  'O flag `--dangerously-skip-permissions` deve ser evitado em ambientes de produção pois desativa confirmações de segurança.',
  'The `--dangerously-skip-permissions` flag should be avoided in production environments as it disables security confirmations.',
  true,
  'Verdadeiro. Esse flag remove todas as confirmações de ações do usuário; é recomendado apenas em sandboxes controladas.',
  'True. This flag removes all user action confirmations; it is recommended only in controlled sandboxes.',
  null
),
(
  'advanced',
  'Claude Code usa um único modelo fixo para todas as tarefas, sem possibilidade de escolha pelo usuário.',
  'Claude Code uses a single fixed model for all tasks, with no choice available to the user.',
  false,
  'Falso. O usuário pode escolher o modelo (Opus, Sonnet, Haiku) via configurações ou flags de linha de comando.',
  'False. The user can choose the model (Opus, Sonnet, Haiku) via settings or command-line flags.',
  null
),
(
  'advanced',
  'Sessões do Claude Code podem ser retomadas usando o flag `--resume` com o ID da sessão.',
  'Claude Code sessions can be resumed using the `--resume` flag with the session ID.',
  true,
  'Verdadeiro. O flag --resume permite continuar uma conversa anterior preservando todo o contexto.',
  'True. The --resume flag allows continuing a previous conversation with all context preserved.',
  null
),
(
  'advanced',
  'Claude Code só consegue trabalhar em projetos que já têm Git inicializado.',
  'Claude Code can only work in projects that already have Git initialized.',
  false,
  'Falso. Claude Code funciona em qualquer diretório; Git é opcional e utilizado quando disponível.',
  'False. Claude Code works in any directory; Git is optional and used when available.',
  null
);
