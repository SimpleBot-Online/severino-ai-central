import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Save } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface NoteDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  note: { title: string; content: string };
  onNoteChange: (field: 'title' | 'content', value: string) => void;
  onSave: () => void;
  loading: boolean;
  saveButtonText: string;
  loadingText: string;
}

const NoteDialog: React.FC<NoteDialogProps> = ({
  isOpen,
  onOpenChange,
  title,
  description,
  note,
  onNoteChange,
  onSave,
  loading,
  saveButtonText,
  loadingText,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Título</label>
            <Input
              placeholder="Título da anotação"
              value={note.title}
              onChange={(e) => onNoteChange('title', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Conteúdo</label>
            <Textarea
              placeholder="Conteúdo da anotação"
              value={note.content}
              onChange={(e) => onNoteChange('content', e.target.value)}
              className="min-h-[150px]"
            />
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
            onClick={onSave}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                {loadingText}
              </>
            ) : (
              <>
                <Save size={16} className="mr-2" />
                {saveButtonText}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NoteDialog;
