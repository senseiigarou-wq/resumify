
import React from 'react';
import { ResumeData } from '../../types';
import { Mail, Phone, MapPin, Globe, ExternalLink, Briefcase, GraduationCap, PenTool } from 'lucide-react';

interface Props {
  data: ResumeData;
  layout?: 'sidebar' | 'single';
}

const HorizonTemplate: React.FC<Props> = ({ data, layout = 'sidebar' }) => {
  const { personal, experience, education, skills, links } = data;

  // Shared Styles
  const primaryColor = 'text-emerald-800';
  const accentBg = 'bg-emerald-900';
  const accentText = 'text-emerald-600';

  if (layout === 'sidebar') {
    return (
      <div className="flex w-full h-full min-h-[297mm] bg-white text-sm font-sans">
        {/* Sidebar Left */}
        <div className={`w-[35%] ${accentBg} text-white p-8 flex flex-col gap-8`}>
          <div className="text-center">
             {personal.avatarUrl && (
                <img src={personal.avatarUrl} alt="Profile" className="w-32 h-32 rounded-full object-cover border-4 border-emerald-700/50 mx-auto mb-4" />
             )}
             <h3 className="uppercase tracking-widest text-xs font-bold text-emerald-200 border-b border-emerald-800 pb-2 mb-2">Contact</h3>
             <div className="flex flex-col gap-3 text-emerald-100 text-xs text-left">
                {personal.email && <div className="flex items-center gap-2"><Mail size={14} /> <span className="break-all">{personal.email}</span></div>}
                {personal.phone && <div className="flex items-center gap-2"><Phone size={14} /> <span>{personal.phone}</span></div>}
                {personal.location && <div className="flex items-center gap-2"><MapPin size={14} /> <span>{personal.location}</span></div>}
                {personal.website && <div className="flex items-center gap-2"><Globe size={14} /> <span className="break-all">{personal.website}</span></div>}
             </div>
          </div>

          {skills.length > 0 && (
            <div>
              <h3 className="uppercase tracking-widest text-xs font-bold text-emerald-200 border-b border-emerald-800 pb-2 mb-4">Skills</h3>
              <div className="flex flex-col gap-3">
                {skills.map(skill => (
                  <div key={skill.id}>
                     <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-emerald-50">{skill.name}</span>
                     </div>
                     <div className="w-full bg-emerald-800 h-1 rounded-full">
                        <div className="bg-emerald-400 h-1 rounded-full" style={{ width: `${(skill.level / 5) * 100}%` }}></div>
                     </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {education.length > 0 && (
            <div>
              <h3 className="uppercase tracking-widest text-xs font-bold text-emerald-200 border-b border-emerald-800 pb-2 mb-4">Education</h3>
              <div className="space-y-4">
                {education.map(edu => (
                  <div key={edu.id}>
                    <div className="font-bold text-white text-sm">{edu.institution}</div>
                    <div className="text-emerald-300 text-xs italic">{edu.degree}</div>
                    <div className="text-emerald-400/80 text-[10px] mt-0.5">{edu.startDate} - {edu.endDate}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {links.length > 0 && (
             <div>
                <h3 className="uppercase tracking-widest text-xs font-bold text-emerald-200 border-b border-emerald-800 pb-2 mb-4">Links</h3>
                <div className="space-y-2 text-xs">
                    {links.map(link => (
                        <div key={link.id} className="flex items-center gap-2 text-emerald-100">
                             <ExternalLink size={12} />
                             <a href={link.url} className="hover:text-white underline decoration-emerald-500/50">{link.label}</a>
                        </div>
                    ))}
                </div>
             </div>
          )}
        </div>

        {/* Main Content Right */}
        <div className="w-[65%] p-10 bg-white text-slate-800">
           <div className="mb-10 border-l-4 border-emerald-900 pl-6 py-2">
              <h1 className="text-4xl font-serif font-bold text-slate-900 leading-none mb-2">{personal.fullName}</h1>
              <p className="text-lg text-emerald-700 font-medium tracking-wide uppercase">{personal.title}</p>
           </div>

           <div className="space-y-8">
              {personal.summary && (
                 <section>
                    <h2 className={`text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2 ${primaryColor}`}>
                        <span className="p-1.5 bg-emerald-100 rounded-md"><Briefcase size={16} /></span>
                        Profile
                    </h2>
                    <p className="text-slate-600 leading-relaxed text-sm text-justify">
                       {personal.summary}
                    </p>
                 </section>
              )}

              {experience.length > 0 && (
                 <section>
                    <h2 className={`text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2 ${primaryColor}`}>
                        <span className="p-1.5 bg-emerald-100 rounded-md"><PenTool size={16} /></span>
                        Experience
                    </h2>
                    <div className="border-l-2 border-emerald-100 ml-3 pl-6 space-y-8">
                       {experience.map(exp => (
                          <div key={exp.id} className="relative">
                             <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full border-2 border-emerald-500 bg-white"></div>
                             <div className="mb-1">
                                <h3 className="font-bold text-lg text-slate-800">{exp.position}</h3>
                                <div className="flex justify-between items-center text-sm">
                                   <span className="font-semibold text-emerald-700">{exp.company}</span>
                                   <span className="text-slate-400 text-xs bg-slate-50 px-2 py-1 rounded">
                                      {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                                   </span>
                                </div>
                             </div>
                             <p className="text-slate-600 text-sm mt-2 whitespace-pre-wrap">
                                {exp.description}
                             </p>
                          </div>
                       ))}
                    </div>
                 </section>
              )}
           </div>
        </div>
      </div>
    );
  }

  // Single Column Layout
  return (
    <div className="w-full h-full min-h-[297mm] bg-white font-sans text-slate-800">
       {/* Header Banner */}
       <div className={`${accentBg} text-white p-10 pb-12`}>
          <div className="flex justify-between items-center max-w-3xl mx-auto">
             <div>
                <h1 className="text-5xl font-serif font-bold mb-2">{personal.fullName}</h1>
                <p className="text-xl text-emerald-200 tracking-wide">{personal.title}</p>
             </div>
             {personal.avatarUrl && (
                <img src={personal.avatarUrl} alt="Profile" className="w-28 h-28 rounded-xl object-cover border-2 border-emerald-400 shadow-lg rotate-3" />
             )}
          </div>
       </div>

       {/* Floating Contact Bar */}
       <div className="max-w-3xl mx-auto -mt-6 px-6 relative z-10">
          <div className="bg-white shadow-md rounded-lg p-4 flex flex-wrap justify-between items-center border border-slate-100 gap-4">
              {personal.email && <div className="flex items-center gap-2 text-sm text-slate-600"><Mail size={14} className="text-emerald-600" /> {personal.email}</div>}
              {personal.phone && <div className="flex items-center gap-2 text-sm text-slate-600"><Phone size={14} className="text-emerald-600" /> {personal.phone}</div>}
              {personal.location && <div className="flex items-center gap-2 text-sm text-slate-600"><MapPin size={14} className="text-emerald-600" /> {personal.location}</div>}
              {personal.website && <div className="flex items-center gap-2 text-sm text-slate-600"><Globe size={14} className="text-emerald-600" /> {personal.website}</div>}
          </div>
       </div>

       <div className="max-w-3xl mx-auto p-10 space-y-10">
           {personal.summary && (
              <section>
                 <h2 className="text-lg font-serif font-bold text-slate-900 border-b-2 border-emerald-100 pb-2 mb-4">Professional Profile</h2>
                 <p className="text-slate-600 leading-relaxed">
                    {personal.summary}
                 </p>
              </section>
           )}

           {experience.length > 0 && (
              <section>
                 <h2 className="text-lg font-serif font-bold text-slate-900 border-b-2 border-emerald-100 pb-2 mb-6">Work Experience</h2>
                 <div className="space-y-8">
                    {experience.map(exp => (
                       <div key={exp.id} className="grid grid-cols-[120px_1fr] gap-6">
                          <div className="text-right">
                             <span className="block text-sm font-bold text-emerald-700">{exp.startDate}</span>
                             <span className="block text-xs text-slate-400">{exp.current ? 'Present' : exp.endDate}</span>
                          </div>
                          <div>
                             <h3 className="font-bold text-lg text-slate-900 mb-1">{exp.position}</h3>
                             <div className="text-sm font-medium text-slate-500 mb-2 italic">{exp.company}</div>
                             <p className="text-slate-600 text-sm whitespace-pre-wrap">
                                {exp.description}
                             </p>
                          </div>
                       </div>
                    ))}
                 </div>
              </section>
           )}

           <div className="grid grid-cols-2 gap-10">
               {skills.length > 0 && (
                  <section>
                     <h2 className="text-lg font-serif font-bold text-slate-900 border-b-2 border-emerald-100 pb-2 mb-4">Skills</h2>
                     <div className="flex flex-wrap gap-2">
                        {skills.map(skill => (
                           <span key={skill.id} className="px-3 py-1 bg-emerald-50 text-emerald-800 text-sm rounded border border-emerald-100 font-medium">
                              {skill.name}
                           </span>
                        ))}
                     </div>
                  </section>
               )}
               
               {education.length > 0 && (
                  <section>
                     <h2 className="text-lg font-serif font-bold text-slate-900 border-b-2 border-emerald-100 pb-2 mb-4">Education</h2>
                     <div className="space-y-4">
                        {education.map(edu => (
                           <div key={edu.id}>
                              <div className="font-bold text-slate-900">{edu.institution}</div>
                              <div className="text-emerald-700 text-sm">{edu.degree}</div>
                              <div className="text-slate-400 text-xs mt-1">{edu.startDate} - {edu.endDate}</div>
                           </div>
                        ))}
                     </div>
                  </section>
               )}
           </div>
       </div>
    </div>
  );
};

export default HorizonTemplate;
