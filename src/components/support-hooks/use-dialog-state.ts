import { useState } from 'react';
import { Request } from '../../pages/support/all-support/makeData';

type DialogState = {
  postpone: { open: boolean; request: Request | null };
  reject: { open: boolean; request: Request | null };
  control: { open: boolean; request: Request | null };
};

export function useDialogs() {
  const [dialogs, setDialogs] = useState<DialogState>({
    postpone: { open: false, request: null },
    reject: { open: false, request: null },
    control: { open: false, request: null },
  });

  const openDialog = (dialogName: keyof DialogState, request: Request) => {
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

  return {
    dialogs,
    openDialog,
    closeDialog,
  };
}