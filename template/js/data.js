/**
 * Conteúdo editável do protótipo estático.
 * Tudo o que aparece na página sai daqui — não há fetch, para abrir em file://.
 * Não inventar fatos: bio, cargo, cidade, e-mail, links, habilidades, projetos e datas
 * ficam vazios ou com tokens óbvios até existir texto real.
 */
window.SITE_DATA = {
  localeDefault: 'pt-BR',
  person: {
    displayName: '',
    shortTitle: '',
    contactEmail: '',
    avatarSrc: '',
    avatarAlt: '',
    locationLabel: '',
    bio: {
      'pt-BR': '',
      en: '',
    },
    socials: [],
    interests: [
      {
        id: 'interest-1',
        label: { 'pt-BR': '[Interesse 1]', en: '[Interest 1]' },
        placeholder: true,
      },
      {
        id: 'interest-2',
        label: { 'pt-BR': '[Interesse 2]', en: '[Interest 2]' },
        placeholder: true,
      },
      {
        id: 'interest-3',
        label: { 'pt-BR': '[Interesse 3]', en: '[Interest 3]' },
        placeholder: true,
      },
    ],
  },
  skills: [
    { id: 'skill-1', name: '[Skill 1]', glyph: 'ring', placeholder: true },
    { id: 'skill-2', name: '[Skill 2]', glyph: 'diamond', placeholder: true },
    { id: 'skill-3', name: '[Skill 3]', glyph: 'triangle', placeholder: true },
    { id: 'skill-4', name: '[Skill 4]', glyph: 'hex', placeholder: true },
    { id: 'skill-5', name: '[Skill 5]', glyph: 'waves', placeholder: true },
    { id: 'skill-6', name: '[Skill 6]', glyph: 'spark', placeholder: true },
    { id: 'skill-7', name: '[Skill 7]', glyph: 'plus', placeholder: true },
    { id: 'skill-8', name: '[Skill 8]', glyph: 'square', placeholder: true },
  ],
  projects: [
    {
      id: 'project-1',
      title: { 'pt-BR': '[Projeto 1]', en: '[Project 1]' },
      summary: {
        'pt-BR':
          'Descrição curta — substituir em template/js/data.js. Não é um projeto real.',
        en: 'Short description — replace it in template/js/data.js. Not a real project.',
      },
      tags: ['[Tag]', '[Tag 2]', '[Tag 3]'],
      screenshot: 'assets/screenshot-placeholder.svg',
      screenshotAlt: {
        'pt-BR':
          'Placeholder de screenshot. Espaço vazio até entrar uma imagem real.',
        en: 'Screenshot placeholder. Empty until a real image is added.',
      },
      links: [],
      placeholder: true,
    },
    {
      id: 'project-2',
      title: { 'pt-BR': '[Projeto 2]', en: '[Project 2]' },
      summary: {
        'pt-BR':
          'Segundo espaço só para o layout da lista. Sem app, empregador ou métrica.',
        en: 'Second slot for the list layout only. No app, employer, or metric.',
      },
      tags: ['[Tag]', '[Tag 2]'],
      screenshot: 'assets/screenshot-placeholder.svg',
      screenshotAlt: {
        'pt-BR':
          'Placeholder de screenshot. Espaço vazio até entrar uma imagem real.',
        en: 'Screenshot placeholder. Empty until a real image is added.',
      },
      links: [],
      placeholder: true,
    },
  ],
  journey: [
    {
      id: 'milestone-1',
      dateLabel: 'AAAA',
      title: { 'pt-BR': '[Marco 1]', en: '[Milestone 1]' },
      description: {
        'pt-BR': '[Empresa]\n[Cargo]',
        en: '[Company]\n[Role]',
      },
      icon: 'sprout',
      placeholder: true,
    },
    {
      id: 'milestone-2',
      dateLabel: 'AAAA',
      title: { 'pt-BR': '[Marco 2]', en: '[Milestone 2]' },
      description: {
        'pt-BR': '[Empresa]\n[Cargo]',
        en: '[Company]\n[Role]',
      },
      icon: 'pencil',
      placeholder: true,
    },
    {
      id: 'milestone-3',
      dateLabel: 'AAAA',
      title: { 'pt-BR': '[Marco 3]', en: '[Milestone 3]' },
      description: {
        'pt-BR': '[Empresa]\n[Cargo]',
        en: '[Company]\n[Role]',
      },
      icon: 'cube',
      placeholder: true,
    },
    {
      id: 'milestone-4',
      dateLabel: 'AAAA',
      title: { 'pt-BR': '[Marco 4]', en: '[Milestone 4]' },
      description: {
        'pt-BR': '[Empresa]\n[Cargo]',
        en: '[Company]\n[Role]',
      },
      icon: 'star',
      placeholder: true,
    },
  ],
  chatDemo: {
    'pt-BR':
      'Resposta fixa deste protótipo, sem chamada de IA. Biografia, habilidades e projetos da página continuam placeholders.',
    en: 'Fixed reply in this prototype, with no AI call. The biography, skills, and projects on this page are still placeholders.',
  },
  chatChips: [
    {
      id: 'work',
      label: { 'pt-BR': 'Trabalho', en: 'Work' },
      prompt: {
        'pt-BR': 'Quais projetos estão listados neste portfólio?',
        en: 'Which projects are listed on this portfolio?',
      },
    },
    {
      id: 'about',
      label: { 'pt-BR': 'Sobre', en: 'About' },
      prompt: {
        'pt-BR': 'O que este site já pode contar?',
        en: 'What can this site tell me so far?',
      },
    },
    {
      id: 'skills',
      label: { 'pt-BR': 'Habilidades', en: 'Skills' },
      prompt: {
        'pt-BR': 'Quais habilidades estão listadas?',
        en: 'Which skills are listed?',
      },
    },
    {
      id: 'contact',
      label: { 'pt-BR': 'Contato', en: 'Contact' },
      prompt: {
        'pt-BR': 'Como entro em contato?',
        en: 'How can I get in touch?',
      },
    },
  ],
  copy: {
    'pt-BR': {
      meta: {
        title: 'Portfólio — protótipo',
        description:
          'Protótipo estático do portfólio. Conteúdo ainda é placeholder.',
      },
      shell: {
        skip: 'Ir para o conteúdo',
        brand: 'Portfólio',
        navLabel: 'Seções',
        localeLabel: 'Idioma',
        menuOpen: 'Abrir menu',
        menuClose: 'Fechar menu',
        prototypeNote:
          'Protótipo estático para avaliar o layout. Edite template/js/data.js. Nenhum fato biográfico foi preenchido.',
      },
      sections: {
        hero: 'Hero',
        about: 'Sobre',
        skills: 'Habilidades',
        projects: 'Projetos',
        journey: 'Jornada',
        contact: 'Contato',
      },
      hero: {
        kicker: 'Chat',
        headline: 'Pergunte a este portfólio',
        subhead:
          'O assistente do site real responde só com notas adicionadas. Neste protótipo o campo fica desligado e a resposta é demo.',
        namePlaceholder: 'Seu nome',
        nameMissing: 'Nome ainda não adicionado.',
        avatarEmpty: 'Foto ainda não adicionada',
      },
      about: {
        kicker: 'Sobre',
        title: 'Sobre',
        blurb:
          'Um texto curto vindo do conteúdo do site, e uma galáxia para abrir.',
        bioPlaceholder:
          'Texto sobre mim — preencher bio em template/js/data.js',
        interestsLabel: 'Interesses',
        interestsPlaceholderLabel: 'Interesses — placeholders',
        placeholderBadge: 'Placeholder',
        explore: 'Explorar galáxia',
        close: 'Fechar',
        dialogTitle: 'Galáxia',
        hint: 'Arraste para olhar ao redor. Use a roda para aproximar. As setas giram a cena. Esc fecha. Esta cena é decorativa.',
        reducedHint:
          'Campo de estrelas parado. O movimento está reduzido, então a vista animada fica desligada.',
        sceneLabel: 'Galáxia de partículas',
      },
      skills: {
        kicker: 'Arco',
        title: 'Habilidades',
        blurb: 'Os ícones seguem um caminho curvo fechado por esta seção.',
        placeholderNote:
          'Placeholders — troque pelos nomes reais em template/js/data.js quando existirem.',
        empty: 'Nenhuma habilidade foi adicionada ainda.',
        trackLabel: 'Habilidades em um caminho curvo',
      },
      projects: {
        kicker: 'Vitrine',
        title: 'Projetos',
        intro:
          'Cada card junta um screenshot, uma descrição curta e as linguagens ou ferramentas usadas.',
        placeholderNote:
          'Placeholders de layout. Estes cards ficam até entrarem screenshots e textos reais em template/js/data.js.',
        placeholderBadge: 'Placeholder',
        empty: 'Nenhum projeto foi adicionado ainda.',
        screenshotMissing: 'Screenshot ainda não adicionado',
        tagsLabel: 'Ferramentas',
        linksLabel: 'Links',
        newTab: 'Abre em uma nova aba',
      },
      journey: {
        kicker: 'Jornada',
        title: 'Minha jornada',
        intro:
          'Uma linha do tempo das etapas. O arco abaixo é um modelo visual, sem datas ou empresas reais.',
        placeholderNote:
          'Modelo de layout. Substitua pelos marcos reais. Estes cartões não são empregadores, escolas ou datas.',
        placeholderBadge: 'Modelo',
        empty: 'Nenhum marco foi adicionado ainda.',
        trackLabel: 'Marcos da jornada',
        footer:
          'Cada marco representa uma escolha, um aprendizado e uma evolução.',
        motto: 'Explorando. Criando. Impactando.',
      },
      chat: {
        title: 'Chat',
        soonShort: 'Em breve',
        soon: 'Em breve. O campo fica desligado: este protótipo não chama nenhuma IA. A resposta marcada como demo é um texto fixo.',
        demoBadge: 'Demo',
        label: 'Mensagem',
        logLabel: 'Conversa',
        placeholder: 'Pergunte sobre este portfólio…',
        send: 'Enviar',
        you: 'Você',
        assistant: 'Assistente',
        chipsLabel: 'Perguntas sugeridas',
      },
      contact: {
        kicker: 'Contato',
        title: 'Contato',
        intro:
          'E-mail e links saem de template/js/data.js. O que estiver vazio continua como placeholder.',
        emailLabel: 'E-mail',
        socialsLabel: 'Links',
        emailPlaceholder:
          'E-mail — preencher contactEmail em template/js/data.js',
        socialsPlaceholder: 'Links — preencher socials em template/js/data.js',
        placeholderBadge: 'Placeholder',
        emailCta: 'Escrever um e-mail',
        newTab: 'Abre em uma nova aba',
      },
      footer: {
        namePlaceholder: 'Seu nome',
        localeNote:
          'Idioma desta página: {locale}. O padrão deste protótipo é pt-BR. O botão PT/EN troca o texto na mesma página.',
      },
    },
    en: {
      meta: {
        title: 'Portfolio — prototype',
        description:
          'Static portfolio prototype. Content is still placeholder.',
      },
      shell: {
        skip: 'Skip to content',
        brand: 'Portfolio',
        navLabel: 'Sections',
        localeLabel: 'Language',
        menuOpen: 'Open menu',
        menuClose: 'Close menu',
        prototypeNote:
          'Static prototype for reviewing the layout. Edit template/js/data.js. No biographical facts have been filled in.',
      },
      sections: {
        hero: 'Hero',
        about: 'About',
        skills: 'Skills',
        projects: 'Projects',
        journey: 'Journey',
        contact: 'Contact',
      },
      hero: {
        kicker: 'Chat',
        headline: 'Ask this portfolio',
        subhead:
          'The real site assistant answers only from notes added to the site. In this prototype the field stays off and the reply is a demo.',
        namePlaceholder: 'Your name',
        nameMissing: 'Name not added yet.',
        avatarEmpty: 'Photo not added yet',
      },
      about: {
        kicker: 'About',
        title: 'About',
        blurb: 'A short note from the site content, and a galaxy you can open.',
        bioPlaceholder: 'About text — fill bio in template/js/data.js',
        interestsLabel: 'Interests',
        interestsPlaceholderLabel: 'Interests — placeholders',
        placeholderBadge: 'Placeholder',
        explore: 'Explore galaxy',
        close: 'Close',
        dialogTitle: 'Galaxy',
        hint: 'Drag to look around. Scroll to zoom. Arrow keys rotate the scene. Esc closes. This scene is decorative.',
        reducedHint:
          'Still starfield. Motion is reduced, so the animated view stays off.',
        sceneLabel: 'Particle galaxy',
      },
      skills: {
        kicker: 'Arc',
        title: 'Skills',
        blurb: 'Icons follow a closed curved path across this section.',
        placeholderNote:
          'Placeholders — replace them with real names in template/js/data.js when they exist.',
        empty: 'No skills have been added yet.',
        trackLabel: 'Skills along a curved path',
      },
      projects: {
        kicker: 'Showcase',
        title: 'Projects',
        intro:
          'Each card pairs a screenshot with a short description and the languages or tools used.',
        placeholderNote:
          'Layout placeholders. These cards stay until real screenshots and copy are added in template/js/data.js.',
        placeholderBadge: 'Placeholder',
        empty: 'No projects have been added yet.',
        screenshotMissing: 'Screenshot not added yet',
        tagsLabel: 'Tools',
        linksLabel: 'Links',
        newTab: 'Opens in a new tab',
      },
      journey: {
        kicker: 'Journey',
        title: 'My journey',
        intro:
          'A timeline of stages. The arc below is a visual template, with no real dates or employers.',
        placeholderNote:
          'Layout template. Replace with real milestones. These cards are not employers, schools, or dates.',
        placeholderBadge: 'Template',
        empty: 'No milestones have been added yet.',
        trackLabel: 'Journey milestones',
        footer:
          'Each milestone stands for a choice, a lesson, and a step forward.',
        motto: 'Exploring. Creating. Making an impact.',
      },
      chat: {
        title: 'Chat',
        soonShort: 'Soon',
        soon: 'Coming soon. The field stays off: this prototype does not call any AI. The reply marked as demo is fixed text.',
        demoBadge: 'Demo',
        label: 'Message',
        logLabel: 'Conversation',
        placeholder: 'Ask about this portfolio…',
        send: 'Send',
        you: 'You',
        assistant: 'Assistant',
        chipsLabel: 'Suggested questions',
      },
      contact: {
        kicker: 'Contact',
        title: 'Contact',
        intro:
          'Email and links come from template/js/data.js. Anything still empty stays a placeholder.',
        emailLabel: 'Email',
        socialsLabel: 'Links',
        emailPlaceholder: 'Email — fill contactEmail in template/js/data.js',
        socialsPlaceholder: 'Links — fill socials in template/js/data.js',
        placeholderBadge: 'Placeholder',
        emailCta: 'Send an email',
        newTab: 'Opens in a new tab',
      },
      footer: {
        namePlaceholder: 'Your name',
        localeNote:
          'This page is in {locale}. This prototype defaults to pt-BR. The PT/EN control switches the copy on the same page.',
      },
    },
  },
};
