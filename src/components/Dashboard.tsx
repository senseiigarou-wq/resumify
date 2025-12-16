
import React, { useState } from 'react';
import { AVAILABLE_TEMPLATES } from '../constants';
import { User } from '../types';
import { Search, Layout, ChevronRight, LogOut, User as UserIcon, FileEdit, Crown, Lock, Star } from 'lucide-react';
import TemplateThumbnail from './TemplateThumbnail';

interface Props {
  onSelectTemplate: (templateId: string) => void;
  onLogout: () => void;
  onContinue: () => void;
  onLoginRequest: () => void;
  onUpgradeRequest: () => void; // Added
  user: User | null;
  hasSavedResume: boolean;
}

const Dashboard: React.FC<Props> = ({ onSelectTemplate, onLogout, onContinue, onLoginRequest, onUpgradeRequest, user, hasSavedResume }) => {
  const [filter, setFilter] = useState<'All' | 'ATS' | 'Professional' | 'Creative' | 'Modern'>('All');
  const [search, setSearch] = useState('');

  const isGuest = !user;
  const isPremiumUser = user?.isPremium;

  const filteredTemplates = AVAILABLE_TEMPLATES.filter(t => {
    const matchesCategory = filter === 'All' || t.category === filter;
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleTemplateClick = (template: typeof AVAILABLE_TEMPLATES[0]) => {
      // Logic for Premium Templates
      if (template.isPremium && !isPremiumUser) {
          if (isGuest) {
            const confirmLogin = window.confirm("This is a Premium template. Please log in to upgrade and access.");
            if (confirmLogin) {
                onLoginRequest();
            }
          } else {
             // User is logged in but not premium -> Show upgrade modal
             onUpgradeRequest();
          }
          return;
      }
      onSelectTemplate(template.id);
  };

  return (
    <div className="h-full bg-slate-50 flex flex-col overflow-y-auto custom-scrollbar">
      {/* Navbar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20 shrink-0">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-600">
             <Layout className="fill-blue-600" size={28} aria-hidden="true" />
             <span className="text-xl font-bold tracking-tight text-slate-900">Resumify</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-500 hidden md:block" role="status">
               {AVAILABLE_TEMPLATES.length}+ Templates Available
            </span>
            
            {/* Upgrade Button */}
            {user && !isPremiumUser && (
                <button 
                    onClick={onUpgradeRequest}
                    className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-sm transition-all transform hover:scale-105"
                >
                    <Crown size={14} fill="currentColor" />
                    Upgrade to Pro
                </button>
            )}

            {/* Premium Badge */}
            {isPremiumUser && (
                 <div className="hidden sm:flex items-center gap-1.5 bg-slate-900 text-amber-400 text-xs font-bold px-3 py-1.5 rounded-full border border-slate-800">
                    <Star size={12} fill="currentColor" />
                    PREMIUM MEMBER
                 </div>
            )}

            <div className="h-6 w-px bg-slate-200 hidden md:block" aria-hidden="true"></div>
            
            <div className="flex items-center gap-3">
                <div className={`flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-full ${isGuest ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'}`}>
                    <UserIcon size={14} className={isGuest ? "text-amber-600" : "text-slate-500"} aria-hidden="true" />
                    <span aria-label={`Logged in as ${user?.name || 'Guest'}`}>{user?.name || 'Guest Mode'}</span>
                </div>
                {isGuest ? (
                    <button 
                        onClick={onLoginRequest}
                        className="text-sm font-semibold text-blue-600 hover:underline"
                    >
                        Log In
                    </button>
                ) : (
                    <button 
                        onClick={onLogout}
                        className="text-slate-500 hover:text-red-600 transition-colors p-2 rounded-md hover:bg-red-50 focus:ring-2 focus:ring-red-500 outline-none"
                        title="Sign Out"
                        aria-label="Sign Out"
                    >
                        <LogOut size={20} aria-hidden="true" />
                    </button>
                )}
            </div>
          </div>
        </div>
      </div>

      {/* Hero / Filter Section */}
      <main className="bg-white border-b border-slate-200 pt-10 pb-6 px-6 shrink-0">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-slate-900">Choose your perfect template</h1>
            <p className="text-slate-500 max-w-2xl mx-auto">
              Browse our collection of over 60+ professionally designed, ATS-friendly, and creative resume templates.
              {!isPremiumUser && <span className="block text-amber-600 font-medium mt-2 cursor-pointer hover:underline" onClick={onUpgradeRequest}>Upgrade to unlock all Premium templates.</span>}
            </p>
          </div>

          {/* Continue Session Card */}
          {hasSavedResume && (
            <div className="max-w-xl mx-auto mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-lg p-4 flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-top-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                        <FileEdit size={20} aria-hidden="true" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 text-sm">Draft Found</h3>
                        <p className="text-xs text-slate-500">You have an unsaved resume from a previous session.</p>
                    </div>
                </div>
                <button 
                    onClick={onContinue}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-md shadow-sm transition-all focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 outline-none"
                >
                    Continue Editing
                </button>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mt-8">
            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg" role="group" aria-label="Template Categories">
              {(['All', 'ATS', 'Professional', 'Creative', 'Modern'] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  aria-pressed={filter === cat}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all focus:ring-2 focus:ring-blue-500 outline-none ${
                    filter === cat ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            
            <div className="relative w-full md:w-64">
              <label htmlFor="template-search" className="sr-only">Search templates</label>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} aria-hidden="true" />
              <input 
                id="template-search"
                type="text" 
                placeholder="Search templates..." 
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Grid */}
      <div className="flex-1 max-w-7xl mx-auto px-6 py-10 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTemplates.map(template => {
            const isLocked = template.isPremium && !isPremiumUser;
            
            return (
                <button
                key={template.id} 
                className={`group bg-white rounded-xl overflow-hidden border transition-all duration-300 flex flex-col cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 relative ${isLocked ? 'border-amber-200 hover:border-amber-400 hover:shadow-amber-100' : 'border-slate-200 hover:shadow-xl hover:border-blue-300'}`}
                onClick={() => handleTemplateClick(template)}
                aria-label={`Select ${template.name} template${isLocked ? ' (Premium - Locked)' : ''}`}
                >
                {/* Premium Badge */}
                {template.isPremium && (
                    <div className={`absolute top-3 right-3 z-10 p-1.5 rounded-full shadow-md ${isLocked ? 'bg-amber-400 text-white' : 'bg-slate-900 text-amber-400'}`} title="Premium Template">
                        {isLocked ? <Lock size={14} /> : <Crown size={14} fill="currentColor" />}
                    </div>
                )}

                {/* Thumbnail Representation */}
                <div className={`h-64 w-full relative overflow-hidden bg-slate-100 p-4`} aria-hidden="true">
                    {/* Mini Resume Visualization */}
                    <div className={`w-full h-full shadow-lg transform group-hover:scale-105 transition-transform duration-500 origin-top bg-white border border-slate-200 ${isLocked ? 'opacity-80 grayscale-[0.5]' : ''}`}>
                       <TemplateThumbnail template={template} />
                        
                        {/* Hover Overlay */}
                        <div className={`absolute inset-0 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 ${isLocked ? 'bg-slate-900/40' : 'bg-blue-600/10'}`}>
                            <span className={`px-4 py-2 rounded-full font-medium shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all flex items-center gap-2 ${isLocked ? 'bg-white text-slate-900' : 'bg-blue-600 text-white'}`}>
                                {isLocked ? (
                                    <>
                                        {isGuest ? 'Login to Unlock' : 'Upgrade to Unlock'}
                                    </>
                                ) : (
                                    <>
                                        Use Template <ChevronRight size={14} />
                                    </>
                                )}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="p-4 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-slate-800">{template.name}</h3>
                        {template.category === 'ATS' && <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase">ATS</span>}
                        {template.category === 'Professional' && <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase">PRO</span>}
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2 mb-3">{template.description}</p>
                    <div className="mt-auto flex items-center gap-2 text-xs text-slate-400">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: template.config?.colorPrimary || '#cbd5e1' }} aria-hidden="true"></div>
                        {template.isPremium ? <span className="text-amber-600 font-medium flex items-center gap-1"><Crown size={10} /> Premium</span> : 'Free Template'}
                    </div>
                </div>
                </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
