'use client';

import { ReactNode, useEffect, useRef } from 'react';

import styles from './modal.module.scss';

interface ModalProps {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

export const Modal = ({ children, isOpen, onClose, title }: ModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    if (isOpen && !dialog.open) {
      dialog.showModal();
    }

    if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  return (
    <dialog aria-label={title} className={styles.dialog} onClose={onClose} ref={dialogRef}>
      <div className={styles.content}>
        <h2 className={styles.title}>{title}</h2>
        {children}
      </div>
    </dialog>
  );
};
