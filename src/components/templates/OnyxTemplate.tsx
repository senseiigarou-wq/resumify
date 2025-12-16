import React from 'react';
import { ResumeData } from '../../types';
import { Mail, Phone, MapPin, Globe, ExternalLink } from 'lucide-react';

interface Props {
  data: ResumeData;
}

const OnyxTemplate: React.FC<Props> = ({ data }) => {
  const { personal, experience, education, skills, links } = data;

  return (
    <div className="flex w-full h-full min-h-[297mm] bg-white text-sm font-sans">
      {/* Sidebar */}
      <div className="w-1/3 bg-slate-900 text-white p-8 flex flex-col gap-8">
        <div className="space-y-4">
          {personal.avatarUrl && (
             <img src={personal.avatarUrl} alt="Profile" className="w-32 h-32 rounded-full object-cover border-4 border-slate-700 mx-auto" />
          )}
          <h1 className="text-3xl font-bold uppercase tracking-widest text-center leading-tight">
            {personal.fullName}
          </h1>
          <p className="text-slate-400 text-center uppercase tracking-wide text-xs font-semibold">
            {personal.title}
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-slate-500 uppercase tracking-widest text-xs font-bold border-b border-slate-700 pb-2">Contact</h3>
          <div className="flex flex-col gap-3 text-slate-300 text-xs">
            {personal.email && <div className="flex items-center gap-2"><Mail size={14} /> <span>{personal.email}</span></div>}
            {personal.phone && <div className="flex items-center gap-2"><Phone size={14} /> <span>{personal.phone}</span></div>}
            {personal.location && <div className="flex items-center gap-2"><MapPin size={14} /> <span>{personal.location}</span></div>}
            {personal.website && <div className="flex items-center gap-2"><Globe size={14} /> <span>{personal.website}</span></div>}
            {links.map(link => (
              <div key={link.id} className="flex items-center gap-2"><ExternalLink size={14} /> <a href={link.url} className="hover:text-white transition-colors">{link.label}</a></div>
            ))}
          </div>
        </div>

        {skills.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-slate-500 uppercase tracking-widest text-xs font-bold border-b border-slate-700 pb-2">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {skills.map(skill => (
                <span key={skill.id} className="bg-slate-800 text-slate-200 px-2 py-1 rounded text-xs">
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {education.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-slate-500 uppercase tracking-widest text-xs font-bold border-b border-slate-700 pb-2">Education</h3>
            <div className="space-y-3">
              {education.map(edu => (
                <div key={edu.id}>
                  <div className="text-white font-medium">{edu.institution}</div>
                  <div className="text-slate-400 text-xs">{edu.degree}</div>
                  <div className="text-slate-500 text-[10px]">{edu.startDate} - {edu.current ? 'Present' : edu.endDate}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="w-2/3 p-8 bg-white text-slate-800">
        <div className="space-y-8">
          {personal.summary && (
            <div className="space-y-3">
              <h2 className="text-xl font-bold uppercase tracking-wider text-slate-900 border-b-2 border-slate-900 pb-1">Profile</h2>
              <p className="text-slate-600 leading-relaxed text-sm">
                {personal.summary}
              </p>
            </div>
          )}

          {experience.length > 0 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold uppercase tracking-wider text-slate-900 border-b-2 border-slate-900 pb-1">Work Experience</h2>
              <div className="space-y-6">
                {experience.map(exp => (
                  <div key={exp.id} className="relative pl-4 border-l-2 border-slate-200">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-bold text-lg text-slate-800">{exp.position}</h3>
                      <span className="text-xs text-slate-500 font-medium whitespace-nowrap bg-slate-100 px-2 py-0.5 rounded">
                        {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    <div className="text-slate-600 font-medium mb-2 text-sm">{exp.company}</div>
                    <p className="text-slate-600 text-sm whitespace-pre-wrap leading-relaxed">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnyxTemplate;