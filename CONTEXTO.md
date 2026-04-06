# GradBook+ — Contexto do Projeto para Continuação

> **Para a IA:** Este arquivo contém tudo que você precisa para continuar o desenvolvimento sem histórico de conversa. Leia por completo antes de qualquer ação.

---

## Visão Geral

**GradBook+** é um PWA (Progressive Web App) para médicos residentes. Funciona como um "whitebook digital": prontuários rápidos, calculadoras clínicas, bulário offline e prescrições prontas.

- **App ao vivo:** https://gradbookplus.web.app
- **Repositório:** https://github.com/pngjaico/GradBookApp
- **Projeto Firebase:** `gradbookplus` (ISOLADO do projeto MedGradPlus `meduni9-869eb`)

---

## Stack Técnica

| Camada | Tecnologia |
|--------|-----------|
| Framework | React 18 + Vite 5 |
| Roteamento | react-router-dom 6 |
| Backend | Firebase 10 (Auth + Firestore + Hosting + Analytics) |
| PWA | vite-plugin-pwa (Workbox, generateSW) |
| Estilo | CSS-in-JS inline + variáveis CSS globais |
| Tipografia | Outfit (títulos) + DM Sans (corpo) — Google Fonts |
| Deploy | Firebase Hosting (`firebase deploy --project gradbookplus`) |

---

## Firebase — Configuração Real

Arquivo: `src/firebase.js`

```js
const firebaseConfig = {
  apiKey: 'AIzaSyBZzTCJWaF6KAO3YQnjLx6SYHYagReCVSw',
  authDomain: 'gradbookplus.firebaseapp.com',
  projectId: 'gradbookplus',
  storageBucket: 'gradbookplus.firebasestorage.app',
  messagingSenderId: '575188477236',
  appId: '1:575188477236:web:a463bebb7c6c9f6d06b161',
  measurementId: 'G-0YWFJENMDN',
}
```

Exports: `auth`, `db`, `analytics`

### Autenticação habilitada no Console Firebase:
- ✅ Email + Senha
- ✅ Google Sign-In (habilitar manualmente em https://console.firebase.google.com/project/gradbookplus/authentication/providers se ainda não feito)

### Regras Firestore (`firestore.rules`):
```
/users/{uid}                   → lê/escreve apenas o próprio usuário
/users/{uid}/patients/{id}     → lê/escreve apenas o próprio usuário
/drugs/{id}                    → leitura pública, escrita admin
/prescriptions/{id}            → leitura pública, escrita admin
```

---

## Design System (CSS Variables)

Arquivo: `src/index.css`

```css
--color-primary: #00C896      /* verde-água — CTAs, destaque */
--color-cyan: #00B4D8         /* azul-ciano — accent secundário */
--color-bg: #1E2433           /* fundo geral */
--color-sidebar: #252B3A      /* header, nav, painéis */
--color-surface: #2A3142      /* cards, inputs */
--color-text: #E8EBF0         /* texto principal */
--color-text-secondary: #8B95A8  /* texto secundário, placeholders */
--color-danger: #FF4D6A       /* vermelho — delete, erros */
--radius: 12px
--transition: 150ms ease
```

**Classe global:**
- `.btn-primary` → botão verde, `color: #0A0F1A`, `width: 100%`

**Regras gerais:**
- `body` max-width: 430px, centrado — simula mobile
- `button` min-height: 48px (touch target)
- `@media print` presente → oculta nav/botões, fundo branco para `window.print()`

---

## Estrutura de Arquivos Atual

```
GradBook/
├── CONTEXTO.md               ← este arquivo
├── firebase.json             (hosting: dist/, SPA rewrite)
├── .firebaserc               (default: gradbookplus)
├── firestore.rules
├── firestore.indexes.json
├── package.json
├── vite.config.js            (PWA plugin configurado)
├── index.html                (Google Fonts no <head>)
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── firebase.js
    ├── index.css
    ├── hooks/
    │   ├── useAuth.jsx       (AuthContext: undefined=loading, null=logado-fora, user=logado)
    │   └── usePatients.js    (CRUD Firestore + onSnapshot real-time)
    ├── auth/
    │   ├── Login.jsx         (email+senha + Google, erros em PT-BR)
    │   └── Cadastro.jsx      (cria conta, salva perfil Firestore com trial 7 dias)
    ├── components/
    │   ├── BottomNav.jsx     (5 abas: Início / Pacientes / Referência / Ferramentas / Menu)
    │   ├── NovoPacienteModal.jsx  (bottom-sheet, campos: nome*, leito, diagnóstico, status)
    │   ├── AbaEvolucao.jsx   (textarea SOAP + menu /template + Exportar PDF)
    │   ├── AbaAdmissao.jsx   (textarea, debounce 800ms)
    │   ├── AbaNotas.jsx      (textarea, debounce 800ms)
    │   ├── AbaPendencias.jsx (checklist: adicionar / toggle / remover)
    │   └── AbaExames.jsx     (tabela: nome / valor / data + add/remove linhas)
    └── screens/
        ├── Home.jsx          (saudação personalizada + grid de módulos + botão Sair)
        ├── Pacientes.jsx     (lista com status badge 🟢🟡🔴 + pendências inline + FAB)
        ├── PacienteDetalhe.jsx (header + 5 abas: Evolução/Admissão/Exames/Pendências/Notas)
        ├── Referencia.jsx    ← STUB (apenas busca visual, sem dados)
        ├── Ferramentas.jsx   ← STUB (lista estática de 8 calculadoras, sem lógica)
        └── Menu.jsx          ← STUB (lista estática de itens, sem funcionalidade)
```

---

## Roteamento (App.jsx)

```
/login          → Login (redireciona para / se já logado)
/cadastro       → Cadastro (redireciona para / se já logado)
/               → Home
/pacientes      → Pacientes (lista)
/pacientes/:id  → PacienteDetalhe (detalhe com 5 abas)
/referencia     → Referencia
/ferramentas    → Ferramentas
/menu           → Menu
```

**AuthGate:** `user === undefined` → Spinner | `user === null` → redirect /login | `user` → AppLayout

---

## Modelo de Dados Firestore

### `/users/{uid}`
```js
{
  displayName: string,
  email: string,
  plan: 'trial' | 'premium' | 'free',
  trialEndsAt: Date,      // +7 dias do cadastro
  createdAt: serverTimestamp()
}
```

### `/users/{uid}/patients/{patientId}`
```js
{
  nome: string,           // obrigatório
  leito: string,          // ex: "UTI-3"
  diagnostico: string,
  status: 'estavel' | 'atencao' | 'critico',
  pendencias: [{ id: string, texto: string, feita: boolean }],
  evolucao: string,       // textarea SOAP
  admissao: string,       // textarea de admissão
  exames: [{ id: string, nome: string, valor: string, data: string }],
  notas: string,          // textarea livre
  criadoEm: serverTimestamp(),
  atualizadoEm: serverTimestamp()
}
```

---

## Padrões de Código Estabelecidos

### Auto-save com debounce
```jsx
const debounceRef = useRef(null)
function handleChange(val) {
  setTexto(val)
  clearTimeout(debounceRef.current)
  debounceRef.current = setTimeout(() => onSalvar({ campo: val }), 800)
}
```

### Estilo inline (padrão do projeto)
Todos os estilos são inline via `style={{ }}` — não usar CSS modules nem Tailwind.
Usar variáveis CSS: `'var(--color-primary)'`, `'var(--radius)'` etc.

### Commits
Prefixo semântico: `feat(modulo):`, `fix(modulo):`, `refactor:`
Co-author: `Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>`

### Deploy
```bash
node_modules/.bin/vite build
firebase deploy --project gradbookplus --only hosting,firestore:rules
git add <arquivos>
git commit -m "feat(...): ..."
git push origin main
```

---

## O que já está pronto ✅

- [x] Scaffold React + Vite + PWA
- [x] Design system (CSS variables, Outfit + DM Sans)
- [x] Firebase inicializado (Auth + Firestore + Analytics)
- [x] Autenticação completa (email+senha + Google, erros PT-BR)
- [x] Cadastro com trial 7 dias salvo no Firestore
- [x] AuthGate (loading spinner, redirect automático)
- [x] BottomNav com NavLink ativo
- [x] **Módulo Prontuários — COMPLETO:**
  - Lista de pacientes com status badge e pendências inline
  - Modal de criação (nome, leito, diagnóstico, status)
  - Tela de detalhe com 5 abas
  - Aba Evolução: SOAP + menu /template (soap, sepse, icc, pneumonia) + Exportar PDF
  - Aba Admissão: textarea com debounce
  - Aba Exames: tabela editável (nome/valor/data)
  - Aba Pendências: checklist com seções abertas/concluídas
  - Aba Notas: textarea livre com debounce
  - CRUD completo via Firestore (real-time com onSnapshot)
  - Estilo @media print para export PDF
- [x] Firestore rules publicadas
- [x] Deploy em https://gradbookplus.web.app
- [x] GitHub: https://github.com/pngjaico/GradBookApp

---

## O que falta — Próximas Etapas

---

### Etapa 2 — Calculadoras Clínicas (`/ferramentas`)

**Arquivo principal a substituir:** `src/screens/Ferramentas.jsx` (atualmente stub)

**Calculadoras a implementar (15+):**

| Calculadora | Campos de entrada | Output |
|-------------|-------------------|--------|
| Cockcroft-Gault (ClCr) | idade, peso, creatinina, sexo | mL/min + ajuste de dose |
| Wells (TVP) | 9 critérios clínicos | score + probabilidade baixa/moderada/alta |
| Wells (TEP) | 7 critérios clínicos | score + probabilidade |
| CURB-65 | confusão, ureia, FR, PA, idade ≥65 | score 0-5 + recomendação internação |
| SOFA | 6 órgãos (respiratório, coagulação, fígado, CV, SNC, renal) | score 0-24 + mortalidade estimada |
| APACHE II | 12 variáveis fisiológicas + idade + doença crônica | score + mortalidade |
| Glasgow | ocular, verbal, motor | score 3-15 + classificação |
| Child-Pugh | bilirrubina, albumina, TP, ascite, encefalopatia | classe A/B/C + sobrevida |
| MELD | bilirrubina, creatinina, INR | score + mortalidade 90 dias |
| PSI/PORT | variáveis demográficas + clínicas | classe I-V + manejo |
| Framingham (ICC) | critérios maiores + menores | diagnóstico confirmado/provável |
| Ranson (pancreatite) | critérios admissão + 48h | score + gravidade |
| IMC | peso, altura | IMC + classificação OMS |
| Clearance ureia | variáveis de hemodiálise | Kt/V adequacy |
| Dose de Vancomicina | peso, ClCr, indicação | dose + intervalo |

**Arquitetura sugerida:**
```
src/
  screens/Ferramentas.jsx       → lista de calculadoras, navega para detalhe
  screens/CalculadoraDetalhe.jsx → rota /ferramentas/:slug, renderiza a calc correta
  calculadoras/
    cockcroft.js     → { campos: [...], calcular: (inputs) => ({ resultado, interpretacao }) }
    wells-tvp.js
    wells-tep.js
    curb65.js
    sofa.js
    ... (uma por arquivo)
```

**Padrão de uma calculadora:**
```js
// src/calculadoras/curb65.js
export const CURB65 = {
  nome: 'CURB-65',
  descricao: 'Gravidade da Pneumonia Adquirida na Comunidade',
  campos: [
    { id: 'confusao', label: 'Confusão mental', tipo: 'boolean' },
    { id: 'ureia', label: 'Ureia > 19 mg/dL', tipo: 'boolean' },
    { id: 'fr', label: 'FR ≥ 30 irpm', tipo: 'boolean' },
    { id: 'pa', label: 'PA sistólica < 90 ou diastólica ≤ 60 mmHg', tipo: 'boolean' },
    { id: 'idade', label: 'Idade ≥ 65 anos', tipo: 'boolean' },
  ],
  calcular(inputs) {
    const score = Object.values(inputs).filter(Boolean).length
    const risco = score <= 1 ? 'Baixo' : score <= 2 ? 'Moderado' : 'Alto'
    const recomendacao = score <= 1 ? 'Tratamento ambulatorial' : score <= 2 ? 'Considerar internação' : 'Internação (considerar UTI se score ≥ 4)'
    return { score, risco, recomendacao }
  }
}
```

**Rota a adicionar em App.jsx:**
```jsx
<Route path="/ferramentas/:slug" element={<CalculadoraDetalhe />} />
```

**UI esperada:**
- Lista: card por calculadora com nome + descrição curta + seta `›`
- Detalhe: formulário com inputs (boolean = toggle/checkbox, number = input numérico), botão "Calcular", resultado em card colorido (verde/amarelo/vermelho conforme risco)
- Sem Firestore — tudo local/estático
- Sem paywall (calculadoras são gratuitas)

---

### Etapa 3 — Bulário (`/referencia`)

**Arquivo principal a substituir:** `src/screens/Referencia.jsx` (atualmente stub)

**Funcionalidades:**
- Busca por nome do fármaco (filtro em tempo real, sem Firestore)
- Cards com: nome, classe, indicações principais, posologia, ajuste renal/hepático, contraindicações
- Dados armazenados como JSON local (`src/data/farmacos.json`) — offline first
- Opcionalmente: busca no Firestore `/drugs/{drugId}` para dados extras (admin popula)

**Estrutura de dados sugerida (`src/data/farmacos.json`):**
```json
[
  {
    "id": "amoxicilina",
    "nome": "Amoxicilina",
    "classe": "Penicilina",
    "indicacoes": ["Pneumonia leve", "Otite", "Sinusite", "ITU não complicada"],
    "posologia": "500 mg VO 8/8h ou 875 mg 12/12h",
    "ajusteRenal": "ClCr < 30: reduzir dose",
    "ajusteHepatico": "Sem ajuste necessário",
    "contraindicacoes": ["Alergia a betalactâmicos"],
    "observacoes": "Preferir amoxicilina-clavulanato se suspeita de resistência"
  }
]
```

**Top 20 fármacos para começar:**
amoxicilina, amoxicilina-clavulanato, azitromicina, ceftriaxona, ciprofloxacino, metronidazol, omeprazol, enalapril, metoprolol, furosemida, espironolactona, captopril, atenolol, losartana, sinvastatina, metformina, insulina regular, heparina, enoxaparina, varfarina

**UI esperada:**
- Input de busca no topo (filtro instantâneo)
- Lista de resultados como cards expansíveis (tap para expandir/recolher)
- Ícone de categoria colorido por classe (antibiótico=vermelho, cardio=azul, etc.)
- Indicação "Disponível offline" no topo

---

### Etapa 4 — Prescrições (`/menu` → nova tela)

**Descrição:** Modelos de prescrição prontos para edição rápida

**Funcionalidades:**
- Lista de modelos (sepse, PAC, ICC, IAM, AVC, etc.)
- Tap no modelo → abre editor com prescrição pré-preenchida
- Botão "Exportar PDF" → `window.print()`
- Opcionalmente: salvar no Firestore (`/users/{uid}/prescricoes/`)

**Rota a adicionar:**
```
/prescricoes           → lista de modelos
/prescricoes/:slug     → editor da prescrição
```

**Modelos iniciais:**
- Sepse (bundle 1h + ATB + fluidos)
- PAC (ambupatório e internação)
- ICC descompensada
- DM em crise hiperglicêmica
- HAS urgência/emergência
- Dor abdominal aguda
- Analgesia multimodal pós-op

---

### Etapa 5 — Freemium / Paywall

**Descrição:** Bloquear funcionalidades premium após expiração do trial

**Lógica do trial:**
- `plan: 'trial'` e `trialEndsAt: Date` já estão salvos no Firestore no cadastro
- Verificar: `new Date() > user.trialEndsAt.toDate()` → trial expirado

**Hook a criar:** `src/hooks/usePlan.js`
```js
export function usePlan() {
  const user = useAuth()
  const [plan, setPlan] = useState(null)
  // busca /users/{uid} e retorna { plan, trialEndsAt, isActive, isPremium }
}
```

**O que é gratuito (sempre):**
- Calculadoras
- Bulário (visualização básica)
- 1 paciente no prontuário

**O que requer premium:**
- Pacientes ilimitados (free: máx 3)
- Exportar PDF da evolução
- Templates de prescrição

**UI do Paywall:**
- Modal bottom-sheet com: "Seu período grátis terminou", preço, botão "Assinar"
- Banner sutil no topo das telas bloqueadas
- Não bloquear acesso às calculadoras

**Integração de pagamento (futuro):**
- Stripe ou Hotmart (definir com o cliente)
- Webhook atualiza `plan: 'premium'` no Firestore

---

### Etapa 6 — Menu funcional

**Arquivo:** `src/screens/Menu.jsx` (atualmente stub)

**Itens funcionais:**
- **Meu Perfil** → editar nome, ver email, ver plano atual
- **Assinatura Premium** → tela de paywall/upgrade
- **Prescrições Salvas** → link para `/prescricoes`
- **Configurações** → tema (só dark por enquanto), feedback
- **Suporte** → link para WhatsApp ou e-mail
- **Sair** → `signOut(auth)` e redirect `/login`

---

## Comandos Úteis

```bash
# Rodar localmente
cd "C:\Users\Usuario-pc\Desktop\Aplicativo Uni9\GradBook"
npm run dev

# Build de produção
node_modules/.bin/vite build

# Deploy completo
firebase deploy --project gradbookplus

# Deploy só hosting
firebase deploy --project gradbookplus --only hosting

# Deploy só regras Firestore
firebase deploy --project gradbookplus --only firestore:rules

# Push para GitHub
git add <arquivos>
git commit -m "feat(modulo): descrição"
git push origin main
```

---

## Ordem de Prioridade Sugerida

1. **Calculadoras** (Etapa 2) — maior valor percebido, sem backend, testável offline
2. **Bulário** (Etapa 3) — dados estáticos em JSON, alta utilidade
3. **Menu funcional** (Etapa 6) — pequeno, resolve logout e perfil
4. **Prescrições** (Etapa 4) — médio esforço, alto valor clínico
5. **Freemium** (Etapa 5) — implementar depois que houver conteúdo suficiente para cobrar

---

## Observações Importantes

- **Não use `firebase init`** — o `firebase.json` e `.firebaserc` já estão configurados corretamente. Rodar `firebase init` vai sobrescrever e bagunçar.
- **Git identity já configurada** no repo local (pngjaico / pngjaico@gmail.com).
- **Google Sign-In** precisa ser habilitado no Firebase Console se ainda não estiver: https://console.firebase.google.com/project/gradbookplus/authentication/providers
- **Chunk size warning** no build (681kB) é esperado — Firebase SDK é grande. Ignorar por enquanto.
- **Estilo:** TODO inline via `style={{ }}`. Não introduzir CSS modules, Tailwind ou styled-components.
- **Sem TypeScript** — projeto usa JS puro.
