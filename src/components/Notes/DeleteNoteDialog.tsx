import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DeleteNoteDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  note: { title: string; content: string } | null;
  onDelete: () => void;
  loading: boolean;
}

const DeleteNoteDialog: React.FC<DeleteNoteDialogProps> = ({
  isOpen,
  onOpenChange,
  note,
  onDelete,
  loading,
}) => {
  if (!note) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Excluir Anotação</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir esta anotação? Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="p-3 bg-muted rounded-lg">
            <h3 className="font-medium">{note.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{note.content}</p>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={() => onOpenChange(false)}
            variant="outline"
          >
            Cancelar
          </Button>
          <Button
            onClick={onDelete}
            variant="destructive"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                Excluindo...
              </>
            ) : (
              <>
                <Trash2 size={16} className="mr-2" />
                Excluir
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteNoteDialog;
