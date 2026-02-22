import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { KnowledgeItem } from '../types';
import { FileText, Link as LinkIcon, Scale, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface KnowledgeBaseProps {
  items: KnowledgeItem[];
}

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

export const KnowledgeBase = ({ items }: KnowledgeBaseProps) => {
  const { language, t } = useLanguage();

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
                "p-6 rounded-xl border transition-colors shadow-sm group",
                isEU 
                  ? "bg-blue-50/30 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-500" 
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-500"
              )}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-4">
                  <RegulatorLogo item={item} />
                  <div>
                    <div className="flex items-center gap-3 mb-1">
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
                
                <a 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                  title={t('View Official Document', '查看官方文件')}
                >
                  <ExternalLink size={20} />
                </a>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
