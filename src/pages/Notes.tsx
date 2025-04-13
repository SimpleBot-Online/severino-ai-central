
import React, { useState, useEffect, useCallback } from 'react';
import AppLayout from '../components/Layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  FileText,
  Loader2
} from 'lucide-react';
import NoteDialog from '@/components/Notes/NoteDialog';
import DeleteNoteDialog from '@/components/Notes/DeleteNoteDialog';
import { useToast } from '@/components/ui/use-toast';
import { useAuthStore } from '@/store/authStore';
import { useNotesStore } from '@/store/dataStore';
import { Note } from '@/types';
import { getNotes, createNote, updateNote, deleteNote } from '@/services/databaseService';

const Notes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState<{ id: string; title: string; content: string } | null>(null);
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [notesPerPage] = useState(10);
  const { toast } = useToast();
  const { userId } = useAuthStore();
  const notesStore = useNotesStore();

  // Calculate pagination
  const filteredNotes = searchTerm
    ? notes.filter(note =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (note.content && note.content.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : notes;

  const indexOfLastNote = currentPage * notesPerPage;
  const indexOfFirstNote = indexOfLastNote - notesPerPage;
  const currentNotes = filteredNotes.slice(indexOfFirstNote, indexOfLastNote);
  const totalPages = Math.ceil(filteredNotes.length / notesPerPage);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const fetchNotes = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const data = await getNotes(userId);
      setNotes(data || []);
      setCurrentPage(1); // Reset to first page when fetching new data
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "Erro ao carregar anotações",
        description: error.message || "Ocorreu um erro ao carregar suas anotações.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [userId, toast]);

  useEffect(() => {
    fetchNotes();
  }, [userId, fetchNotes]);

  // Use the notes from the store directly
  useEffect(() => {
    // Update notes when the component mounts and whenever the store changes
    const storeNotes = notesStore.notes;
    if (storeNotes && storeNotes.length > 0) {
      setNotes(storeNotes);
    }
  }, [notesStore.notes]);

  // Helper functions for opening dialogs
  const handleOpenEditDialog = (note: Note) => {
    setCurrentNote({
      id: note.id,
      title: note.title,
      content: note.content || '',
    });
    setIsEditDialogOpen(true);
  };

  const handleOpenDeleteDialog = (note: Note) => {
    setCurrentNote({
      id: note.id,
      title: note.title,
      content: note.content || '',
    });
    setIsDeleteDialogOpen(true);
  };

  const handleAddNote = async () => {
    if (!userId) return;

    if (!newNote.title.trim() || !newNote.content.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Título e conteúdo são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    try {
      setActionLoading(true);

      await createNote(userId, {
        title: newNote.title,
        content: newNote.content
      });

      setNewNote({ title: '', content: '' });
      setIsAddDialogOpen(false);

      toast({
        title: "Anotação adicionada",
        description: "Sua anotação foi adicionada com sucesso.",
      });

      fetchNotes();
    } catch (error: any) {
      console.error('Error adding note:', error);
      toast({
        title: "Erro ao adicionar anotação",
        description: error.message || "Ocorreu um erro ao adicionar sua anotação.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditNote = async () => {
    if (!userId || !currentNote) return;

    if (!currentNote.title.trim() || !currentNote.content.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Título e conteúdo são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    try {
      setActionLoading(true);

      await updateNote(currentNote.id, {
        title: currentNote.title,
        content: currentNote.content
      });

      setCurrentNote(null);
      setIsEditDialogOpen(false);

      toast({
        title: "Anotação atualizada",
        description: "Sua anotação foi atualizada com sucesso.",
      });

      fetchNotes();
    } catch (error: any) {
      console.error('Error updating note:', error);
      toast({
        title: "Erro ao atualizar anotação",
        description: error.message || "Ocorreu um erro ao atualizar sua anotação.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteNote = async () => {
    if (!userId || !currentNote) return;

    try {
      setActionLoading(true);

      await deleteNote(currentNote.id);

      setCurrentNote(null);
      setIsDeleteDialogOpen(false);

      toast({
        title: "Anotação excluída",
        description: "Sua anotação foi excluída com sucesso.",
      });

      fetchNotes();
    } catch (error: any) {
      console.error('Error deleting note:', error);
      toast({
        title: "Erro ao excluir anotação",
        description: error.message || "Ocorreu um erro ao excluir sua anotação.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
      setCurrentNote(null);
    }
  };

  return (
    <AppLayout>
      <div className="animate-fadeIn">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Anotações</h1>

          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 w-full md:w-auto mt-4 md:mt-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Buscar anotações..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Button
              onClick={() => setIsAddDialogOpen(true)}
            >
              <Plus size={18} className="mr-2" />
              Nova Anotação
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 bg-card rounded-lg">
            <Loader2 size={48} className="text-primary animate-spin mb-4" />
            <h3 className="text-xl font-semibold mb-2">Carregando anotações</h3>
            <p className="text-muted-foreground text-center">
              Aguarde enquanto carregamos suas anotações...
            </p>
          </div>
        ) : filteredNotes.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentNotes.map((note) => (
              <Card key={note.id} className="hover:border-primary/50 transition-colors">
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-lg line-clamp-1">{note.title}</h3>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleOpenEditDialog(note)}
                        className="p-1.5 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleOpenDeleteDialog(note)}
                        className="p-1.5 text-muted-foreground hover:text-destructive rounded-full hover:bg-muted"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="text-foreground/80 text-sm line-clamp-4 mb-3">
                    {note.content}
                  </div>

                  <div className="text-xs text-muted-foreground">
                    Atualizado em {note.updatedAt instanceof Date
                      ? note.updatedAt.toLocaleDateString()
                      : new Date(note.updatedAt).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <div className="flex space-x-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => paginate(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    Anterior
                  </Button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                    <Button
                      key={number}
                      variant={currentPage === number ? "default" : "outline"}
                      size="sm"
                      onClick={() => paginate(number)}
                    >
                      {number}
                    </Button>
                  ))}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Próxima
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 bg-card rounded-lg">
            <FileText size={48} className="text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Nenhuma anotação encontrada</h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchTerm ? 'Nenhuma anotação corresponde à sua busca.' : 'Você ainda não tem nenhuma anotação.'}
            </p>
            <Button
              onClick={() => setIsAddDialogOpen(true)}
            >
              <Plus size={18} className="mr-2" />
              Criar Anotação
            </Button>
          </div>
        )}
      </div>

      {/* Add Note Dialog */}
      <NoteDialog
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        title="Nova Anotação"
        description="Crie uma nova anotação para seu projeto."
        note={newNote}
        onNoteChange={(field, value) => setNewNote({ ...newNote, [field]: value })}
        onSave={handleAddNote}
        loading={actionLoading}
        saveButtonText="Salvar"
        loadingText="Salvando..."
      />

      {/* Edit Note Dialog */}
      {currentNote && (
        <NoteDialog
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          title="Editar Anotação"
          description="Atualize sua anotação."
          note={currentNote}
          onNoteChange={(field, value) => setCurrentNote({ ...currentNote, [field]: value })}
          onSave={handleEditNote}
          loading={actionLoading}
          saveButtonText="Atualizar"
          loadingText="Atualizando..."
        />
      )}

      {/* Delete Note Dialog */}
      <DeleteNoteDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        note={currentNote}
        onDelete={handleDeleteNote}
        loading={actionLoading}
      />
    </AppLayout>
  );
};

export default Notes;
