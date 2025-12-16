import { ResumeData } from '../types';

const RESUME_DATA_PREFIX = 'resumify_data_';
const LAST_TEMPLATE_PREFIX = 'resumify_template_';

export const storageService = {
  saveResume: (userId: string, data: ResumeData) => {
    try {
      localStorage.setItem(`${RESUME_DATA_PREFIX}${userId}`, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save resume data', error);
    }
  },

  loadResume: (userId: string): ResumeData | null => {
    try {
      const saved = localStorage.getItem(`${RESUME_DATA_PREFIX}${userId}`);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error('Failed to load resume data', error);
      return null;
    }
  },

  saveLastTemplate: (userId: string, templateId: string) => {
    localStorage.setItem(`${LAST_TEMPLATE_PREFIX}${userId}`, templateId);
  },

  loadLastTemplate: (userId: string): string | null => {
    return localStorage.getItem(`${LAST_TEMPLATE_PREFIX}${userId}`);
  }
};