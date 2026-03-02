import React, { useState, useRef, useEffect } from 'react';
import { StickyNote, Edit2, ChevronUp, ChevronDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { cn } from '../lib/utils';
import { ConfirmationModal } from './ConfirmationModal';

interface NoteSectionProps {
  areaName: string;
  initialNote?: string;
  onSave: (note: string) => void;
}

export const NoteSection = ({ areaName, initialNote, onSave }: NoteSectionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [note, setNote] = useState(initialNote || "");
  const [isExpanded, setIsExpanded] = useState(false);
  const { t } = useLanguage();
  const textRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showExpandButton, setShowExpandButton] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

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

  const handleEditClick = () => {
    setIsConfirmModalOpen(true);
  };

  const handleConfirmEdit = () => {
    setIsEditing(true);
    setIsConfirmModalOpen(false);
  };

  return (
    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/50">
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmEdit}
        title={t('Edit Note', '编辑备注')}
        message={t("Any changes you make will take effect after saving and be visible to other users. Please proceed with caution!", "你所做的任何变更将会在保存后生效，其他用户能同步看到该变更，请谨慎操作！")}
        confirmText={t('Continue', '继续')}
        type="warning"
      />

      {!isEditing && !note && (
        <button 
          onClick={handleEditClick}
          className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <StickyNote size={14} />
          {t('Add Note', '添加备注')}
        </button>
      )}

      {!isEditing && note && (
        <div className="group relative bg-yellow-50 dark:bg-yellow-900/10 p-3 rounded-lg border border-yellow-100 dark:border-yellow-900/30">
          <button 
            onClick={handleEditClick}
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
