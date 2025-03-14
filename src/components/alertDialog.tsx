import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface AlertDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (id: number) => void;
  itemId: number;
}

export default function AlertDialog({ open, onClose, onConfirm, itemId }: AlertDialogProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Excluir Item?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={() => onConfirm(itemId)} color="primary">
          Excluir
        </Button>
      </DialogActions>
    </Dialog>
  );
}
