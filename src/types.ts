
export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Skill {
  id: string;
  name: string;
  level: number; // 1-5
}

export interface Link {
  id: string;
  label: string;
  url: string;
}

export interface PersonalInfo {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  website?: string;
  avatarUrl?: string;
}

export interface ResumeData {
  personal: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  links: Link[];
}

// Auth Types
export interface User {
  id: string;
  name: string;
  email: string;
  is_premium: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Config for the Dynamic Template System
export type TemplateLayout = 'sidebar-left' | 'sidebar-right' | 'single-column' | 'modern-grid';
export type TemplateFont = 'sans' | 'serif' | 'mono';
export type TemplateDensity = 'compact' | 'normal' | 'spacious';

export interface TemplateDesign {
  layout: TemplateLayout;
  fontHeading: TemplateFont;
  fontBody: TemplateFont;
  colorPrimary: string;
  colorSecondary: string;
  colorAccent: string;
  density: TemplateDensity;
  showIcons: boolean;
  headerStyle: 'centered' | 'left' | 'banner';
}

export interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string; // CSS color or placeholder
  isDynamic: boolean;
  isPremium: boolean; // Freemium flag
  category: 'ATS' | 'Professional' | 'Creative' | 'Modern';
  config?: TemplateDesign; // Only for dynamic templates
}

export enum TemplateType {
  ONYX = 'ONYX',
  QUARTZ = 'QUARTZ',
  CANVAS = 'CANVAS',
  HORIZON = 'HORIZON',
}
