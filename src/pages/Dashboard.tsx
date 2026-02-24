import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { RiskReport } from '../types';
import { Shield, TrendingUp, Activity, Scale, Gavel, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface DashboardProps {
  report: RiskReport | null;
  onNavigate: (tab: string) => void;
}

export const Dashboard = ({ report, onNavigate }: DashboardProps) => {
  const { language, t } = useLanguage();

  if (!report) return <div className="animate-pulse h-96 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>;

  const getScoreColor = (score: string) => {
    switch (score.toLowerCase()) {
      case 'high': return 'text-rose-500 bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900';
      case 'medium': return 'text-amber-500 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900';
      case 'low': return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900';
      default: return 'text-slate-500 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{t('Compliance Overview', '合规综合评估')}</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2">{t('Real-time risk assessment and trend analysis', '实时风险评估与趋势分析')}</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Risk Score Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-center"
        >
          <div className="mb-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-full">
            <Shield size={32} className="text-slate-700 dark:text-slate-300" />
          </div>
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('Overall Risk Level', '整体风险等级')}</h3>
          <div className={`mt-4 px-6 py-2 rounded-full text-2xl font-bold border ${getScoreColor(report.score)}`}>
            {report.score}
          </div>
          <p className="mt-4 text-xs text-slate-400">
            {t('Last Updated:', '最后更新：')} {report.lastUpdated}
          </p>
        </motion.div>

        {/* Executive Summary Card (3 Bullet Points) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800"
        >
          <div className="flex items-center gap-3 mb-4">
            <Activity size={24} className="text-indigo-500" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{t('Executive Summary', '执行摘要')}</h3>
          </div>
          <div className="space-y-3">
            {(language === 'en' ? report.summary.en : report.summary.cn).map((point, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0" />
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{point}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Trends Grid */}
      <section>
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <TrendingUp size={20} />
          {t('Key Compliance Trends', '关键合规趋势')}
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left: Stats (Legislation vs Enforcement) - Takes up 4 columns */}
          <div className="lg:col-span-4 flex flex-col gap-6 h-full">
            {/* Enforcement Stat */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm flex-1 flex flex-col justify-center cursor-pointer hover:shadow-lg hover:scale-[1.02] hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-200"
              onClick={() => onNavigate('updates')}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <Gavel size={24} className="text-rose-500" />
                  <span className="text-base font-medium">{language === 'en' ? report.stats.enforcement.label.en : report.stats.enforcement.label.cn}</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  report.stats.enforcement.trend === 'up' ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                }`}>
                  {report.stats.enforcement.trend === 'up' ? '↑' : report.stats.enforcement.trend === 'down' ? '↓' : '→'}
                </span>
              </div>
              <div className="text-5xl font-bold text-slate-900 dark:text-white mt-2">{report.stats.enforcement.count}</div>
            </motion.div>

            {/* Legislation Stat */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm flex-1 flex flex-col justify-center cursor-pointer hover:shadow-lg hover:scale-[1.02] hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-200"
              onClick={() => onNavigate('knowledge')}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <Scale size={24} className="text-indigo-500" />
                  <span className="text-base font-medium">{language === 'en' ? report.stats.legislation.label.en : report.stats.legislation.label.cn}</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  report.stats.legislation.trend === 'up' ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                }`}>
                  {report.stats.legislation.trend === 'up' ? '↑' : report.stats.legislation.trend === 'down' ? '↓' : '→'}
                </span>
              </div>
              <div className="text-5xl font-bold text-slate-900 dark:text-white mt-2">{report.stats.legislation.count}</div>
            </motion.div>
          </div>

          {/* Right: Top 5 Focus Areas - Takes up 8 columns */}
          <div className="lg:col-span-8 bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 h-full">
             <div className="flex items-center gap-2 mb-6">
                <div className="bg-indigo-500 text-white text-xs font-bold px-2 py-1 rounded">TOP 5</div>
                <h4 className="font-bold text-slate-900 dark:text-white text-lg">{t('Critical Compliance Areas', '核心合规领域')}</h4>
             </div>
             
             <div className="grid grid-cols-1 gap-4">
              {report.focusAreas.map((area, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                  className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors flex flex-col md:flex-row md:items-start gap-4"
                >
                  <div className="flex-shrink-0 flex justify-between md:block md:w-48">
                    <h5 className="font-bold text-slate-800 dark:text-slate-100 text-base">
                      {language === 'en' ? area.name.en : area.name.cn}
                    </h5>
                    {area.citation && (
                      <span className="inline-block mt-1 text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                        {area.citation}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 border-l-2 border-indigo-100 dark:border-indigo-900/50 pl-4">
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-2">
                      {language === 'en' ? area.summary.en : area.summary.cn}
                    </p>
                    {/* Related Events */}
                    {area.relatedEvents && area.relatedEvents.length > 0 && (
                      <div className="mt-2 space-y-1">
                         {area.relatedEvents.map((event, eIdx) => (
                           <a 
                             key={eIdx}
                             href={event.url}
                             target="_blank"
                             rel="noopener noreferrer"
                             className="flex items-center gap-1.5 text-xs font-medium text-rose-600 dark:text-rose-400 hover:underline bg-rose-50 dark:bg-rose-900/20 px-2 py-1 rounded w-fit"
                           >
                             <AlertCircle size={12} />
                             {language === 'en' ? event.title.en : event.title.cn}
                           </a>
                         ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
