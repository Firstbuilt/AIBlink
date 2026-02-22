import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Updates } from './pages/Updates';
import { KnowledgeBase } from './pages/KnowledgeBase';
import { KnowledgeItem, UpdateItem, RiskReport } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>([]);
  const [updates, setUpdates] = useState<UpdateItem[]>([]);
  const [report, setReport] = useState<RiskReport | null>(null);

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
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/refresh', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        // Re-fetch all data to ensure sync
        await fetchData();
      }
    } catch (error) {
      console.error("Refresh failed", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <ThemeProvider>
      <LanguageProvider>
        <Layout 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
        >
          {activeTab === 'dashboard' && <Dashboard report={report} />}
          {activeTab === 'updates' && <Updates updates={updates} />}
          {activeTab === 'knowledge' && <KnowledgeBase items={knowledgeItems} />}
        </Layout>
      </LanguageProvider>
    </ThemeProvider>
  );
}
