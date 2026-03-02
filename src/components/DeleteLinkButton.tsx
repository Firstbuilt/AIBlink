import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { ConfirmationModal } from './ConfirmationModal';

interface DeleteLinkButtonProps {
  onDelete: () => void;
  className?: string;
}

export const DeleteLinkButton = ({ onDelete, className }: DeleteLinkButtonProps) => {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const { t } = useLanguage();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsConfirmModalOpen(true);
  };

  const handleConfirm = () => {
    onDelete();
    setIsConfirmModalOpen(false);
  };

  return (
    <>
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirm}
        title={t('Remove Link', '删除链接')}
        message={t("Your deletion will take effect in real-time and be visible to other users. Please proceed with caution!", "你的删除操作将会实时生效，其他用户能同步看到该变更，请谨慎操作！")}
        confirmText={t('Delete', '删除')}
        type="danger"
      />
      <button
        onClick={handleClick}
        className={className}
        title={t('Remove Link', '删除链接')}
      >
        <X size={10} />
      </button>
    </>
  );
};
