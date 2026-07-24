export interface Bio {
    name: string;
    avatar: string;
    avatarDark?: string;
    shortBio?: string;
    institution?: string;
}

export interface CVItem {
  institution: string;
  period: string;
  description: string;
}

export interface EducationItem extends CVItem {
  degree: string;
  thesis?: string;
}

export interface ExperienceItem extends CVItem {
  role: string;
}

export interface CV {
  name: string;
  title: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: Array<{ category: string; items: string }>;
  languages: Array<{ language: string; proficiency: string }>;
  hobbies?: string;
}

export interface BasePage {
  title: string;
  description?: string;
  featured_description?: string;
  tags: string[];
}

export interface Blog extends BasePage {
  date: string;
  author?: string;
}

export interface Project extends BasePage {
  date: string;
  author?: string;
  institution?: string;
  external_url?: string;
  demo_url?: string;
}

export interface Publication extends BasePage {
  date: string;
  author?: string;
  journal?: string;
  external_url?: string;
  video_embed_url?: string;
  abstract?: string;
  type?: false | string;
  publication_key?: string;
  scholar_id?: string;
  cited_by?: number;
  source?: string;
}
