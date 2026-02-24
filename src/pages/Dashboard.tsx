import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { RiskReport } from '../types';
import { Shield, TrendingUp, Activity, Scale, Gavel, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { LineChart, Line, ResponsiveContainer, XAxis, Tooltip } from 'recharts';

interface DashboardProps {
  report: RiskReport | null;
  onNavigate: (tab: string) => void;
}

export const Dashboard = ({ report, onNavigate }: DashboardProps) => {
  const { language, t } = useLanguage();

  if (!report) return <div className="animate-pulse h-96 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>;

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
                    {area.relatedEvents && area.relatedEvents.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                         {area.relatedEvents.map((event, eIdx) => (
                           <a 
                             key={eIdx}
                             href={event.url}
                             target="_blank"
                             rel="noopener noreferrer"
                             className="flex items-center gap-1.5 text-[10px] font-medium text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/50 px-2.5 py-1 rounded-full transition-colors"
                           >
                             <AlertCircle size={10} />
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
