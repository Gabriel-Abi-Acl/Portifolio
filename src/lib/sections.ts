export const HOME_SECTIONS = [
  { id: 'hero', pr: 3 },
  { id: 'about', pr: 6 },
  { id: 'skills', pr: 4 },
  { id: 'projects', pr: 5 },
  { id: 'journey', pr: 7 },
  { id: 'contact', pr: 8 },
] as const;

export type HomeSectionId = (typeof HOME_SECTIONS)[number]['id'];
