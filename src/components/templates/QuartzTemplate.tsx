import React from 'react';
import { ResumeData } from '../../types';

interface Props {
  data: ResumeData;
}

const QuartzTemplate: React.FC<Props> = ({ data }) => {
  const { personal, experience, education, skills, links } = data;

  return (
    <div className="w-full h-full min-h-[297mm] bg-white p-10 font-sans text-slate-800">
      {/* Header */}
      <div className="border-b border-slate-300 pb-8 mb-8 flex justify-between items-end">
        <div className="flex items-center gap-6">
          {personal.avatarUrl && (
             <img 
               src={personal.avatarUrl} 
               alt={personal.fullName} 
               className="w-24 h-24 rounded-full object-cover border border-slate-200 shadow-sm"
             />
          )}
          <div>
            <h1 className="text-4xl font-light tracking-tight text-slate-900 mb-2">{personal.fullName}</h1>
            <p className="text-lg text-blue-600 font-medium tracking-wide">{personal.title}</p>
          </div>
        </div>
        <div className="text-right text-xs text-slate-500 space-y-1">
          {personal.email && <p>{personal.email}</p>}
          {personal.phone && <p>{personal.phone}</p>}
          {personal.location && <p>{personal.location}</p>}
          {personal.website && <p className="text-blue-600">{personal.website}</p>}
        </div>
      </div>

      <div className="flex gap-10">
        {/* Left Column (Main) */}
        <div className="w-2/3 space-y-8">
          {personal.summary && (
            <section>
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-3">About Me</h3>
              <p className="text-sm leading-relaxed text-slate-700">{personal.summary}</p>
            </section>
          )}

          {experience.length > 0 && (
            <section>
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">Experience</h3>
              <div className="space-y-6">
                {experience.map(exp => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="font-bold text-slate-800">{exp.position}</h4>
                      <span className="text-xs text-slate-500 italic">
                        {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    <div className="text-sm text-blue-600 font-medium mb-2">{exp.company}</div>
                    <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column (Sidebar) */}
        <div className="w-1/3 space-y-8">
           {skills.length > 0 && (
            <section>
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-3">Skills</h3>
              <div className="space-y-4">
                {skills.map(skill => (
                  <div key={skill.id} className="w-full">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-slate-700">{skill.name}</span>
                        <span className="text-xs text-slate-400 font-mono">{skill.level}/5</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                        <div 
                            className="bg-blue-600 h-1.5 rounded-full transition-all duration-300 ease-out" 
                            style={{ width: `${(skill.level / 5) * 100}%` }}
                        ></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {education.length > 0 && (
            <section>
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-3">Education</h3>
              <div className="space-y-4">
                {education.map(edu => (
                  <div key={edu.id}>
                    <div className="font-bold text-slate-800 text-sm">{edu.institution}</div>
                    <div className="text-sm text-slate-600">{edu.degree}</div>
                    <div className="text-xs text-slate-400 mt-1">
                      {edu.startDate} – {edu.current ? 'Present' : edu.endDate}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {links.length > 0 && (
             <section>
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-3">Connect</h3>
              <div className="space-y-2">
                {links.map(link => (
                    <div key={link.id}>
                        <div className="text-xs text-slate-500 uppercase">{link.label}</div>
                        <a href={`https://${link.url}`} className="text-sm text-blue-600 hover:underline break-all">{link.url}</a>
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

export default QuartzTemplate;