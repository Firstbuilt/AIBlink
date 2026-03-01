import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { KnowledgeItem } from '../types';
import { FileText, Link as LinkIcon, Scale, ExternalLink, Search, StickyNote, Edit2, ChevronUp, ChevronDown, X } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { LinkManager } from '../components/LinkManager';
import { LinkManager as CustomLinkManager } from '../components/CustomLinkManager';

interface KnowledgeBaseProps {
  items: KnowledgeItem[];
  onUpdate?: () => void;
}

const NoteSection = ({ areaName, initialNote, onSave }: { areaName: string, initialNote?: string, onSave: (note: string) => void }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [note, setNote] = useState(initialNote || "");
  const [isExpanded, setIsExpanded] = useState(false);
  const { t } = useLanguage();
  const textRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showExpandButton, setShowExpandButton] = useState(false);

  useEffect(() => {
    if (textRef.current) {
      setShowExpandButton(textRef.current.scrollHeight > textRef.current.clientHeight);
    }
  }, [note, isEditing]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [note, isEditing]);

  const handleSave = () => {
    onSave(note);
    setIsEditing(false);
  };

  return (
    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/50">
      {!isEditing && !note && (
        <button 
          onClick={() => setIsEditing(true)}
          className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <StickyNote size={14} />
          {t('Add Note', '添加备注')}
        </button>
      )}

      {!isEditing && note && (
        <div className="group relative bg-yellow-50 dark:bg-yellow-900/10 p-3 rounded-lg border border-yellow-100 dark:border-yellow-900/30">
          <button 
            onClick={() => setIsEditing(true)}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-indigo-600 transition-all z-10"
            title={t('Edit Note', '编辑备注')}
          >
            <Edit2 size={12} />
          </button>
          
          <div 
            ref={textRef}
            className={cn("text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap transition-all pr-6", !isExpanded && "line-clamp-3")}
          >
            {note}
          </div>
          
          {showExpandButton && (
            <div className="flex justify-start items-center mt-2">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-[10px] font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 flex items-center gap-1"
              >
                {isExpanded ? (
                  <>
                    {t('Show Less', '收起')} <ChevronUp size={10} />
                  </>
                ) : (
                  <>
                    {t('Show More', '展开')} <ChevronDown size={10} />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {isEditing && (
        <div className="space-y-2">
          <textarea
            ref={textareaRef}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full text-sm p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all resize-none overflow-hidden"
            rows={3}
            placeholder={t('Add your notes here...', '在此添加备注...')}
          />
          <div className="flex justify-end gap-2">
            <button 
              onClick={() => setIsEditing(false)}
              className="text-xs px-3 py-1.5 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            >
              {t('Cancel', '取消')}
            </button>
            <button 
              onClick={handleSave}
              className="text-xs px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              {t('Save Note', '保存备注')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const RegulatorLogo = ({ item }: { item: KnowledgeItem }) => {
  const jurisdiction = item.jurisdiction.en.toUpperCase();
  const title = item.title.en.toUpperCase();

  let logoText = "";
  let bgColor = "bg-slate-100 dark:bg-slate-800";
  let textColor = "text-slate-600 dark:text-slate-400";
  let useIcon = false;

  if (jurisdiction === 'EU') {
    logoText = "EU";
    bgColor = "bg-blue-600 dark:bg-blue-700";
    textColor = "text-white";
  } else if (jurisdiction === 'FRANCE' || title.includes('CNIL')) {
    logoText = "CNIL";
    bgColor = "bg-blue-50 dark:bg-blue-900/30";
    textColor = "text-blue-600 dark:text-blue-400";
  } else if (jurisdiction === 'GERMANY' || title.includes('BFDI')) {
    logoText = "BfDI";
    bgColor = "bg-slate-200 dark:bg-slate-700";
    textColor = "text-slate-700 dark:text-slate-300";
  } else if (jurisdiction === 'SPAIN' || title.includes('AEPD')) {
    logoText = "AEPD";
    bgColor = "bg-red-50 dark:bg-red-900/30";
    textColor = "text-red-600 dark:text-red-400";
  } else if (jurisdiction === 'IRELAND' || title.includes('DPC')) {
    logoText = "DPC";
    bgColor = "bg-green-50 dark:bg-green-900/30";
    textColor = "text-green-600 dark:text-green-400";
  } else {
    useIcon = true;
  }

  if (useIcon) {
    return (
      <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/20 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
        <Scale size={24} />
      </div>
    );
  }

  return (
    <div className={cn(
      "w-12 h-12 flex items-center justify-center rounded-lg font-bold text-sm tracking-tighter shadow-sm shrink-0",
      bgColor,
      textColor
    )}>
      {logoText}
    </div>
  );
};

export const KnowledgeBase = ({ items, onUpdate }: KnowledgeBaseProps) => {
  const { language, t } = useLanguage();

  const handleUpdateLink = async (id: string, url: string) => {
    try {
      const response = await fetch('/api/links/knowledge-base', {
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
      const response = await fetch('/api/notes/knowledge-base', {
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
      const response = await fetch('/api/links/knowledge-base/custom', {
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

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{t('Knowledge Base', '知识库')}</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2">{t('Key EU legislation and guidance documents', '关键欧盟立法与指导文件')}</p>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {items.map((item, index) => {
          const isEU = item.jurisdiction.en === 'EU';
          
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                "p-6 rounded-xl border transition-colors shadow-sm group relative",
                isEU 
                  ? "bg-blue-50/30 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-500" 
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-500"
              )}
            >
              {/* Top Right Link Icon */}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                 {item.url ? (
                    <a 
                      href={item.url} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                      title={t('View Official Document', '查看官方文件')}
                    >
                      <ExternalLink size={16} />
                    </a>
                  ) : (
                    <a 
                      href={`https://www.google.com/search?q=${encodeURIComponent((language === 'en' ? item.title.en : item.title.cn) + " " + item.type)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                      title={t('Search on Google', '在 Google 上搜索')}
                    >
                      <Search size={16} />
                    </a>
                  )}
              </div>

              <div className="flex flex-col h-full">
                <div className="flex items-start gap-4 flex-1 pr-12">
                  <RegulatorLogo item={item} />
                  <div>
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        {language === 'en' ? item.title.en : item.title.cn}
                      </h3>
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-mono border border-slate-200 dark:border-slate-700">
                        {item.type}
                      </span>
                      {item.jurisdiction && (
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-xs font-bold border",
                          isEU 
                            ? "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700"
                            : "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800"
                        )}>
                          {language === 'en' ? item.jurisdiction.en : item.jurisdiction.cn}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-3 font-mono">
                      {t('Effective Date:', '生效日期：')} {item.date}
                    </p>
                    <p className="text-slate-600 dark:text-slate-300 text-sm max-w-3xl">
                      {language === 'en' ? item.summary.en : item.summary.cn}
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/50">
                   {/* Custom Links */}
                   <div className="flex flex-wrap gap-2 items-center mb-2">
                        {item.customLinks?.map((link, lIdx) => (
                            <div key={`custom-${lIdx}`} className="relative group flex items-center gap-1 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 px-2 py-1 rounded-full">
                                <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline truncate max-w-[150px]">
                                    {link.name}
                                </a>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        const newLinks = [...(item.customLinks || [])];
                                        newLinks.splice(lIdx, 1);
                                        handleSaveCustomLinks(item.id, newLinks);
                                    }}
                                    className="absolute -top-1.5 -right-1.5 hidden group-hover:flex bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-300 rounded-full p-0.5 w-4 h-4 items-center justify-center hover:bg-rose-500 hover:text-white transition-colors shadow-sm z-10"
                                    title={t('Remove Link', '删除链接')}
                                >
                                    <X size={10} />
                                </button>
                            </div>
                        ))}
                        <CustomLinkManager 
                            links={item.customLinks || []} 
                            onSave={(links) => handleSaveCustomLinks(item.id, links)} 
                        />
                    </div>

                    <NoteSection 
                      areaName={item.id} 
                      initialNote={item.note} 
                      onSave={(note) => handleSaveNote(item.id, note)} 
                    />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
