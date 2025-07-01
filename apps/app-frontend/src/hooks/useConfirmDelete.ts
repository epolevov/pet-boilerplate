import React from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { ConfirmDeleteDialogProps } from '../@core/types/confirm-remove';
import { ErrorResponse } from '../@core/types/fetch';

type UseConfirmDeleteProps = {
  onApplyDelete: (id: string) => void;
  onCloseDialog?: () => void;
};

function useConfirmDelete({
  onApplyDelete,
  onCloseDialog = () => {
    //
  },
}: UseConfirmDeleteProps): ConfirmDeleteDialogProps {
  const [open, setOpen] = React.useState(false);
  const [entityName, setEntityName] = React.useState('');
  const [entityId, setEntityId] = React.useState<string | null>(null);

  const openDialog = (id: string, name: string) => {
    setEntityId(id);
    setEntityName(name);
    setOpen(true);
  };

  const closeDialog = () => {
    setOpen(false);
    onCloseDialog();

    setTimeout(() => {
      setEntityId(null);
      setEntityName('');
    }, 200);
  };

  const onConfirm = async () => {
    if (!entityId) {
      return toast.error('No entityId entered for deletion!');
    }

    try {
      await onApplyDelete(entityId);

      closeDialog();

      toast.success('Successfully removed!');
    } catch (error: unknown) {
      if (axios.isAxiosError<ErrorResponse>(error) && error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Unknown error');
      }
    }
  };

  return { open, entityName, entityId, openDialog, closeDialog, onConfirm };
}

export default useConfirmDelete;
