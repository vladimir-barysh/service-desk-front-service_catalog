import { useState } from 'react';
import { Order } from '../../pages/support/all-support/makeData';

type DialogState = {
  postpone: { open: boolean; request: Order | null };
  accept: { open: boolean; request: Order | null };
  reject: { open: boolean; request: Order | null };
  close: { open: boolean; request: Order | null };
  control: { open: boolean; request: Order | null };
  confirm: { open: boolean; request: Order | null };
};

export function useDialogs() {
  const [dialogs, setDialogs] = useState<DialogState>({
    postpone: { open: false, request: null },
    accept: { open: false, request: null },
    reject: { open: false, request: null },
    close: { open: false, request: null },
    control: { open: false, request: null },
    confirm: { open: false, request: null },
  });

  const openDialog = (dialogName: keyof DialogState, request: Order) => {
    setDialogs(prev => ({
      ...prev,
      [dialogName]: { open: true, request }
    }));
  };

  const closeDialog = (dialogName: keyof DialogState) => {
    setDialogs(prev => ({
      ...prev,
      [dialogName]: { open: false, request: null }
    }));
  };

  const closeAllDialogs = () => {
    setDialogs({
      postpone: { open: false, request: null },
      accept: { open: false, request: null },
      reject: { open: false, request: null },
      close: { open: false, request: null },
      control: { open: false, request: null },
      confirm: { open: false, request: null },
    });
  };

  return {
    dialogs,
    openDialog,
    closeDialog,
    closeAllDialogs
  };
}