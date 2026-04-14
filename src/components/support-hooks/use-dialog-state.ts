import { useState } from 'react';
import { Order } from '../../pages/support/makeData';

type DialogState = {
  postpone: { open: boolean; order: Order | null };
  accept: { open: boolean; order: Order | null };
  reject: { open: boolean; order: Order | null };
  close: { open: boolean; order: Order | null };
  control: { open: boolean; order: Order | null };
  confirm: { open: boolean; order: Order | null };
};

export function useDialogs() {
  const [dialogs, setDialogs] = useState<DialogState>({
    postpone: { open: false, order: null },
    accept: { open: false, order: null },
    reject: { open: false, order: null },
    close: { open: false, order: null },
    control: { open: false, order: null },
    confirm: { open: false, order: null },
  });

  const openDialog = (dialogName: keyof DialogState, order: Order) => {
    setDialogs(prev => ({
      ...prev,
      [dialogName]: { open: true, order }
    }));
  };

  const closeDialog = (dialogName: keyof DialogState) => {
    setDialogs(prev => ({
      ...prev,
      [dialogName]: { open: false, order: null }
    }));
  };

  const closeAllDialogs = () => {
    setDialogs({
      postpone: { open: false, order: null },
      accept: { open: false, order: null },
      reject: { open: false, order: null },
      close: { open: false, order: null },
      control: { open: false, order: null },
      confirm: { open: false, order: null },
    });
  };

  return {
    dialogs,
    openDialog,
    closeDialog,
    closeAllDialogs
  };
}