import React from 'react';
import { ResumeData, Experience, Education, Skill, Link } from '../types';
import { Plus, Trash2, ChevronDown, ChevronUp, GripVertical, Upload, X, Link as LinkIcon, ArrowLeft } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface EditorProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
  onBack: () => void;
}

const Editor: React.FC<EditorProps> = ({ data, onChange, onBack }) => {
  const [activeSection, setActiveSection] = React.useState<string | null>('personal');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const handlePersonalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onChange({
      ...data,
      personal: { ...data.personal, [name]: value }
    });
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({
          ...data,
          personal: { ...data.personal, avatarUrl: reader.result as string }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    onChange({
      ...data,
      personal: { ...data.personal, avatarUrl: undefined }
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const updateItem = (
    section: keyof ResumeData,
    id: string,
    field: string,
    value: any
  ) => {
    const list = data[section] as any[];
    const newList = list.map(item => item.id === id ? { ...item, [field]: value } : item);
    onChange({ ...data, [section]: newList });
  };

  const addItem = (section: keyof ResumeData, emptyItem: any) => {
    const list = data[section] as any[];
    onChange({ ...data, [section]: [...list, { ...emptyItem, id: uuidv4() }] });
  };

  const removeItem = (section: keyof ResumeData, id: string) => {
    const list = data[section] as any[];
    onChange({ ...data, [section]: list.filter(item => item.id !== id) });
  };

  const isValidUrl = (url: string) => {
    if (!url) return true;
    const pattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    return pattern.test(url);
  };

  return (
    <div className="flex flex-col gap-4 p-6 pb-20" role="main" aria-label="Resume Editor">
      <div className="flex items-center gap-3 mb-2">
         <button 
            onClick={onBack} 
            className="p-1 hover:bg-slate-100 rounded-full transition-colors focus:ring-2 focus:ring-blue-500 outline-none" 
            title="Back to Dashboard"
            aria-label="Back to Dashboard"
         >
             <ArrowLeft size={20} className="text-slate-600" />
         </button>
         <div>
            <h2 className="text-2xl font-bold text-slate-800 leading-none">Editor</h2>
            <span className="text-xs text-slate-500 font-mono">Customize content</span>
         </div>
      </div>

      {/* Personal Info */}
      <section className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden" aria-labelledby="personal-info-heading">
        <button 
          id="personal-info-heading"
          onClick={() => toggleSection('personal')}
          className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors focus:outline-none focus:bg-slate-100 focus:ring-2 focus:ring-inset focus:ring-blue-500"
          aria-expanded={activeSection === 'personal'}
          aria-controls="personal-info-content"
        >
          <span className="font-semibold text-slate-700">Personal Information</span>
          {activeSection === 'personal' ? <ChevronUp size={18} aria-hidden="true" /> : <ChevronDown size={18} aria-hidden="true" />}
        </button>
        
        {activeSection === 'personal' && (
          <div id="personal-info-content" className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-200">
            <div className="col-span-2">
                <span className="block text-xs font-bold text-slate-700 mb-2" id="avatar-label">Profile Picture</span>
                <div className="flex items-center gap-4" role="group" aria-labelledby="avatar-label">
                    {data.personal.avatarUrl ? (
                        <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-md border border-slate-200">
                            <img src={data.personal.avatarUrl} alt="Current avatar" className="w-12 h-12 rounded-full object-cover border border-slate-300" />
                            <button 
                                onClick={handleRemoveAvatar} 
                                className="text-slate-500 hover:text-red-600 hover:bg-red-50 p-1.5 rounded transition-colors focus:ring-2 focus:ring-red-500 outline-none" 
                                title="Remove image"
                                aria-label="Remove profile picture"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ) : (
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-2 text-sm text-blue-700 font-medium hover:bg-blue-50 px-4 py-2 rounded-md transition-colors border border-dashed border-blue-300 hover:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
                            aria-label="Upload profile picture"
                        >
                            <Upload size={16} aria-hidden="true" />
                            <span>Upload Photo</span>
                        </button>
                    )}
                    <input 
                        type="file" 
                        ref={fileInputRef}
                        className="hidden" 
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        aria-hidden="true"
                        tabIndex={-1}
                    />
                </div>
            </div>

            <div className="col-span-2">
                <label htmlFor="personal-fullName" className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input 
                  id="personal-fullName"
                  type="text" 
                  name="fullName"
                  value={data.personal.fullName}
                  onChange={handlePersonalChange}
                  className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-800"
                  placeholder="e.g. Jane Doe"
                />
            </div>
            <div className="col-span-2">
                <label htmlFor="personal-title" className="block text-xs font-bold text-slate-700 mb-1">Job Title</label>
                <input 
                  id="personal-title"
                  type="text" 
                  name="title"
                  value={data.personal.title}
                  onChange={handlePersonalChange}
                  className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-800"
                  placeholder="e.g. Senior Product Designer"
                />
            </div>
            <div>
                <label htmlFor="personal-email" className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                <input 
                  id="personal-email"
                  type="email" 
                  name="email"
                  value={data.personal.email}
                  onChange={handlePersonalChange}
                  className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-800"
                />
            </div>
            <div>
                <label htmlFor="personal-phone" className="block text-xs font-bold text-slate-700 mb-1">Phone</label>
                <input 
                  id="personal-phone"
                  type="text" 
                  name="phone"
                  value={data.personal.phone}
                  onChange={handlePersonalChange}
                  className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-800"
                />
            </div>
             <div>
                <label htmlFor="personal-location" className="block text-xs font-bold text-slate-700 mb-1">Location</label>
                <input 
                  id="personal-location"
                  type="text" 
                  name="location"
                  value={data.personal.location}
                  onChange={handlePersonalChange}
                  className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-800"
                />
            </div>
             <div>
                <label htmlFor="personal-website" className="block text-xs font-bold text-slate-700 mb-1">Website</label>
                <input 
                  id="personal-website"
                  type="text" 
                  name="website"
                  value={data.personal.website || ''}
                  onChange={handlePersonalChange}
                  className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-800"
                />
            </div>
            <div className="col-span-2">
                <label htmlFor="personal-summary" className="block text-xs font-bold text-slate-700 mb-1">Professional Summary</label>
                <textarea 
                  id="personal-summary"
                  name="summary"
                  value={data.personal.summary}
                  onChange={handlePersonalChange}
                  rows={4}
                  className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-y text-slate-800"
                  placeholder="Briefly describe your professional background..."
                />
            </div>
          </div>
        )}
      </section>

      {/* Experience */}
      <section className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden" aria-labelledby="experience-heading">
        <button 
          id="experience-heading"
          onClick={() => toggleSection('experience')}
          className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors focus:outline-none focus:bg-slate-100 focus:ring-2 focus:ring-inset focus:ring-blue-500"
          aria-expanded={activeSection === 'experience'}
          aria-controls="experience-content"
        >
          <span className="font-semibold text-slate-700">Experience</span>
          {activeSection === 'experience' ? <ChevronUp size={18} aria-hidden="true" /> : <ChevronDown size={18} aria-hidden="true" />}
        </button>
        
        {activeSection === 'experience' && (
          <div id="experience-content" className="p-4 space-y-6 animate-in slide-in-from-top-2 duration-200">
             {data.experience.map((exp) => (
               <div key={exp.id} className="relative p-4 border border-slate-200 rounded-md bg-slate-50/50 group" role="group" aria-label={`Experience at ${exp.company || 'New Company'}`}>
                 <button 
                    onClick={() => removeItem('experience', exp.id)}
                    className="absolute top-2 right-2 text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 focus:ring-2 focus:ring-red-500 rounded p-1"
                    title="Remove item"
                    aria-label={`Remove experience at ${exp.company}`}
                 >
                   <Trash2 size={16} aria-hidden="true" />
                 </button>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <div>
                        <label htmlFor={`exp-pos-${exp.id}`} className="sr-only">Position</label>
                        <input 
                        id={`exp-pos-${exp.id}`}
                        className="w-full p-2 border border-slate-300 rounded font-medium focus:ring-2 focus:ring-blue-500 outline-none" 
                        placeholder="Position"
                        aria-label="Job Position"
                        value={exp.position}
                        onChange={(e) => updateItem('experience', exp.id, 'position', e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor={`exp-co-${exp.id}`} className="sr-only">Company</label>
                        <input 
                        id={`exp-co-${exp.id}`}
                        className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" 
                        placeholder="Company"
                        aria-label="Company Name"
                        value={exp.company}
                        onChange={(e) => updateItem('experience', exp.id, 'company', e.target.value)}
                        />
                    </div>
                    <div>
                         <label htmlFor={`exp-start-${exp.id}`} className="sr-only">Start Date</label>
                        <input 
                        id={`exp-start-${exp.id}`}
                        className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" 
                        placeholder="Start Date (e.g. 2020-01)"
                        aria-label="Start Date"
                        value={exp.startDate}
                        onChange={(e) => updateItem('experience', exp.id, 'startDate', e.target.value)}
                        />
                    </div>
                     <div className="flex gap-2">
                        <label htmlFor={`exp-end-${exp.id}`} className="sr-only">End Date</label>
                        <input 
                        id={`exp-end-${exp.id}`}
                        className="p-2 border border-slate-300 rounded flex-1 disabled:bg-slate-100 focus:ring-2 focus:ring-blue-500 outline-none" 
                        placeholder="End Date"
                        aria-label="End Date"
                        value={exp.endDate}
                        disabled={exp.current}
                        onChange={(e) => updateItem('experience', exp.id, 'endDate', e.target.value)}
                        />
                        <div className="flex items-center gap-1 bg-white px-2 border border-slate-300 rounded">
                           <input 
                            id={`exp-current-${exp.id}`}
                            type="checkbox"
                            checked={exp.current}
                            onChange={(e) => updateItem('experience', exp.id, 'current', e.target.checked)}
                            className="w-4 h-4 focus:ring-2 focus:ring-blue-500"
                           />
                           <label htmlFor={`exp-current-${exp.id}`} className="text-xs font-medium text-slate-700">Current</label>
                        </div>
                     </div>
                 </div>
                 <label htmlFor={`exp-desc-${exp.id}`} className="sr-only">Description</label>
                 <textarea 
                    id={`exp-desc-${exp.id}`}
                    className="w-full p-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    rows={3}
                    placeholder="Description of responsibilities..."
                    aria-label="Job Description"
                    value={exp.description}
                    onChange={(e) => updateItem('experience', exp.id, 'description', e.target.value)}
                 />
               </div>
             ))}
             <button 
                onClick={() => addItem('experience', { position: '', company: '', startDate: '', endDate: '', current: false, description: '' })}
                className="w-full py-2 flex items-center justify-center gap-2 border-2 border-dashed border-slate-300 rounded-md text-slate-600 hover:border-blue-500 hover:text-blue-700 transition-colors font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                aria-label="Add new experience"
             >
               <Plus size={16} aria-hidden="true" /> Add Position
             </button>
          </div>
        )}
      </section>

       {/* Education */}
      <section className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden" aria-labelledby="education-heading">
        <button 
          id="education-heading"
          onClick={() => toggleSection('education')}
          className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors focus:outline-none focus:bg-slate-100 focus:ring-2 focus:ring-inset focus:ring-blue-500"
          aria-expanded={activeSection === 'education'}
          aria-controls="education-content"
        >
          <span className="font-semibold text-slate-700">Education</span>
          {activeSection === 'education' ? <ChevronUp size={18} aria-hidden="true" /> : <ChevronDown size={18} aria-hidden="true" />}
        </button>
        
        {activeSection === 'education' && (
          <div id="education-content" className="p-4 space-y-6 animate-in slide-in-from-top-2 duration-200">
             {data.education.map((edu) => (
               <div key={edu.id} className="relative p-4 border border-slate-200 rounded-md bg-slate-50/50 group" role="group" aria-label={`Education at ${edu.institution || 'New Institution'}`}>
                 <button 
                    onClick={() => removeItem('education', edu.id)}
                    className="absolute top-2 right-2 text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 focus:ring-2 focus:ring-red-500 rounded p-1"
                    title="Remove item"
                    aria-label={`Remove education at ${edu.institution}`}
                 >
                   <Trash2 size={16} aria-hidden="true" />
                 </button>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <div>
                        <label htmlFor={`edu-inst-${edu.id}`} className="sr-only">Institution</label>
                        <input 
                        id={`edu-inst-${edu.id}`}
                        className="w-full p-2 border border-slate-300 rounded font-medium focus:ring-2 focus:ring-blue-500 outline-none" 
                        placeholder="School / Institution"
                        aria-label="School or Institution"
                        value={edu.institution}
                        onChange={(e) => updateItem('education', edu.id, 'institution', e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor={`edu-deg-${edu.id}`} className="sr-only">Degree</label>
                        <input 
                        id={`edu-deg-${edu.id}`}
                        className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" 
                        placeholder="Degree / Major"
                        aria-label="Degree or Major"
                        value={edu.degree}
                        onChange={(e) => updateItem('education', edu.id, 'degree', e.target.value)}
                        />
                    </div>
                     <div>
                        <label htmlFor={`edu-start-${edu.id}`} className="sr-only">Start Date</label>
                        <input 
                        id={`edu-start-${edu.id}`}
                        className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" 
                        placeholder="Start Date"
                        aria-label="Start Date"
                        value={edu.startDate}
                        onChange={(e) => updateItem('education', edu.id, 'startDate', e.target.value)}
                        />
                    </div>
                     <div>
                        <label htmlFor={`edu-end-${edu.id}`} className="sr-only">End Date</label>
                        <input 
                        id={`edu-end-${edu.id}`}
                        className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" 
                        placeholder="End Date"
                        aria-label="End Date"
                        value={edu.endDate}
                        onChange={(e) => updateItem('education', edu.id, 'endDate', e.target.value)}
                        />
                    </div>
                 </div>
               </div>
             ))}
             <button 
                onClick={() => addItem('education', { institution: '', degree: '', startDate: '', endDate: '', current: false, description: '' })}
                className="w-full py-2 flex items-center justify-center gap-2 border-2 border-dashed border-slate-300 rounded-md text-slate-600 hover:border-blue-500 hover:text-blue-700 transition-colors font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                aria-label="Add new education"
             >
               <Plus size={16} aria-hidden="true" /> Add Education
             </button>
          </div>
        )}
      </section>

       {/* Skills */}
      <section className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden" aria-labelledby="skills-heading">
        <button 
          id="skills-heading"
          onClick={() => toggleSection('skills')}
          className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors focus:outline-none focus:bg-slate-100 focus:ring-2 focus:ring-inset focus:ring-blue-500"
          aria-expanded={activeSection === 'skills'}
          aria-controls="skills-content"
        >
          <span className="font-semibold text-slate-700">Skills</span>
          {activeSection === 'skills' ? <ChevronUp size={18} aria-hidden="true" /> : <ChevronDown size={18} aria-hidden="true" />}
        </button>
        
        {activeSection === 'skills' && (
          <div id="skills-content" className="p-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
             <div className="grid grid-cols-2 gap-3" role="list">
             {data.skills.map((skill) => (
               <div key={skill.id} className="flex items-center gap-2 p-2 border border-slate-200 rounded-md bg-white" role="listitem">
                 <label htmlFor={`skill-name-${skill.id}`} className="sr-only">Skill Name</label>
                 <input 
                    id={`skill-name-${skill.id}`}
                    className="flex-1 outline-none text-sm p-1 focus:ring-2 focus:ring-blue-500 rounded"
                    placeholder="Skill"
                    aria-label="Skill Name"
                    value={skill.name}
                    onChange={(e) => updateItem('skills', skill.id, 'name', e.target.value)}
                 />
                 <label htmlFor={`skill-level-${skill.id}`} className="sr-only">Skill Level (1-5)</label>
                 <input 
                    id={`skill-level-${skill.id}`}
                    type="range"
                    min="1"
                    max="5"
                    className="w-16 h-1"
                    aria-label={`Level for ${skill.name || 'skill'}`}
                    value={skill.level}
                    onChange={(e) => updateItem('skills', skill.id, 'level', parseInt(e.target.value))}
                 />
                 <button 
                    onClick={() => removeItem('skills', skill.id)}
                    className="text-slate-400 hover:text-red-500 focus:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 rounded p-1"
                    aria-label={`Remove skill ${skill.name}`}
                 >
                   <Trash2 size={14} aria-hidden="true" />
                 </button>
               </div>
             ))}
             </div>
             <button 
                onClick={() => addItem('skills', { name: '', level: 3 })}
                className="w-full py-2 flex items-center justify-center gap-2 border-2 border-dashed border-slate-300 rounded-md text-slate-600 hover:border-blue-500 hover:text-blue-700 transition-colors font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                aria-label="Add new skill"
             >
               <Plus size={16} aria-hidden="true" /> Add Skill
             </button>
          </div>
        )}
      </section>

       {/* Links */}
      <section className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden" aria-labelledby="links-heading">
        <button 
          id="links-heading"
          onClick={() => toggleSection('links')}
          className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors focus:outline-none focus:bg-slate-100 focus:ring-2 focus:ring-inset focus:ring-blue-500"
          aria-expanded={activeSection === 'links'}
          aria-controls="links-content"
        >
          <span className="font-semibold text-slate-700">Links</span>
          {activeSection === 'links' ? <ChevronUp size={18} aria-hidden="true" /> : <ChevronDown size={18} aria-hidden="true" />}
        </button>
        
        {activeSection === 'links' && (
          <div id="links-content" className="p-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
            {data.links.map((link) => (
              <div key={link.id} className="flex items-start gap-2 p-2 border border-slate-200 rounded-md bg-white" role="group" aria-label={`Link ${link.label}`}>
                 <div className="flex-1 space-y-2">
                     <label htmlFor={`link-label-${link.id}`} className="sr-only">Label</label>
                     <input 
                        id={`link-label-${link.id}`}
                        className="w-full p-2 border border-slate-300 rounded text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                        placeholder="Label (e.g. LinkedIn)"
                        aria-label="Link Label"
                        value={link.label}
                        onChange={(e) => updateItem('links', link.id, 'label', e.target.value)}
                     />
                     <label htmlFor={`link-url-${link.id}`} className="sr-only">URL</label>
                     <input 
                        id={`link-url-${link.id}`}
                        className={`w-full p-2 border rounded text-sm outline-none focus:ring-2 focus:ring-blue-500 ${
                            !isValidUrl(link.url) ? 'border-red-300 bg-red-50' : 'border-slate-300'
                        }`}
                        placeholder="URL (e.g. linkedin.com/in/you)"
                        aria-label="Link URL"
                        value={link.url}
                        onChange={(e) => updateItem('links', link.id, 'url', e.target.value)}
                        aria-invalid={!isValidUrl(link.url)}
                     />
                     {!isValidUrl(link.url) && (
                         <p className="text-[10px] text-red-600 font-medium" role="alert">Invalid URL format</p>
                     )}
                 </div>
                 <button 
                    onClick={() => removeItem('links', link.id)}
                    className="text-slate-400 hover:text-red-500 p-2 focus:ring-2 focus:ring-red-500 rounded outline-none"
                    aria-label={`Remove link ${link.label}`}
                 >
                   <Trash2 size={16} aria-hidden="true" />
                 </button>
              </div>
            ))}
            <button 
              onClick={() => addItem('links', { label: '', url: '' })}
              className="w-full py-2 flex items-center justify-center gap-2 border-2 border-dashed border-slate-300 rounded-md text-slate-600 hover:border-blue-500 hover:text-blue-700 transition-colors font-medium focus:ring-2 focus:ring-blue-500 outline-none"
              aria-label="Add new link"
            >
              <Plus size={16} aria-hidden="true" /> Add Link
            </button>
          </div>
        )}
      </section>

    </div>
  );
};

export default Editor;