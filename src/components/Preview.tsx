
import React, { useState, useEffect } from 'react';
import { ResumeData, TemplateType, User } from '../types';
import OnyxTemplate from './templates/OnyxTemplate';
import QuartzTemplate from './templates/QuartzTemplate';
import CanvasTemplate from './templates/CanvasTemplate';
import DynamicTemplate from './templates/DynamicTemplate';
import HorizonTemplate from './templates/HorizonTemplate';
import TemplateThumbnail from './TemplateThumbnail';
import { AVAILABLE_TEMPLATES } from '../constants';
import { generatePDF } from '../services/pdfService';
import { Download, Monitor, Smartphone, Tablet, X, Check, ChevronDown, Lock, Crown, ArrowRight, Star, Layout } from 'lucide-react';

interface Props {
  data: ResumeData;
  template: string;
  user: User | null;
  onLoginRequest: () => void;
  onUpgradeRequest: () => void;
}

const Preview: React.FC<Props> = ({ data, template, user, onLoginRequest, onUpgradeRequest }) => {
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isExporting, setIsExporting] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportTemplateId, setExportTemplateId] = useState(template);

  const isGuest = !user;
  const isPremiumUser = user?.isPremium;

  // Sync export template with prop change initially, but allow override
  useEffect(() => {
    setExportTemplateId(template);
  }, [template]);

  const selectedTemplateConfig = AVAILABLE_TEMPLATES.find(t => t.id === template);
  const selectedExportTemplateConfig = AVAILABLE_TEMPLATES.find(t => t.id === exportTemplateId);
  
  // Logic: Block if template is premium AND user is NOT premium
  const isExportBlocked = selectedExportTemplateConfig?.isPremium && !isPremiumUser;
  
  // Helper to render any template by ID
  const renderTemplateContent = (templateId: string) => {
    const config = AVAILABLE_TEMPLATES.find(t => t.id === templateId);
    
    // Legacy support
    if (templateId === TemplateType.ONYX) return <OnyxTemplate data={data} />;
    if (templateId === TemplateType.QUARTZ) return <QuartzTemplate data={data} />;
    if (templateId === TemplateType.CANVAS) return <CanvasTemplate data={data} />;
    
    // New Horizon support
    if (templateId === TemplateType.HORIZON) return <HorizonTemplate data={data} layout="sidebar" />;
    if (templateId === 'HORIZON_MINIMAL') return <HorizonTemplate data={data} layout="single" />;
    
    // Dynamic system
    if (config && config.isDynamic && config.config) {
        return <DynamicTemplate data={data} config={config.config} />;
    }

    // Fallback
    return <OnyxTemplate data={data} />;
  };

  const handleDownload = async () => {
    if (isExportBlocked) {
        if (isGuest) {
            onLoginRequest();
        } else {
            onUpgradeRequest();
        }
        setShowExportModal(false);
        return;
    }

    setIsExporting(true);
    // Give React a moment to render the hidden export container with the selected template
    await new Promise(resolve => setTimeout(resolve, 100));
    
    await generatePDF(
      'resume-export-content', 
      `${data.personal.fullName.replace(/\s+/g, '_')}_${exportTemplateId}_Resume`
    );
    
    setIsExporting(false);
    setShowExportModal(false);
  };

  const getContainerWidth = () => {
    switch (viewMode) {
      case 'mobile': return '375px';
      case 'tablet': return '768px';
      default: return '210mm'; // A4 width
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-100 relative">
        {/* Toolbar */}
        <div 
            className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 z-20"
            role="toolbar"
            aria-label="Preview Toolbar"
        >
            <div className="flex items-center gap-4">
                <span className="text-slate-500 text-sm font-medium hidden md:inline">
                    Preview: <span className="text-slate-900 font-bold">{selectedTemplateConfig?.name || 'Resume'}</span>
                </span>
                
                {/* View Mode Toggles */}
                <div className="flex bg-slate-100 rounded-lg p-1 border border-slate-200" role="group" aria-label="View Mode">
                    <button 
                        onClick={() => setViewMode('desktop')}
                        className={`p-2 rounded-md transition-all focus:ring-2 focus:ring-blue-500 outline-none ${viewMode === 'desktop' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        title="Desktop / Print View"
                        aria-label="Desktop view"
                        aria-pressed={viewMode === 'desktop'}
                    >
                        <Monitor size={16} aria-hidden="true" />
                    </button>
                    <button 
                        onClick={() => setViewMode('tablet')}
                        className={`p-2 rounded-md transition-all focus:ring-2 focus:ring-blue-500 outline-none ${viewMode === 'tablet' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        title="Tablet View"
                        aria-label="Tablet view"
                        aria-pressed={viewMode === 'tablet'}
                    >
                        <Tablet size={16} aria-hidden="true" />
                    </button>
                    <button 
                        onClick={() => setViewMode('mobile')}
                        className={`p-2 rounded-md transition-all focus:ring-2 focus:ring-blue-500 outline-none ${viewMode === 'mobile' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        title="Mobile View"
                        aria-label="Mobile view"
                        aria-pressed={viewMode === 'mobile'}
                    >
                        <Smartphone size={16} aria-hidden="true" />
                    </button>
                </div>
            </div>

            <div className="flex gap-2">
                 <button 
                  onClick={() => setShowExportModal(true)}
                  className="flex items-center gap-2 bg-slate-900 hover:bg-black text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 outline-none"
                  aria-haspopup="dialog"
                 >
                    <Download size={16} aria-hidden="true" />
                    Export PDF
                 </button>
            </div>
        </div>

        {/* Preview Area */}
        <div 
            className="flex-1 overflow-auto p-8 flex justify-center custom-scrollbar bg-slate-100/50"
            tabIndex={0}
            aria-label="Resume Preview Area"
        >
            <div 
                className="bg-white shadow-2xl transition-all duration-300 ease-out origin-top relative"
                style={{ 
                    width: getContainerWidth(), 
                    minHeight: viewMode === 'desktop' ? '297mm' : 'auto',
                    height: viewMode === 'desktop' ? 'auto' : '100%',
                    transform: viewMode === 'mobile' || viewMode === 'tablet' ? 'scale(1)' : 'scale(1)' // Can add zoom here if needed
                }}
                aria-hidden="true" // The content is for preview, screen reader users should rely on the editor for content
            >
                {/* 
                  Wrapper to handle internal responsiveness of templates. 
                  Templates are built with w-full, so strictly constraining width simulates devices.
                */}
                <div className="w-full h-full overflow-hidden relative">
                    {renderTemplateContent(template)}

                    {/* Watermark for Free Users (Preview) */}
                    {!isPremiumUser && (
                        <div className="absolute bottom-4 right-4 z-20 pointer-events-none select-none opacity-80">
                             <div className="flex items-center gap-1.5 text-slate-400 text-[9px] uppercase tracking-wider font-sans font-semibold bg-white/90 backdrop-blur-sm px-2 py-1 rounded border border-slate-200 shadow-sm">
                                <span>Powered by</span>
                                <span className="text-blue-600 font-bold">Resumify</span>
                             </div>
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* Export Modal */}
        {showExportModal && (
            <div 
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"
                role="dialog"
                aria-modal="true"
                aria-labelledby="export-modal-title"
            >
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                        <h3 id="export-modal-title" className="font-bold text-lg text-slate-800">Export Options</h3>
                        <button 
                            onClick={() => setShowExportModal(false)} 
                            className="text-slate-400 hover:text-slate-600 focus:ring-2 focus:ring-slate-500 rounded p-1 outline-none"
                            aria-label="Close modal"
                        >
                            <X size={20} aria-hidden="true" />
                        </button>
                    </div>
                    
                    <div className="p-6 space-y-4">
                        <div>
                            <label htmlFor="export-template-select" className="block text-sm font-medium text-slate-700 mb-2">Select Template Style</label>
                            <div className="relative">
                                <select 
                                    id="export-template-select"
                                    value={exportTemplateId}
                                    onChange={(e) => setExportTemplateId(e.target.value)}
                                    className="w-full p-3 pl-4 pr-10 border border-slate-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                >
                                    {/* Group templates by category */}
                                    <optgroup label="Free Templates">
                                        {AVAILABLE_TEMPLATES.filter(t => !t.isPremium).map(t => (
                                            <option key={t.id} value={t.id}>{t.name}</option>
                                        ))}
                                    </optgroup>
                                    <optgroup label="Premium Templates">
                                        {AVAILABLE_TEMPLATES.filter(t => t.isPremium).map(t => (
                                            <option key={t.id} value={t.id}>
                                                 {t.name} (Premium)
                                            </option>
                                        ))}
                                    </optgroup>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} aria-hidden="true" />
                            </div>
                        </div>

                        {/* Visual Preview of Selected Export Template */}
                        <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50 p-4 flex flex-col items-center">
                             <span className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">Export Preview</span>
                             <div className="w-32 shadow-lg bg-white relative">
                                {selectedExportTemplateConfig && (
                                    <div className="aspect-[210/297] w-full relative">
                                         <TemplateThumbnail template={selectedExportTemplateConfig} />
                                         {!isPremiumUser && (
                                             <div className="absolute bottom-1 right-1 bg-white/90 px-1 rounded text-[6px] text-slate-500 font-bold border border-slate-200">
                                                 Resumify
                                             </div>
                                         )}
                                    </div>
                                )}
                             </div>
                             <p className="text-xs text-slate-400 mt-3 text-center">
                                 Your resume will be generated using the <strong>{selectedExportTemplateConfig?.name}</strong> layout.
                             </p>
                             {!isPremiumUser && (
                                 <p className="text-[10px] text-amber-600 mt-1 font-medium bg-amber-50 px-2 py-1 rounded">
                                     Free version includes "Created with Resumify" watermark.
                                 </p>
                             )}
                        </div>
                        
                        {/* Premium Restriction Notice */}
                        {isExportBlocked && (
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800 text-sm">
                                <div className="flex items-center gap-2 font-bold mb-1">
                                    <Crown size={16} />
                                    <span>Premium Feature</span>
                                </div>
                                <p className="mb-3">
                                    {selectedExportTemplateConfig?.name} is a premium template.
                                    {isGuest 
                                      ? ' Please log in and upgrade to use this design.' 
                                      : ' Upgrade your account to unlock this design.'
                                    }
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="p-4 bg-slate-50 flex gap-3 justify-end">
                        <button 
                            onClick={() => setShowExportModal(false)}
                            className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium text-sm focus:ring-2 focus:ring-slate-500 rounded outline-none"
                        >
                            Cancel
                        </button>
                        
                        {/* Logic Button Switching */}
                        {isExportBlocked ? (
                            <button
                                onClick={handleDownload} // This will trigger the upgrade logic above
                                className="flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium transition-all shadow-sm bg-amber-400 hover:bg-amber-500 text-white focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 outline-none"
                            >
                                <Crown size={16} />
                                {isGuest ? 'Log In & Upgrade' : 'Upgrade to Export'}
                            </button>
                        ) : (
                            <button 
                                onClick={handleDownload}
                                disabled={isExporting}
                                className="flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium transition-all shadow-sm bg-blue-600 hover:bg-blue-700 text-white focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 outline-none disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isExporting ? 'Generating...' : 'Download PDF'}
                                {!isExporting && <Check size={16} aria-hidden="true" />}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        )}

        {/* Hidden Container for PDF Export - Always A4 sized */}
        <div className="fixed top-0 -left-[9999px] pointer-events-none" aria-hidden="true">
            <div 
                id="resume-export-content" 
                className="w-[210mm] min-h-[297mm] bg-white relative"
            >
                {renderTemplateContent(exportTemplateId)}

                {/* Watermark for Export - Only for Free Users */}
                {!isPremiumUser && (
                     <div className="absolute bottom-0 w-full flex justify-end p-8 z-50">
                        <div className="flex items-center gap-2 text-slate-300 text-[10px] font-sans">
                            <span className="font-medium opacity-70 uppercase tracking-widest">Created with</span>
                            <div className="flex items-center gap-1 font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-sm border border-slate-100">
                                <Layout size={12} className="stroke-current" />
                                <span>Resumify</span>
                            </div>
                        </div>
                     </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default Preview;
