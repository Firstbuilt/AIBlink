import React, { useState } from 'react';
import { Edit2, Check, X, Trash2, Link as LinkIcon } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface LinkManagerProps {
  currentUrl?: string;
  searchQuery?: string;
  onSave: (url: string) => void;
  onRemove?: () => void;
}

export const LinkManager = ({ currentUrl, searchQuery, onSave, onRemove }: LinkManagerProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [url, setUrl] = useState(currentUrl || "");
  const { t } = useLanguage();

  const handleSave = () => {
    onSave(url);
    setIsEditing(false);
  };

  const handleRemove = () => {
    if (onRemove) {
      onRemove();
    }
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="relative inline-flex items-center gap-1 bg-white dark:bg-slate-800 p-1 rounded shadow-lg border border-slate-200 dark:border-slate-700 ml-2">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-48 text-xs p-1 rounded border border-slate-300 dark:border-slate-600 bg-transparent focus:outline-none focus:border-indigo-500"
          placeholder="https://..."
          autoFocus
        />
        <button 
          onClick={handleSave} 
          className="p-1 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded transition-colors"
          title={t('Save', '保存')}
        >
          <Check size={14} />
        </button>
        <button 
          onClick={() => setIsEditing(false)} 
          className="p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
          title={t('Cancel', '取消')}
        >
          <X size={14} />
        </button>
        {onRemove && (
          <button 
            onClick={handleRemove} 
            className="p-1 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded transition-colors"
            title={t('Remove Link', '移除链接')}
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
    );
  }

  return (
    <button 
      onClick={() => {
        setUrl(currentUrl || "");
        setIsEditing(true);
      }}
      className="p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors ml-2 opacity-0 group-hover:opacity-100"
      title={t('Edit Link', '编辑链接')}
    >
      <Edit2 size={14} />
    </button>
  );
};
