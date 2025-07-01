export interface ConfirmDeleteDialogProps {
  open: boolean;
  openDialog: (id: string, name: string) => void;
  closeDialog: () => void;
  onConfirm: () => void;
  entityName: string;
  entityId: string | null;
  description?: string;
}
