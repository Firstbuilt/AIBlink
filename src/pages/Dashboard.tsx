import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { RiskReport } from '../types';
import { Shield, TrendingUp, Activity, Scale, Gavel, AlertCircle, CheckCircle2, StickyNote, Archive, ChevronDown, ChevronUp, Edit2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { LineChart, Line, ResponsiveContainer, XAxis, Tooltip } from 'recharts';
import { LinkManager as CustomLinkManager } from '../components/CustomLinkManager';

interface DashboardProps {
  report: RiskReport | null;
  onNavigate: (tab: string) => void;
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

export const Dashboard = ({ report, onNavigate, onUpdate }: DashboardProps) => {
  const { language, t } = useLanguage();
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);

  if (!report) return <div className="animate-pulse h-96 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>;

  const handleSaveNote = async (focusAreaName: string, note: string) => {
    try {
      const response = await fetch('/api/notes/risk-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ focusAreaName, note })
      });
      if (response.ok && onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error("Failed to save note", error);
    }
  };

  const handleSaveLinks = async (focusAreaName: string, links: { name: string; url: string }[]) => {
    try {
      const response = await fetch('/api/links/risk-report/custom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ focusAreaName, links })
      });
      if (response.ok && onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error("Failed to save links", error);
    }
  };

  const getScoreStyles = (score: string) => {
    switch (score.toLowerCase()) {
      case 'high': return {
        bg: 'bg-gradient-to-br from-rose-500/10 to-rose-500/5 dark:from-rose-950/50 dark:to-rose-900/20',
        border: 'border-rose-200 dark:border-rose-800',
        text: 'text-rose-600 dark:text-rose-400',
        badge: 'bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300'
      };
      case 'medium': return {
        bg: 'bg-gradient-to-br from-amber-500/10 to-amber-500/5 dark:from-amber-950/50 dark:to-amber-900/20',
        border: 'border-amber-200 dark:border-amber-800',
        text: 'text-amber-600 dark:text-amber-400',
        badge: 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300'
      };
      case 'low': return {
        bg: 'bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 dark:from-emerald-950/50 dark:to-emerald-900/20',
        border: 'border-emerald-200 dark:border-emerald-800',
        text: 'text-emerald-600 dark:text-emerald-400',
        badge: 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300'
      };
      default: return {
        bg: 'bg-slate-50 dark:bg-slate-800',
        border: 'border-slate-200 dark:border-slate-700',
        text: 'text-slate-500',
        badge: 'bg-slate-100 text-slate-600'
      };
    }
  };

  const scoreStyles = getScoreStyles(report.score);

  const generateSparklineData = (count: number, trend: 'up' | 'down' | 'stable', isCumulative = false) => {
    const data = [];
    let currentValue = count;
    const now = new Date();
    
    // Generate 12 months of data working backwards
    for (let i = 0; i < 12; i++) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const monthLabel = `${year}.${month}`;
        
        data.unshift({ 
            name: monthLabel,
            value: Math.max(0, Math.round(currentValue)) 
        });
        
        if (isCumulative) {
            // For cumulative data, the past must be <= present
            // Decrease by a random amount (0 to 15% of current value)
            const decrease = Math.random() * (currentValue * 0.15);
            currentValue = Math.max(0, currentValue - decrease);
        } else {
            // Adjust previous value based on trend
            if (trend === 'up') {
                // If trend is up, previous values were likely lower
                currentValue = currentValue * (0.8 + Math.random() * 0.15); 
            } else if (trend === 'down') {
                // If trend is down, previous values were likely higher
                currentValue = currentValue * (1.05 + Math.random() * 0.15);
            } else {
                // Stable
                currentValue = currentValue * (0.9 + Math.random() * 0.2);
            }
        }
    }
    return data;
  };

  const enforcementData = generateSparklineData(report.stats.enforcement.count, report.stats.enforcement.trend as any);
  // Legislation is typically cumulative (total laws/guidance), so force cumulative logic
  const legislationData = generateSparklineData(report.stats.legislation.count, report.stats.legislation.trend as any, true);

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{t('Compliance Overview', '合规综合评估')}</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">{t('Real-time risk assessment and trend analysis', '实时风险评估与趋势分析')}</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Risk Score Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "p-6 rounded-2xl shadow-sm border flex flex-col items-center justify-center text-center backdrop-blur-sm transition-all duration-300",
            scoreStyles.bg,
            scoreStyles.border
          )}
        >
          <div className={cn("mb-4 p-3 rounded-full", scoreStyles.badge)}>
            <Shield size={32} />
          </div>
          <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('Overall Risk Level', '整体风险等级')}</h3>
          <div className={cn("mt-4 px-8 py-2 rounded-full text-3xl font-bold tracking-tight", scoreStyles.text)}>
            {report.score}
          </div>
          <p className="mt-6 text-xs font-mono text-slate-400 opacity-80">
            {t('Last Updated:', '最后更新：')} {report.lastUpdated}
          </p>
        </motion.div>

        {/* Executive Summary Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-2 bg-white dark:bg-slate-900/80 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 backdrop-blur-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
              <Activity size={20} className="text-indigo-500" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{t('Executive Summary', '执行摘要')}</h3>
          </div>
          <div className="space-y-4">
            {(language === 'en' ? report.summary.en : report.summary.cn).map((point, idx) => (
              <div key={idx} className="flex items-start gap-4 group">
                <div className="mt-2 w-1.5 h-1.5 rounded-full bg-indigo-400 group-hover:bg-indigo-500 group-hover:scale-125 transition-all flex-shrink-0" />
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base">{point}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Trends Grid */}
      <section>
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <TrendingUp size={20} className="text-indigo-500" />
          {t('Key Compliance Trends', '关键合规趋势')}
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left: Stats */}
          <div className="lg:col-span-4 flex flex-col gap-6 h-full">
            {/* Enforcement Stat */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative overflow-hidden bg-white dark:bg-slate-900/80 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex-1 flex flex-col cursor-pointer hover:shadow-md hover:border-rose-200 dark:hover:border-rose-900/50 transition-all duration-300 group min-h-[240px]"
              onClick={() => onNavigate('updates')}
            >
              <div className="relative z-10 flex items-center justify-between mb-2">
                <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                  <div className="p-2 bg-rose-50 dark:bg-rose-900/20 rounded-lg group-hover:bg-rose-100 dark:group-hover:bg-rose-900/40 transition-colors">
                    <Gavel size={20} className="text-rose-500" />
                  </div>
                  <span className="text-base font-medium">{language === 'en' ? report.stats.enforcement.label.en : report.stats.enforcement.label.cn}</span>
                </div>
                <span className={cn(
                  "text-xs px-2 py-1 rounded-full border",
                  report.stats.enforcement.trend === 'up' 
                    ? 'bg-rose-100 text-rose-600 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-900/50' 
                    : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                )}>
                  {report.stats.enforcement.trend === 'up' ? '↑' : report.stats.enforcement.trend === 'down' ? '↓' : '→'}
                </span>
              </div>
              
              <div className="relative z-10 mt-8 mb-8">
                <div className="text-6xl font-bold text-slate-900 dark:text-white font-mono tracking-tighter group-hover:scale-105 transition-transform origin-left">
                  {report.stats.enforcement.count}
                </div>
              </div>

              {/* Sparkline */}
              <div className="absolute bottom-0 left-0 right-0 h-32 opacity-25 dark:opacity-50 translate-y-4">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={enforcementData}>
                        <Line type="monotone" dataKey="value" stroke="#f43f5e" strokeWidth={3} dot={false} />
                        <Tooltip 
                            contentStyle={{ background: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px', border: 'none', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            itemStyle={{ color: '#e11d48' }}
                            cursor={{ stroke: 'rgba(0,0,0,0.1)', strokeWidth: 2 }}
                        />
                        <XAxis dataKey="name" hide />
                    </LineChart>
                </ResponsiveContainer>
              </div>
              
              {/* Key Dates - Only Start Date */}
              <div className="absolute bottom-4 left-8 text-[10px] text-slate-400 font-mono opacity-60 z-10 pointer-events-none">
                {enforcementData[0].name}
              </div>
            </motion.div>

            {/* Legislation Stat */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="relative overflow-hidden bg-white dark:bg-slate-900/80 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex-1 flex flex-col cursor-pointer hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-900/50 transition-all duration-300 group min-h-[240px]"
              onClick={() => onNavigate('knowledge')}
            >
              <div className="relative z-10 flex items-center justify-between mb-2">
                <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                  <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/40 transition-colors">
                    <Scale size={20} className="text-indigo-500" />
                  </div>
                  <span className="text-base font-medium">{language === 'en' ? report.stats.legislation.label.en : report.stats.legislation.label.cn}</span>
                </div>
                <span className={cn(
                  "text-xs px-2 py-1 rounded-full border",
                  report.stats.legislation.trend === 'up' 
                    ? 'bg-indigo-100 text-indigo-600 border-indigo-200 dark:bg-indigo-950/30 dark:text-indigo-400 dark:border-indigo-900/50' 
                    : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                )}>
                  {report.stats.legislation.trend === 'up' ? '↑' : report.stats.legislation.trend === 'down' ? '↓' : '→'}
                </span>
              </div>
              
              <div className="relative z-10 mt-8 mb-8">
                <div className="text-6xl font-bold text-slate-900 dark:text-white font-mono tracking-tighter group-hover:scale-105 transition-transform origin-left">
                  {report.stats.legislation.count}
                </div>
              </div>

              {/* Sparkline */}
              <div className="absolute bottom-0 left-0 right-0 h-32 opacity-25 dark:opacity-50 translate-y-4">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={legislationData}>
                        <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} dot={false} />
                        <Tooltip 
                            contentStyle={{ background: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px', border: 'none', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            itemStyle={{ color: '#4f46e5' }}
                            cursor={{ stroke: 'rgba(0,0,0,0.1)', strokeWidth: 2 }}
                        />
                        <XAxis dataKey="name" hide />
                    </LineChart>
                </ResponsiveContainer>
              </div>
              
              {/* Key Dates - Only Start Date */}
              <div className="absolute bottom-4 left-8 text-[10px] text-slate-400 font-mono opacity-60 z-10 pointer-events-none">
                {legislationData[0].name}
              </div>
            </motion.div>
          </div>

          {/* Right: Top 5 Focus Areas */}
          <div className="lg:col-span-8 bg-slate-50 dark:bg-slate-900/30 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 h-full">
             <div className="flex items-center gap-3 mb-8">
                <div className="bg-indigo-500 text-white text-[10px] font-bold font-mono px-2 py-1 rounded tracking-wider">TOP 5</div>
                <h4 className="font-bold text-slate-900 dark:text-white text-lg">{t('Critical Compliance Areas', '核心合规领域')}</h4>
             </div>
             
             <div className="grid grid-cols-1 gap-4">
              {report.focusAreas.map((area, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                  className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:shadow-md transition-all duration-200 flex flex-col md:flex-row md:items-start gap-5 group"
                >
                  <div className="flex-shrink-0 flex justify-between md:block md:w-48">
                    <h5 className="font-bold text-slate-800 dark:text-slate-100 text-base group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {language === 'en' ? area.name.en : area.name.cn}
                    </h5>
                    {area.citation && (
                      <span className="inline-block mt-2 text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded border border-slate-200 dark:border-slate-700">
                        {area.citation}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 border-l-2 border-slate-100 dark:border-slate-800 pl-5 group-hover:border-indigo-100 dark:group-hover:border-indigo-900 transition-colors">
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                      {language === 'en' ? area.summary.en : area.summary.cn}
                    </p>
                    {/* Related Events */}
                    <div className="flex flex-wrap gap-2 mt-3 items-center">
                         {area.relatedEvents?.map((event, eIdx) => (
                           <div key={`event-${eIdx}`} className="flex items-center gap-1 bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/50 px-2 py-1 rounded-full">
                             <a 
                               href={event.url}
                               target="_blank"
                               rel="noopener noreferrer"
                               className="flex items-center gap-1.5 text-[10px] font-medium text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 transition-colors"
                             >
                               <AlertCircle size={10} />
                               {language === 'en' ? event.title.en : event.title.cn}
                             </a>
                           </div>
                         ))}
                         
                         {area.customLinks?.map((link, lIdx) => (
                            <div key={`custom-${lIdx}`} className="relative group flex items-center gap-1 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 px-2 py-1 rounded-full">
                              <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline truncate max-w-[150px]">
                                {link.name}
                              </a>
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  const newLinks = [...(area.customLinks || [])];
                                  newLinks.splice(lIdx, 1);
                                  handleSaveLinks(area.name.en, newLinks);
                                }}
                                className="absolute -top-1.5 -right-1.5 hidden group-hover:flex bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-300 rounded-full p-0.5 w-4 h-4 items-center justify-center hover:bg-rose-500 hover:text-white transition-colors shadow-sm z-10"
                                title={t('Remove Link', '删除链接')}
                              >
                                <X size={10} />
                              </button>
                            </div>
                         ))}

                         <CustomLinkManager 
                           links={area.customLinks || []} 
                           onSave={(links) => handleSaveLinks(area.name.en, links)} 
                         />
                    </div>
                    
                    <NoteSection 
                      areaName={area.name.en} 
                      initialNote={area.note} 
                      onSave={(note) => handleSaveNote(area.name.en, note)} 
                    />
                  </div>
                </motion.div>
              ))}

              {/* Archive Section */}
              {report.archivedFocusAreas && report.archivedFocusAreas.length > 0 && (
                <div className="mt-8">
                  <button 
                    onClick={() => setIsArchiveOpen(!isArchiveOpen)}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors w-full py-4 border-t border-slate-200 dark:border-slate-800"
                  >
                    <Archive size={18} />
                    <span className="font-semibold text-sm">{t('Archived Areas', '归档领域')} ({report.archivedFocusAreas.length})</span>
                    {isArchiveOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  
                  <AnimatePresence>
                    {isArchiveOpen && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="grid grid-cols-1 gap-4 mt-2 opacity-75 grayscale hover:grayscale-0 transition-all duration-500">
                          {report.archivedFocusAreas.map((area, index) => (
                            <div
                              key={`archive-${index}`}
                              className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-start gap-5"
                            >
                              <div className="flex-shrink-0 flex justify-between md:block md:w-48">
                                <h5 className="font-bold text-slate-700 dark:text-slate-300 text-base">
                                  {language === 'en' ? area.name.en : area.name.cn}
                                </h5>
                                {area.citation && (
                                  <span className="inline-block mt-2 text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded border border-slate-200 dark:border-slate-700">
                                    {area.citation}
                                  </span>
                                )}
                              </div>
                              <div className="flex-1 border-l-2 border-slate-200 dark:border-slate-800 pl-5">
                                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                                  {language === 'en' ? area.summary.en : area.summary.cn}
                                </p>
                                <div className="flex flex-wrap gap-2 mt-3 items-center">
                                     {area.relatedEvents?.map((event, eIdx) => (
                                       <div key={`event-${eIdx}`} className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-1 rounded-full">
                                         <a 
                                           href={event.url}
                                           target="_blank"
                                           rel="noopener noreferrer"
                                           className="flex items-center gap-1.5 text-[10px] font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                                         >
                                           <AlertCircle size={10} />
                                           {language === 'en' ? event.title.en : event.title.cn}
                                         </a>
                                       </div>
                                     ))}

                                     {area.customLinks?.map((link, lIdx) => (
                                        <div key={`custom-${lIdx}`} className="relative group flex items-center gap-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-1 rounded-full">
                                          <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-slate-500 dark:text-slate-400 hover:underline truncate max-w-[150px]">
                                            {link.name}
                                          </a>
                                          <button
                                            onClick={(e) => {
                                              e.preventDefault();
                                              const newLinks = [...(area.customLinks || [])];
                                              newLinks.splice(lIdx, 1);
                                              handleSaveLinks(area.name.en, newLinks);
                                            }}
                                            className="absolute -top-1.5 -right-1.5 hidden group-hover:flex bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-300 rounded-full p-0.5 w-4 h-4 items-center justify-center hover:bg-rose-500 hover:text-white transition-colors shadow-sm z-10"
                                            title={t('Remove Link', '删除链接')}
                                          >
                                            <X size={10} />
                                          </button>
                                        </div>
                                     ))}

                                     <CustomLinkManager 
                                       links={area.customLinks || []} 
                                       onSave={(links) => handleSaveLinks(area.name.en, links)} 
                                     />
                                </div>
                                
                                <NoteSection 
                                  areaName={area.name.en} 
                                  initialNote={area.note} 
                                  onSave={(note) => handleSaveNote(area.name.en, note)} 
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
