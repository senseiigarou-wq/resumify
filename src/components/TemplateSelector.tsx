import React from 'react';
import { AVAILABLE_TEMPLATES } from '../constants';
import { Layout, Crown, Lock } from 'lucide-react';
import TemplateThumbnail from './TemplateThumbnail';

interface Props {
  currentTemplate: string;
  onChange: (templateId: string) => void;
  isPremium: boolean;          // ✅ from backend (Supabase)
  onUpgrade?: () => void;      // ✅ open upgrade modal / redirect
}

const TemplateSelector: React.FC<Props> = ({
  currentTemplate,
  onChange,
  isPremium,
  onUpgrade,
}) => {
  // Current template first
  const sortedTemplates = [
    ...AVAILABLE_TEMPLATES.filter(t => t.id === currentTemplate),
    ...AVAILABLE_TEMPLATES.filter(t => t.id !== currentTemplate),
  ];

  return (
    <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col gap-3 sticky top-0 z-10 shadow-sm shrink-0">
      <div className="flex items-center gap-2 text-slate-800 font-bold text-lg">
        <Layout className="text-blue-600" />
        <span>Selected Template</span>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 pt-1 scrollbar-hide snap-x">
        {sortedTemplates.slice(0, 10).map((template) => {
          const isLocked = template.isPremium && !isPremium;

          return (
            <button
              key={template.id}
              type="button"
              aria-current={currentTemplate === template.id}
              disabled={isLocked}
              onClick={() => {
                // 🔒 PREMIUM GATE
                if (template.isPremium && !isPremium) {
                  onUpgrade?.();
                  return;
                }
                onChange(template.id);
              }}
              className={`relative flex-shrink-0 w-28 flex flex-col text-left snap-start transition-all
                ${currentTemplate === template.id
                  ? 'scale-105'
                  : 'opacity-80 hover:opacity-100 hover:scale-105'}
                ${isLocked ? 'cursor-not-allowed opacity-60' : ''}`}
            >
              {/* Thumbnail */}
              <div
                className={`w-full aspect-[210/297] rounded-md overflow-hidden border shadow-sm relative mb-2
                  ${currentTemplate === template.id
                    ? 'border-blue-500 ring-2 ring-blue-500 ring-offset-2'
                    : 'border-slate-200 hover:border-blue-300'}`}
              >
                <TemplateThumbnail template={template} />

                {/* 🔒 LOCK OVERLAY */}
                {isLocked && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
                    <Lock size={22} className="text-white" />
                  </div>
                )}

                {/* 👑 PREMIUM BADGE */}
                {template.isPremium && (
                  <div className="absolute top-1 right-1 bg-amber-400 text-white p-0.5 rounded-full z-10">
                    <Crown size={10} fill="currentColor" />
                  </div>
                )}
              </div>

              {/* Label */}
              <div className="px-0.5">
                <span
                  className={`block text-xs font-bold truncate ${
                    currentTemplate === template.id
                      ? 'text-blue-700'
                      : 'text-slate-700'
                  }`}
                >
                  {template.name}
                </span>
                <span className="block text-[10px] text-slate-400 truncate">
                  {template.category}
                </span>
              </div>
            </button>
          );
        })}

        {/* More indicator */}
        <div className="flex flex-col items-center justify-center w-20 flex-shrink-0 text-xs text-slate-400 text-center px-2 border border-dashed border-slate-200 rounded-lg aspect-[210/297]">
          <span className="font-bold text-lg">
            +{AVAILABLE_TEMPLATES.length - 10}
          </span>
          <span>more in<br />Dashboard</span>
        </div>
      </div>
    </div>
  );
};

export default TemplateSelector;
