export type ProjectLinkLabel = 'live' | 'repo' | 'case' | 'other';

export type ProjectCardModel = {
  id: string;
  title: string;
  summary: string;
  screenshotSrc: string | null;
  screenshotAlt: string;
  techTags: string[];
  placeholder: boolean;
  links: Array<{
    label: ProjectLinkLabel;
    href: string;
    external: boolean;
  }>;
};
