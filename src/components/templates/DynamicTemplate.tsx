import React from 'react';
import { ResumeData, TemplateDesign } from '../../types';
import { Mail, Phone, MapPin, Globe, ExternalLink, Briefcase, GraduationCap, Code, Link as LinkIcon } from 'lucide-react';

interface Props {
  data: ResumeData;
  config: TemplateDesign;
}

const DynamicTemplate: React.FC<Props> = ({ data, config }) => {
  const { personal, experience, education, skills, links } = data;

  // Helper styles based on config
  const fontHeading = config.fontHeading === 'serif' ? 'font-serif' : config.fontHeading === 'mono' ? 'font-mono' : 'font-sans';
  const fontBody = config.fontBody === 'serif' ? 'font-serif' : config.fontBody === 'mono' ? 'font-mono' : 'font-sans';
  
  const densityPadding = config.density === 'compact' ? 'p-1' : config.density === 'spacious' ? 'p-3' : 'p-2';
  const densityGap = config.density === 'compact' ? 'gap-2' : config.density === 'spacious' ? 'gap-6' : 'gap-4';
  const sectionGap = config.density === 'compact' ? 'space-y-4' : config.density === 'spacious' ? 'space-y-8' : 'space-y-6';
  
  const accentColorStyle = { color: config.colorAccent };
  const primaryBgStyle = { backgroundColor: config.colorPrimary };
  const primaryTextStyle = { color: config.colorPrimary };

  // Common Components
  const ContactItem: React.FC<{ icon: any, value: string, link?: string }> = ({ icon: Icon, value, link }) => (
    <div className={`flex items-center gap-2 text-sm ${config.layout.includes('sidebar') && config.layout !== 'sidebar-right' ? 'text-white/80' : 'text-gray-600'}`}>
      {config.showIcons && <Icon size={14} style={{ color: config.layout.includes('sidebar') && config.layout !== 'sidebar-right' ? config.colorAccent : config.colorPrimary }} />}
      {link ? <a href={link} className="hover:underline">{value}</a> : <span>{value}</span>}
    </div>
  );

  const SectionTitle = ({ title, icon: Icon }: { title: string, icon?: any }) => (
    <h3 className={`text-sm font-bold uppercase tracking-wider border-b-2 mb-3 pb-1 ${fontHeading}`} 
        style={{ borderColor: config.colorSecondary, color: config.colorPrimary }}>
      <span className="flex items-center gap-2">
        {config.showIcons && Icon && <Icon size={16} />}
        {title}
      </span>
    </h3>
  );

  // Renderers
  const SidebarContent = () => (
    <div className={`space-y-6 ${config.layout === 'sidebar-left' ? 'text-white' : 'text-gray-800'}`}>
      {config.layout === 'sidebar-left' && (
        <div className="text-center mb-6">
           {personal.avatarUrl && (
             <img src={personal.avatarUrl} alt="Avatar" className="w-24 h-24 rounded-full mx-auto mb-3 border-4 border-white/20 object-cover" />
           )}
        </div>
      )}

      <div>
        <h3 className={`uppercase tracking-widest text-xs font-bold mb-3 pb-1 border-b ${config.layout === 'sidebar-left' ? 'border-white/20 text-white/70' : 'border-gray-200 text-gray-400'}`}>Contact</h3>
        <div className="flex flex-col gap-2">
          {personal.email && <ContactItem icon={Mail} value={personal.email} />}
          {personal.phone && <ContactItem icon={Phone} value={personal.phone} />}
          {personal.location && <ContactItem icon={MapPin} value={personal.location} />}
          {personal.website && <ContactItem icon={Globe} value={personal.website} />}
          {links.map(l => <ContactItem key={l.id} icon={ExternalLink} value={l.label} link={l.url} />)}
        </div>
      </div>

      {skills.length > 0 && (
        <div>
           <h3 className={`uppercase tracking-widest text-xs font-bold mb-3 pb-1 border-b ${config.layout === 'sidebar-left' ? 'border-white/20 text-white/70' : 'border-gray-200 text-gray-400'}`}>Skills</h3>
           <div className="flex flex-wrap gap-2">
             {skills.map(skill => (
               <div key={skill.id} className="w-full">
                 <div className="flex justify-between text-xs mb-1">
                   <span>{skill.name}</span>
                 </div>
                 <div className={`h-1 rounded-full ${config.layout === 'sidebar-left' ? 'bg-white/20' : 'bg-gray-200'}`}>
                   <div className="h-full rounded-full" style={{ width: `${(skill.level/5)*100}%`, backgroundColor: config.colorAccent }}></div>
                 </div>
               </div>
             ))}
           </div>
        </div>
      )}

      {education.length > 0 && (
        <div>
           <h3 className={`uppercase tracking-widest text-xs font-bold mb-3 pb-1 border-b ${config.layout === 'sidebar-left' ? 'border-white/20 text-white/70' : 'border-gray-200 text-gray-400'}`}>Education</h3>
           <div className="space-y-3">
             {education.map(edu => (
               <div key={edu.id} className="text-sm">
                 <div className="font-bold">{edu.institution}</div>
                 <div className={config.layout === 'sidebar-left' ? 'text-white/80' : 'text-gray-600'}>{edu.degree}</div>
                 <div className={`text-xs mt-1 ${config.layout === 'sidebar-left' ? 'text-white/60' : 'text-gray-500'}`}>{edu.startDate} - {edu.endDate}</div>
               </div>
             ))}
           </div>
        </div>
      )}
    </div>
  );

  const MainContent = () => (
    <div className={sectionGap}>
      {personal.summary && (
        <section>
          <SectionTitle title="Profile" icon={Briefcase} />
          <p className="text-sm leading-relaxed text-gray-700">{personal.summary}</p>
        </section>
      )}

      {experience.length > 0 && (
        <section>
          <SectionTitle title="Experience" icon={Briefcase} />
          <div className="space-y-4">
            {experience.map(exp => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="font-bold text-gray-900">{exp.position}</h4>
                  <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <div className="text-sm font-medium mb-2" style={{ color: config.colorPrimary }}>{exp.company}</div>
                <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* If single column, show skills/edu here */}
      {config.layout === 'single-column' && (
        <div className="grid grid-cols-2 gap-8">
           {skills.length > 0 && (
             <section>
                <SectionTitle title="Skills" icon={Code} />
                <div className="flex flex-wrap gap-2">
                    {skills.map(s => (
                        <span key={s.id} className="px-2 py-1 bg-gray-100 text-xs text-gray-700 rounded border border-gray-200">{s.name}</span>
                    ))}
                </div>
             </section>
           )}
           {education.length > 0 && (
              <section>
                  <SectionTitle title="Education" icon={GraduationCap} />
                  {education.map(edu => (
                      <div key={edu.id} className="mb-2">
                          <div className="font-bold text-sm">{edu.institution}</div>
                          <div className="text-xs text-gray-600">{edu.degree}</div>
                      </div>
                  ))}
              </section>
           )}
        </div>
      )}
    </div>
  );

  // Layout Structures
  return (
    <div className={`w-full h-full min-h-[297mm] bg-white text-gray-800 ${fontBody} flex flex-col`}>
      
      {/* Header Area */}
      {config.headerStyle === 'banner' ? (
         <div className="py-8 px-8 text-white" style={{ backgroundColor: config.colorPrimary }}>
            <div className="flex items-center gap-6">
                {personal.avatarUrl && <img src={personal.avatarUrl} className="w-24 h-24 rounded-full border-4 border-white/30 object-cover" />}
                <div>
                    <h1 className={`text-4xl font-bold mb-1 ${fontHeading}`}>{personal.fullName}</h1>
                    <p className="text-lg opacity-90 tracking-wide">{personal.title}</p>
                </div>
            </div>
         </div>
      ) : (
        <div className={`p-8 pb-4 border-b border-gray-100 ${config.headerStyle === 'centered' ? 'text-center' : ''}`}>
             {config.headerStyle === 'centered' && personal.avatarUrl && (
                 <img src={personal.avatarUrl} className="w-24 h-24 rounded-full mx-auto mb-4 border border-gray-200 object-cover" />
             )}
            <h1 className={`text-4xl font-bold mb-2 ${fontHeading}`} style={primaryTextStyle}>{personal.fullName}</h1>
            <p className="text-lg text-gray-500 font-medium mb-4">{personal.title}</p>
            
            {/* Top Contact Bar for non-sidebar layouts */}
            {config.layout === 'single-column' && (
                <div className={`flex flex-wrap gap-4 text-sm text-gray-600 ${config.headerStyle === 'centered' ? 'justify-center' : ''}`}>
                    {personal.email && <span>{personal.email}</span>}
                    {personal.phone && <span>• {personal.phone}</span>}
                    {personal.location && <span>• {personal.location}</span>}
                </div>
            )}
        </div>
      )}

      {/* Body Content */}
      <div className={`flex-1 flex ${config.layout === 'sidebar-right' ? 'flex-row-reverse' : 'flex-row'}`}>
         
         {/* Sidebar Layouts */}
         {(config.layout === 'sidebar-left' || config.layout === 'sidebar-right') && (
            <>
                <div className={`w-1/3 p-8 flex-shrink-0 ${config.layout === 'sidebar-left' ? '' : 'bg-gray-50 border-l border-gray-200'}`}
                     style={config.layout === 'sidebar-left' ? { backgroundColor: config.colorPrimary } : {}}>
                    <SidebarContent />
                </div>
                <div className="w-2/3 p-8">
                    <MainContent />
                </div>
            </>
         )}

         {/* Single Column Layout */}
         {config.layout === 'single-column' && (
             <div className="w-full p-8 max-w-3xl mx-auto">
                 <MainContent />
             </div>
         )}
      </div>
    </div>
  );
};

export default DynamicTemplate;