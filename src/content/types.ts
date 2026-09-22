export type LocaleCode = 'pt-BR' | 'en';

/** Optional copy per locale. Empty or missing text is not a biography. */
export type LocalizedCopy = Partial<Record<LocaleCode, string>>;

export type Interest = {
  id: string;
  label: LocalizedCopy;
};

export type Person = {
  id: string;
  displayName: string;
  shortTitle: string;
  localeDefault: LocaleCode;
  avatar: {
    src: string;
    alt: string;
  };
  location?: {
    label: string;
    timezone: string;
  };
  socials: Array<{
    id: string;
    label: string;
    href: string;
  }>;
  contactEmail?: string;
  /** Short about note. Leave blank until there is real copy. */
  bio?: LocalizedCopy;
  /** Interest labels. An empty list means the about section shows placeholders. */
  interests?: Interest[];
};

export type Skill = {
  id: string;
  name: string;
  category: 'language' | 'framework' | 'tool' | 'app' | 'other';
  icon: {
    kind: 'simple-icon' | 'lucide' | 'custom-svg';
    slug: string;
  };
  level?: 1 | 2 | 3 | 4 | 5;
  href?: string;
  order: number;
  /**
   * Layout example only. The skills section shows a replacement note
   * while any item is marked this way. Not a proficiency claim.
   */
  placeholder?: boolean;
};

export type Project = {
  id: string;
  title: string;
  summary: string;
  screenshot: {
    src: string;
    alt: string;
  };
  techTags: string[];
  links?: Array<{
    label: 'live' | 'repo' | 'case' | 'other';
    href: string;
  }>;
  featured?: boolean;
  order: number;
  /**
   * Layout example only. The projects section shows a replacement note
   * while any item is marked this way. Not a real project.
   */
  placeholder?: boolean;
};

export type JourneyMilestone = {
  id: string;
  dateLabel: string;
  title: string;
  description: string;
  kind: 'education' | 'work' | 'project' | 'award' | 'other';
  icon?: string;
  order: number;
};

export type ChatKnowledgeChunk = {
  id: string;
  topic:
    'about' | 'skills' | 'projects' | 'journey' | 'contact' | 'faq' | 'other';
  title: string;
  body: string;
  priority: number;
  tags: string[];
  updatedAt: string;
};
