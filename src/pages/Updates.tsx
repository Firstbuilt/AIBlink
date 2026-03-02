import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { UpdateItem } from '../types';
import { Calendar, ExternalLink, MessageSquareQuote, Building2, Scale, Box, Search, StickyNote, Edit2, ChevronUp, ChevronDown, X } from 'lucide-react';
import { motion } from 'motion/react';
import { LinkManager } from '../components/LinkManager';
import { LinkManager as CustomLinkManager } from '../components/CustomLinkManager';
import { NoteSection } from '../components/NoteSection';
import { DeleteLinkButton } from '../components/DeleteLinkButton';
import { cn } from '../lib/utils';

interface UpdatesProps {
  updates: UpdateItem[];
  onUpdate?: () => void;
}


export const Updates = ({ updates, onUpdate }: UpdatesProps) => {
  const { language, t } = useLanguage();

  const handleUpdateLink = async (id: string, url: string) => {
    try {
      const response = await fetch('/api/links/updates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, url })
      });
      if (response.ok && onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error("Failed to update link", error);
    }
  };

  const handleSaveNote = async (id: string, note: string) => {
    try {
      const response = await fetch('/api/notes/updates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, note })
      });
      if (response.ok && onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error("Failed to save note", error);
    }
  };

  const handleSaveCustomLinks = async (id: string, links: { name: string; url: string }[]) => {
    try {
      const response = await fetch('/api/links/updates/custom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, links })
      });
      if (response.ok && onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error("Failed to save custom links", error);
    }
  };

  const getPartyIcon = (type: string) => {
    switch (type) {
      case 'Regulator': return <Scale size={12} />;
      case 'Company': return <Building2 size={12} />;
      case 'Product': return <Box size={12} />;
      default: return <Building2 size={12} />;
    }
  };

  const getPartyColor = (type: string) => {
    switch (type) {
      case 'Regulator': return 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 border-rose-200 dark:border-rose-800';
      case 'Company': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'Product': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{t('Regulatory Feed', '监管动态')}</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2">{t('Latest news, legislation, and enforcement actions', '最新新闻、立法进展及执法动态')}</p>
      </header>

      <div className="space-y-6">
        {updates.map((item, index) => (
          <motion.article
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 relative group hover:z-10"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-tl-2xl rounded-bl-2xl" />
            
            {/* Top Right Link Icon */}
            <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
              <a 
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
              >
                <ExternalLink size={16} />
              </a>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6">
              {/* Date & Source */}
              <div className="md:w-48 flex-shrink-0">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-2">
                  <Calendar size={16} />
                  <span className="text-sm font-mono">{item.date}</span>
                </div>
                <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 inline-block px-2 py-1 rounded-md mb-3">
                  {item.source}
                </div>
                
                {/* Parties Involved */}
                {item.parties && item.parties.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {item.parties.map((party, pIdx) => (
                      <div 
                        key={pIdx}
                        className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium border ${getPartyColor(party.type)}`}
                      >
                        {getPartyIcon(party.type)}
                        <span>{party.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 space-y-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {language === 'en' ? item.title.en : item.title.cn}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {language === 'en' ? item.content.en : item.content.cn}
                </p>
                
                {/* Expert Analysis Box */}
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 border border-slate-100 dark:border-slate-700 mt-4">
                  <div className="flex items-center gap-2 mb-2 text-emerald-600 dark:text-emerald-400">
                    <MessageSquareQuote size={18} />
                    <span className="text-xs font-bold uppercase tracking-wider">{t('Expert Analysis', '专家点评')}</span>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 italic">
                    "{language === 'en' ? item.analysis.en : item.analysis.cn}"
                  </p>
                </div>

                {/* Custom Links */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800/50 mt-4">
                  <div className="flex flex-wrap gap-2 items-center">
                    {item.customLinks?.map((link, lIdx) => (
                        <div key={`custom-${lIdx}`} className="relative group flex items-center gap-1 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 px-2 py-1 rounded-full">
                            <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline truncate max-w-[150px]">
                                {link.name}
                            </a>
                            <DeleteLinkButton
                                onDelete={() => {
                                    const newLinks = [...(item.customLinks || [])];
                                    newLinks.splice(lIdx, 1);
                                    handleSaveCustomLinks(item.id, newLinks);
                                }}
                                className="absolute -top-1.5 -right-1.5 hidden group-hover:flex bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-300 rounded-full p-0.5 w-4 h-4 items-center justify-center hover:bg-rose-500 hover:text-white transition-colors shadow-sm z-10"
                            />
                        </div>
                    ))}
                    <CustomLinkManager 
                        links={item.customLinks || []} 
                        onSave={(links) => handleSaveCustomLinks(item.id, links)} 
                    />
                  </div>
                </div>

                <NoteSection 
                  areaName={item.id} 
                  initialNote={item.note} 
                  onSave={(note) => handleSaveNote(item.id, note)} 
                />
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
};
