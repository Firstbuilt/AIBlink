import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Updates } from './pages/Updates';
import { KnowledgeBase } from './pages/KnowledgeBase';
import { KnowledgeItem, UpdateItem, RiskReport } from './types';
import { Toast, ToastType } from './components/Toast';

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>([]);
  const [updates, setUpdates] = useState<UpdateItem[]>([]);
  const [report, setReport] = useState<RiskReport | null>(null);

  const [toast, setToast] = useState<{ message: string; type: ToastType; isVisible: boolean }>({
    message: '',
    type: 'info',
    isVisible: false,
  });

  const { language } = useLanguage();

  const showToast = (message: string, type: ToastType = 'info') => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  const fetchData = async () => {
    try {
      const [kbRes, upRes, repRes] = await Promise.all([
        fetch('/api/knowledge-base'),
        fetch('/api/updates'),
        fetch('/api/report')
      ]);
      
      setKnowledgeItems(await kbRes.json());
      setUpdates(await upRes.json());
      setReport(await repRes.json());
    } catch (error) {
      console.error("Failed to fetch initial data", error);
      showToast(language === 'en' ? "Failed to load data" : "加载数据失败", 'error');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = async () => {
    // 1. Get current system date (YYYY-MM-DD)
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0];

    // 2. Check if report.lastUpdated matches current date
    if (report && report.lastUpdated === currentDate) {
      showToast(language === 'en' ? "Content is up to date" : "当前内容已最新", 'success');
      return;
    }

    // Always refresh content based on current system date as requested
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/refresh', { method: 'POST' });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.details || data.error || "Server error");
      }

      if (data.success) {
        // Use the data returned directly from the refresh call
        // This ensures we have the latest state even if the server is stateless
        if (data.data.updates) setUpdates(data.data.updates);
        if (data.data.riskReport) setReport(data.data.riskReport);
        if (data.data.knowledgeBase) setKnowledgeItems(data.data.knowledgeBase);
        
        showToast(language === 'en' ? "Content refreshed successfully" : "内容刷新成功", 'success');
      } else {
        throw new Error("Refresh failed");
      }
    } catch (error: any) {
      console.error("Refresh failed", error);
      const msg = error.message || (language === 'en' ? "Failed to refresh content" : "刷新内容失败");
      showToast(msg, 'error');
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <>
      <Layout 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      >
        {activeTab === 'dashboard' && <Dashboard report={report} onNavigate={setActiveTab} />}
        {activeTab === 'updates' && <Updates updates={updates} />}
        {activeTab === 'knowledge' && <KnowledgeBase items={knowledgeItems} />}
      </Layout>
      <Toast 
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </ThemeProvider>
  );
}
