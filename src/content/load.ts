import 'server-only';

import fs from 'node:fs';
import path from 'node:path';
import type {
  ChatKnowledgeChunk,
  Interest,
  JourneyMilestone,
  LocaleCode,
  LocalizedCopy,
  Person,
  Project,
  Skill,
} from './types';

const CONTENT_DIR = path.join(process.cwd(), 'content');

const EMPTY_PERSON: Person = {
  id: '',
  displayName: '',
  shortTitle: '',
  localeDefault: 'pt-BR',
  avatar: { src: '', alt: '' },
  socials: [],
};

const SKILL_CATEGORIES = [
  'language',
  'framework',
  'tool',
  'app',
  'other',
] as const;
const ICON_KINDS = ['simple-icon', 'lucide', 'custom-svg'] as const;
const PROJECT_LINK_LABELS = ['live', 'repo', 'case', 'other'] as const;
const JOURNEY_KINDS = [
  'education',
  'work',
  'project',
  'award',
  'other',
] as const;
const KNOWLEDGE_TOPICS = [
  'about',
  'skills',
  'projects',
  'journey',
  'contact',
  'faq',
  'other',
] as const;
const LOCALES = ['pt-BR', 'en'] as const;

function readJson(relativePath: string): unknown {
  const fullPath = path.join(CONTENT_DIR, relativePath);
  let raw: string;

  try {
    raw = fs.readFileSync(fullPath, 'utf8');
  } catch (error) {
    console.warn(`[content] Unable to read ${relativePath}.`, error);
    return undefined;
  }

  try {
    return JSON.parse(raw) as unknown;
  } catch (error) {
    console.warn(`[content] Invalid JSON in ${relativePath}.`, error);
    return undefined;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readString(
  record: Record<string, unknown>,
  key: string,
): string | undefined {
  const value = record[key];
  return typeof value === 'string' ? value : undefined;
}

function readNumber(
  record: Record<string, unknown>,
  key: string,
): number | undefined {
  const value = record[key];
  return typeof value === 'number' && Number.isFinite(value)
    ? value
    : undefined;
}

function oneOf<T extends string>(
  value: unknown,
  allowed: readonly T[],
): T | undefined {
  return typeof value === 'string' &&
    (allowed as readonly string[]).includes(value)
    ? (value as T)
    : undefined;
}

function readStringList(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  if (!value.every((item) => typeof item === 'string')) return undefined;
  return value;
}

function loadList<T>(
  relativePath: string,
  parseItem: (value: unknown) => T | undefined,
): T[] {
  const data = readJson(relativePath);
  if (data === undefined) return [];
  if (!Array.isArray(data)) {
    console.warn(`[content] Expected an array in ${relativePath}.`);
    return [];
  }

  return data.flatMap((item) => {
    const parsed = parseItem(item);
    return parsed === undefined ? [] : [parsed];
  });
}

function parsePerson(value: unknown): Person {
  if (!isRecord(value)) return EMPTY_PERSON;

  const id = readString(value, 'id');
  const displayName = readString(value, 'displayName');
  const shortTitle = readString(value, 'shortTitle');
  const localeDefault = oneOf<LocaleCode>(value.localeDefault, LOCALES);
  const avatar = isRecord(value.avatar) ? value.avatar : undefined;
  const avatarSrc = avatar ? readString(avatar, 'src') : undefined;
  const avatarAlt = avatar ? readString(avatar, 'alt') : undefined;

  if (
    id === undefined ||
    displayName === undefined ||
    shortTitle === undefined ||
    localeDefault === undefined ||
    avatarSrc === undefined ||
    avatarAlt === undefined ||
    !Array.isArray(value.socials)
  ) {
    console.warn(
      '[content] person.json is missing required fields. Using an empty person.',
    );
    return EMPTY_PERSON;
  }

  const socials = value.socials.flatMap((item) => {
    if (!isRecord(item)) return [];
    const socialId = readString(item, 'id');
    const label = readString(item, 'label');
    const href = readString(item, 'href');
    if (socialId === undefined || label === undefined || href === undefined) {
      return [];
    }
    return [{ id: socialId, label, href }];
  });

  const person: Person = {
    id,
    displayName,
    shortTitle,
    localeDefault,
    avatar: { src: avatarSrc, alt: avatarAlt },
    socials,
  };

  if (isRecord(value.location)) {
    const label = readString(value.location, 'label');
    const timezone = readString(value.location, 'timezone');
    if (label !== undefined && timezone !== undefined) {
      person.location = { label, timezone };
    }
  }

  if (value.contactEmail !== undefined) {
    const contactEmail = readString(value, 'contactEmail');
    if (contactEmail !== undefined) {
      person.contactEmail = contactEmail;
    }
  }

  const bio = parseLocalized(value.bio);
  if (bio) person.bio = bio;

  if (Array.isArray(value.interests)) {
    person.interests = value.interests.flatMap((item) => {
      const interest = parseInterest(item);
      return interest === undefined ? [] : [interest];
    });
  }

  return person;
}

function parseLocalized(value: unknown): LocalizedCopy | undefined {
  if (!isRecord(value)) return undefined;

  const copy: LocalizedCopy = {};
  for (const locale of LOCALES) {
    const text = readString(value, locale);
    if (text !== undefined) copy[locale] = text;
  }

  return Object.keys(copy).length > 0 ? copy : undefined;
}

function parseInterest(value: unknown): Interest | undefined {
  if (!isRecord(value)) return undefined;

  const id = readString(value, 'id')?.trim();
  const label = parseLocalized(value.label);
  if (!id || !label) return undefined;

  return { id, label };
}

function isSkillLevel(value: unknown): value is NonNullable<Skill['level']> {
  return (
    value === 1 || value === 2 || value === 3 || value === 4 || value === 5
  );
}

function parseSkill(value: unknown): Skill | undefined {
  if (!isRecord(value) || !isRecord(value.icon)) return undefined;

  const id = readString(value, 'id');
  const name = readString(value, 'name');
  const category = oneOf(value.category, SKILL_CATEGORIES);
  const kind = oneOf(value.icon.kind, ICON_KINDS);
  const slug = readString(value.icon, 'slug');
  const order = readNumber(value, 'order');

  if (
    id === undefined ||
    name === undefined ||
    category === undefined ||
    kind === undefined ||
    slug === undefined ||
    order === undefined
  ) {
    return undefined;
  }

  const skill: Skill = {
    id,
    name,
    category,
    icon: { kind, slug },
    order,
  };

  if (value.level !== undefined && isSkillLevel(value.level)) {
    skill.level = value.level;
  }

  const href = readString(value, 'href');
  if (href !== undefined) skill.href = href;

  if (value.placeholder === true) skill.placeholder = true;

  return skill;
}

function parseProject(value: unknown): Project | undefined {
  if (!isRecord(value) || !isRecord(value.screenshot)) return undefined;

  const id = readString(value, 'id');
  const title = readString(value, 'title');
  const summary = readString(value, 'summary');
  const src = readString(value.screenshot, 'src');
  const alt = readString(value.screenshot, 'alt');
  const techTags = readStringList(value.techTags);
  const order = readNumber(value, 'order');

  if (
    id === undefined ||
    title === undefined ||
    summary === undefined ||
    src === undefined ||
    alt === undefined ||
    techTags === undefined ||
    order === undefined
  ) {
    return undefined;
  }

  const project: Project = {
    id,
    title,
    summary,
    screenshot: { src, alt },
    techTags,
    order,
  };

  if (Array.isArray(value.links)) {
    project.links = value.links.flatMap((item) => {
      if (!isRecord(item)) return [];
      const label = oneOf(item.label, PROJECT_LINK_LABELS);
      const href = readString(item, 'href');
      if (label === undefined || href === undefined) return [];
      return [{ label, href }];
    });
  }

  if (typeof value.featured === 'boolean') {
    project.featured = value.featured;
  }

  if (value.placeholder === true) {
    project.placeholder = true;
  }

  return project;
}

function parseJourneyMilestone(value: unknown): JourneyMilestone | undefined {
  if (!isRecord(value)) return undefined;

  const id = readString(value, 'id');
  const dateLabel = readString(value, 'dateLabel');
  const title = readString(value, 'title');
  const description = readString(value, 'description');
  const kind = oneOf(value.kind, JOURNEY_KINDS);
  const order = readNumber(value, 'order');

  if (
    id === undefined ||
    dateLabel === undefined ||
    title === undefined ||
    description === undefined ||
    kind === undefined ||
    order === undefined
  ) {
    return undefined;
  }

  const milestone: JourneyMilestone = {
    id,
    dateLabel,
    title,
    description,
    kind,
    order,
  };

  const icon = readString(value, 'icon');
  if (icon !== undefined) milestone.icon = icon;

  if (value.placeholder === true) milestone.placeholder = true;

  return milestone;
}

function parseKnowledgeChunk(value: unknown): ChatKnowledgeChunk | undefined {
  if (!isRecord(value)) return undefined;

  const id = readString(value, 'id');
  const topic = oneOf(value.topic, KNOWLEDGE_TOPICS);
  const title = readString(value, 'title');
  const body = readString(value, 'body');
  const priority = readNumber(value, 'priority');
  const tags = readStringList(value.tags);
  const updatedAt = readString(value, 'updatedAt');

  if (
    id === undefined ||
    topic === undefined ||
    title === undefined ||
    body === undefined ||
    priority === undefined ||
    tags === undefined ||
    updatedAt === undefined
  ) {
    return undefined;
  }

  return { id, topic, title, body, priority, tags, updatedAt };
}

function byOrder<T extends { id: string; order: number }>(items: T[]): T[] {
  return [...items].sort(
    (a, b) => a.order - b.order || a.id.localeCompare(b.id),
  );
}

export function loadPerson(): Person {
  const data = readJson('person.json');
  if (data === undefined) return EMPTY_PERSON;
  return parsePerson(data);
}

export function loadSkills(): Skill[] {
  return byOrder(loadList('skills.json', parseSkill));
}

export function loadProjects(): Project[] {
  return byOrder(loadList('projects.json', parseProject));
}

export function loadJourney(): JourneyMilestone[] {
  return byOrder(loadList('journey.json', parseJourneyMilestone));
}

export function loadKnowledgeChunks(): ChatKnowledgeChunk[] {
  return loadList('knowledge/chunks.json', parseKnowledgeChunk).sort(
    (a, b) => b.priority - a.priority || a.id.localeCompare(b.id),
  );
}
