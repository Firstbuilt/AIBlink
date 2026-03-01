import React, { useState } from 'react';
import { Plus, X, Link as LinkIcon, Trash2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface Link {
  name: string;
  url: string;
}

interface LinkManagerProps {
  links: Link[];
  onSave: (links: Link[]) => void;
}

export const LinkManager = ({ links, onSave }: LinkManagerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newLink, setNewLink] = useState({ name: '', url: '' });
  const { t } = useLanguage();

  const handleAdd = () => {
    if (newLink.name && newLink.url) {
      const updated = [...links, newLink];
      onSave(updated);
      setNewLink({ name: '', url: '' });
    }
  };

  const handleDelete = (index: number) => {
    const updated = links.filter((_, i) => i !== index);
    onSave(updated);
  };

  return (
    <div className="relative inline-block">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-indigo-600 transition-colors ${links.length === 0 ? 'px-2' : ''}`}
      >
        <Plus size={14} />
        {links.length === 0 && <span className="text-xs font-medium">{t('Add Link', '添加链接')}</span>}
      </button>

      {isOpen && (
        <div className="absolute left-0 bottom-full mb-2 z-50 w-72 bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 p-4">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{t('Manage Links', '管理链接')}</h4>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
              <X size={14} />
            </button>
          </div>

          <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
            {links.map((link, i) => (
              <div key={i} className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 p-2 rounded text-xs">
                <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline truncate max-w-[180px]">
                  {link.name}
                </a>
                <button onClick={() => handleDelete(i)} className="text-slate-400 hover:text-rose-500">
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
            {links.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-2">{t('No custom links', '暂无自定义链接')}</p>
            )}
          </div>

          <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3">
            <input
              type="text"
              placeholder={t('Link Name', '链接名称')}
              className="w-full text-xs p-2 rounded border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
              value={newLink.name}
              onChange={e => setNewLink({ ...newLink, name: e.target.value })}
            />
            <input
              type="text"
              placeholder={t('URL', '链接地址')}
              className="w-full text-xs p-2 rounded border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
              value={newLink.url}
              onChange={e => setNewLink({ ...newLink, url: e.target.value })}
            />
            <button
              onClick={handleAdd}
              disabled={!newLink.name || !newLink.url}
              className="w-full bg-indigo-600 text-white text-xs py-1.5 rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {t('Add Link', '添加链接')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
