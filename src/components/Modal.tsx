'use client';

import { ReactNode } from 'react';

interface ModalProps {
  id: string;
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: () => void;
  submitLabel?: string;
  saving?: boolean;
  children: ReactNode;
}

export default function Modal({ id, title, isOpen, onClose, onSubmit, submitLabel = 'Kaydet', saving, children }: ModalProps) {
  return (
    <div className={`modal-overlay${isOpen ? ' open' : ''}`} id={id} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose}><i className="fas fa-times"></i></button>
        </div>
        <form onSubmit={e => { e.preventDefault(); onSubmit?.(); }}>
          <div className="modal-body">{children}</div>
          <div className="modal-footer">
            <button className="btn btn-outline" type="button" onClick={onClose} disabled={saving}>İptal</button>
            <button className="btn btn-primary" type="submit" disabled={saving}>
              {saving ? <><i className="fas fa-spinner fa-spin"></i> Kaydediliyor...</> : <><i className="fas fa-save"></i> {submitLabel}</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
