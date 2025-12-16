
import { ResumeData, TemplateType, Template, TemplateDesign } from './types';
import { v4 as uuidv4 } from 'uuid';

export const INITIAL_RESUME_DATA: ResumeData = {
  personal: {
    fullName: 'Alex Morgan',
    title: 'Senior Product Designer',
    email: 'alex.morgan@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    summary: 'Creative and detail-oriented Product Designer with over 6 years of experience in building user-centric digital products. Proficient in translating complex requirements into intuitive and visually appealing designs. Passionate about design systems and accessibility.',
    website: 'www.alexmorgan.design'
  },
  experience: [
    {
      id: '1',
      company: 'TechFlow Solutions',
      position: 'Senior UI/UX Designer',
      startDate: '2021-03',
      endDate: '',
      current: true,
      description: '• Led the redesign of the core SaaS platform, increasing user engagement by 40%.\n• Mentored a team of 3 junior designers and established a unified design system.\n• Collaborated closely with engineering and product teams to deliver features on time.'
    },
    {
      id: '2',
      company: 'Creative Pulse Agency',
      position: 'Product Designer',
      startDate: '2018-06',
      endDate: '2021-02',
      current: false,
      description: '• Designed responsive websites and mobile apps for diverse clients in fintech and healthcare.\n• Conducted user research and usability testing to iterate on design concepts.\n• Facilitated design workshops with stakeholders to define product vision.'
    },
    {
      id: uuidv4(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    }
  ],
  education: [
    {
      id: '1',
      institution: 'California College of the Arts',
      degree: 'BFA in Interaction Design',
      startDate: '2014-09',
      endDate: '2018-05',
      current: false,
      description: 'Graduated with High Honors. Focus on human-computer interaction and visual design.'
    },
    {
      id: uuidv4(),
      institution: '',
      degree: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    }
  ],
  skills: [
    { id: '1', name: 'Figma', level: 5 },
    { id: '2', name: 'Prototyping', level: 5 },
    { id: '3', name: 'HTML/CSS', level: 4 },
    { id: '4', name: 'React Basic', level: 3 },
    { id: '5', name: 'User Research', level: 4 },
    { id: '6', name: 'Design Systems', level: 5 },
    { id: uuidv4(), name: '', level: 1 }
  ],
  links: [
    { id: '1', label: 'LinkedIn', url: 'linkedin.com/in/alexmorgan' },
    { id: '2', label: 'Dribbble', url: 'dribbble.com/alexmorgan' }
  ]
};

// --- Template Generation System ---

const colors = [
  { p: '#1e293b', s: '#475569', a: '#3b82f6' }, // Slate Blue
  { p: '#0f172a', s: '#334155', a: '#0ea5e9' }, // Dark Sky
  { p: '#000000', s: '#333333', a: '#666666' }, // Mono
  { p: '#14532d', s: '#166534', a: '#22c55e' }, // Forest
  { p: '#7c2d12', s: '#9a3412', a: '#f97316' }, // Burnt Orange
  { p: '#4c1d95', s: '#5b21b6', a: '#8b5cf6' }, // Royal Purple
  { p: '#831843', s: '#9d174d', a: '#ec4899' }, // Pink Rose
  { p: '#1e3a8a', s: '#1e40af', a: '#60a5fa' }, // Corporate Blue
  { p: '#374151', s: '#4b5563', a: '#10b981' }, // Gray Teal
  { p: '#262626', s: '#404040', a: '#f59e0b' }, // Dark Gold
];

const generateTemplates = (): Template[] => {
  // Legacy Templates - ALWAYS FREE
  const templates: Template[] = [
    { id: TemplateType.ONYX, name: 'Onyx', description: 'Modern sidebar layout with high contrast.', isDynamic: false, isPremium: false, category: 'Professional', thumbnail: 'bg-slate-900' },
    { id: TemplateType.QUARTZ, name: 'Quartz', description: 'Clean two-column layout with accent colors.', isDynamic: false, isPremium: false, category: 'Modern', thumbnail: 'bg-blue-100' },
    { id: TemplateType.CANVAS, name: 'Canvas', description: 'Classic, elegant full-width design.', isDynamic: false, isPremium: false, category: 'ATS', thumbnail: 'bg-gray-50' },
    // New Templates
    { id: TemplateType.HORIZON, name: 'Horizon', description: 'Elegant emerald design with sidebar.', isDynamic: false, isPremium: true, category: 'Professional', thumbnail: 'bg-emerald-900' },
    { id: 'HORIZON_MINIMAL', name: 'Horizon Minimal', description: 'Clean single-column layout with emerald accents.', isDynamic: false, isPremium: true, category: 'Modern', thumbnail: 'bg-emerald-50' },
  ];

  // 1. ATS Friendly (Single Column, Simple) - Mostly Free
  for (let i = 0; i < 15; i++) {
    const color = colors[i % colors.length];
    templates.push({
      id: `ats-${i}`,
      name: `ATS Standard ${i + 1}`,
      description: 'Clean, parseable single-column layout optimized for ATS.',
      isDynamic: true,
      isPremium: i > 4, // First 5 are free
      category: 'ATS',
      thumbnail: 'bg-white border-2',
      config: {
        layout: 'single-column',
        fontHeading: 'sans',
        fontBody: 'sans',
        colorPrimary: color.p,
        colorSecondary: color.s,
        colorAccent: color.a,
        density: i % 2 === 0 ? 'compact' : 'normal',
        showIcons: false,
        headerStyle: 'left'
      }
    });
  }

  // 2. Creative (Sidebar, Bold Colors) - Premium
  for (let i = 0; i < 15; i++) {
    const color = colors[(i + 3) % colors.length];
    templates.push({
      id: `creative-${i}`,
      name: `Creative Studio ${i + 1}`,
      description: 'Bold sidebar layout perfect for designers and artists.',
      isDynamic: true,
      isPremium: true, // All premium
      category: 'Creative',
      thumbnail: 'bg-gradient-to-br from-purple-100 to-blue-50',
      config: {
        layout: 'sidebar-left',
        fontHeading: i % 2 === 0 ? 'serif' : 'sans',
        fontBody: 'sans',
        colorPrimary: color.p,
        colorSecondary: color.s,
        colorAccent: color.a,
        density: 'normal',
        showIcons: true,
        headerStyle: 'left'
      }
    });
  }

  // 3. Professional (Right Sidebar, Banner Headers) - Premium
  for (let i = 0; i < 15; i++) {
    const color = colors[(i + 5) % colors.length];
    templates.push({
      id: `pro-${i}`,
      name: `Executive Pro ${i + 1}`,
      description: 'Sophisticated layout for management roles.',
      isDynamic: true,
      isPremium: true, // All premium
      category: 'Professional',
      thumbnail: 'bg-slate-200',
      config: {
        layout: i % 2 === 0 ? 'sidebar-right' : 'single-column',
        fontHeading: 'serif',
        fontBody: 'serif',
        colorPrimary: color.p,
        colorSecondary: color.s,
        colorAccent: color.a,
        density: 'spacious',
        showIcons: true,
        headerStyle: i % 3 === 0 ? 'banner' : 'centered'
      }
    });
  }

  // 4. Modern (Mix) - Mixed
  for (let i = 0; i < 10; i++) {
     const color = colors[(i + 1) % colors.length];
     templates.push({
      id: `modern-${i}`,
      name: `Modern Tech ${i + 1}`,
      description: 'Contemporary minimalist design.',
      isDynamic: true,
      isPremium: i > 2, // First 3 free
      category: 'Modern',
      thumbnail: 'bg-blue-50',
      config: {
        layout: 'single-column',
        fontHeading: 'sans',
        fontBody: 'mono',
        colorPrimary: color.p,
        colorSecondary: color.s,
        colorAccent: color.a,
        density: 'normal',
        showIcons: true,
        headerStyle: 'centered'
      }
    });
  }

  return templates;
};

export const AVAILABLE_TEMPLATES = generateTemplates();
