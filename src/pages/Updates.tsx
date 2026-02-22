import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { UpdateItem } from '../types';
import { Calendar, ExternalLink, MessageSquareQuote, Building2, Scale, Box } from 'lucide-react';
import { motion } from 'motion/react';

interface UpdatesProps {
  updates: UpdateItem[];
}

export const Updates = ({ updates }: UpdatesProps) => {
  const { language, t } = useLanguage();

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
            className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            
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

                {/* Source Link */}
                {item.url && (
                  <div className="pt-2">
                    <a 
                      href={item.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      {t('Read Full Source', '阅读原文')}
                      <ExternalLink size={14} />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
};
