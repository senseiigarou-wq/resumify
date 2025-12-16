import React from 'react';
import { ResumeData } from '../../types';

interface Props {
  data: ResumeData;
}

const CanvasTemplate: React.FC<Props> = ({ data }) => {
  const { personal, experience, education, skills, links } = data;

  return (
    <div className="w-full h-full min-h-[297mm] bg-white p-12 text-gray-900 font-serif">
      {/* Header */}
      <header className="text-center border-b-2 border-gray-900 pb-6 mb-8">
        {personal.avatarUrl && (
             <img 
               src={personal.avatarUrl} 
               alt={personal.fullName} 
               className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-2 border-gray-200"
             />
        )}
        <h1 className="text-4xl font-display font-bold mb-2 tracking-wide">{personal.fullName}</h1>
        <p className="text-lg italic text-gray-600 mb-4">{personal.title}</p>
        
        <div className="flex flex-wrap justify-center gap-4 text-sm font-sans text-gray-500">
           {personal.email && <span>{personal.email}</span>}
           {personal.phone && <span>• {personal.phone}</span>}
           {personal.location && <span>• {personal.location}</span>}
           {personal.website && <span>• {personal.website}</span>}
        </div>
      </header>

      {/* Summary */}
      {personal.summary && (
        <section className="mb-8">
            <h2 className="text-lg font-bold uppercase tracking-wider border-b border-gray-300 mb-3 font-sans text-gray-800">Professional Summary</h2>
            <p className="leading-relaxed text-gray-700">{personal.summary}</p>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mb-8">
            <h2 className="text-lg font-bold uppercase tracking-wider border-b border-gray-300 mb-4 font-sans text-gray-800">Experience</h2>
            <div className="space-y-6">
                {experience.map(exp => (
                    <div key={exp.id}>
                        <div className="flex justify-between items-baseline mb-1 font-sans">
                            <h3 className="font-bold text-gray-900 text-base">{exp.company}</h3>
                            <span className="text-sm text-gray-500">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                        </div>
                        <div className="italic text-gray-700 mb-2">{exp.position}</div>
                        <p className="text-sm leading-relaxed text-gray-600 whitespace-pre-wrap font-sans">
                            {exp.description}
                        </p>
                    </div>
                ))}
            </div>
        </section>
      )}

      <div className="grid grid-cols-2 gap-8">
          {/* Education */}
          {education.length > 0 && (
            <section>
                <h2 className="text-lg font-bold uppercase tracking-wider border-b border-gray-300 mb-4 font-sans text-gray-800">Education</h2>
                <div className="space-y-4">
                    {education.map(edu => (
                        <div key={edu.id}>
                            <h3 className="font-bold text-gray-900">{edu.institution}</h3>
                            <div className="text-gray-700 italic">{edu.degree}</div>
                            <div className="text-sm text-gray-500 font-sans mt-1">{edu.startDate} – {edu.current ? 'Present' : edu.endDate}</div>
                        </div>
                    ))}
                </div>
            </section>
          )}

          {/* Skills & Links */}
          <div className="space-y-8">
              {skills.length > 0 && (
                <section>
                    <h2 className="text-lg font-bold uppercase tracking-wider border-b border-gray-300 mb-4 font-sans text-gray-800">Skills</h2>
                    <div className="flex flex-wrap gap-x-4 gap-y-2 font-sans text-sm text-gray-700">
                        {skills.map(skill => (
                            <span key={skill.id} className="bg-gray-100 px-2 py-1 rounded">
                                {skill.name}
                            </span>
                        ))}
                    </div>
                </section>
              )}

              {links.length > 0 && (
                 <section>
                    <h2 className="text-lg font-bold uppercase tracking-wider border-b border-gray-300 mb-4 font-sans text-gray-800">Links</h2>
                    <ul className="list-disc list-inside font-sans text-sm text-gray-700">
                        {links.map(link => (
                            <li key={link.id}>
                                <span className="font-medium">{link.label}:</span> <a href={`https://${link.url}`} className="text-blue-700 hover:underline">{link.url}</a>
                            </li>
                        ))}
                    </ul>
                </section>
              )}
          </div>
      </div>
    </div>
  );
};

export default CanvasTemplate;