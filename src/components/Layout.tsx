import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../lib/utils';
import { LayoutDashboard, Book, Radio, RefreshCw, ChevronLeft, ChevronRight, Moon, Sun, Eye } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const Layout = ({ children, activeTab, onTabChange, onRefresh, isRefreshing }: LayoutProps) => {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  // Scroll to top when tab changes
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeTab]);

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: { en: 'Dashboard', cn: '综合看板' } },
    { id: 'updates', icon: Radio, label: { en: 'Regulatory Feed', cn: '监管动态' } },
    { id: 'knowledge', icon: Book, label: { en: 'Knowledge Base', cn: '知识库' } },
  ];

  return (
    <div className="h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans flex overflow-hidden transition-colors duration-300">
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-slate-900 dark:bg-slate-950 text-white flex-shrink-0 flex flex-col transition-all duration-300 border-r border-slate-800 h-full overflow-y-auto",
          isCollapsed ? "w-16" : "w-48"
        )}
      >
        <div className={cn("p-4 border-b border-slate-800 flex items-center", isCollapsed ? "justify-center" : "justify-between")}>
          {!isCollapsed ? (
            <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
              <div className="w-7 h-7 bg-indigo-500 rounded-lg flex items-center justify-center text-white relative overflow-hidden">
                <Eye size={16} fill="currentColor" className="opacity-90" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[7px] font-black text-indigo-900 mt-[1px]">AI</span>
                </div>
              </div>
              <span className="text-white">
                <span className="font-bold text-indigo-400">AI</span>
                <span className="font-normal text-slate-100">Blink</span>
              </span>
            </h1>
          ) : (
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white relative overflow-hidden">
               <Eye size={18} fill="currentColor" className="opacity-90" />
               <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[8px] font-black text-indigo-900 mt-[1px]">AI</span>
               </div>
            </div>
          )}
        </div>

        <nav className="flex-1 p-2 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                activeTab === item.id
                  ? "bg-indigo-500/10 text-indigo-400 font-medium border border-indigo-500/20"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200",
                isCollapsed && "justify-center px-0"
              )}
              title={isCollapsed ? (language === 'en' ? item.label.en : item.label.cn) : undefined}
            >
              <item.icon size={18} />
              {!isCollapsed && <span className="text-sm">{language === 'en' ? item.label.en : item.label.cn}</span>}
            </button>
          ))}
        </nav>

        <div className="p-2 border-t border-slate-800 space-y-2">
          {/* Collapse Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center justify-center p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>

          {/* Language Toggle */}
          <div className={cn("flex items-center justify-between bg-slate-800 rounded-lg p-1", isCollapsed && "flex-col gap-1")}>
            <button
              onClick={() => setLanguage('en')}
              className={cn(
                "flex-1 py-1 text-[10px] font-medium rounded-md transition-colors",
                language === 'en' ? "bg-slate-600 text-white" : "text-slate-400 hover:text-white",
                isCollapsed && "w-full"
              )}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('cn')}
              className={cn(
                "flex-1 py-1 text-[10px] font-medium rounded-md transition-colors",
                language === 'cn' ? "bg-slate-600 text-white" : "text-slate-400 hover:text-white",
                isCollapsed && "w-full"
              )}
            >
              中
            </button>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={cn(
              "w-full flex items-center justify-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors border border-slate-700 text-slate-300",
              isCollapsed && "px-0"
            )}
            title={t('Toggle Theme', '切换主题')}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className={cn(
              "w-full flex items-center justify-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium transition-colors text-white shadow-lg shadow-indigo-900/20",
              isRefreshing && "opacity-50 cursor-not-allowed",
              isCollapsed && "px-0"
            )}
            title={t('Refresh Data', '刷新数据')}
          >
            <RefreshCw size={16} className={cn(isRefreshing && "animate-spin")} />
            {!isCollapsed && <span>{isRefreshing ? t('Updating...', '更新中...') : t('Refresh', '刷新')}</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main ref={mainRef} className="flex-1 overflow-auto bg-slate-50 dark:bg-slate-950">
        <div className="p-6 md:p-10 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
