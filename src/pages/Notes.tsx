
import React, { useState } from 'react';
import AppLayout from '../components/Layout/AppLayout';
import { useNotesStore } from '../store/dataStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  FileText 
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from '@/components/ui/use-toast';

const Notes = () => {
  const { notes, addNote, updateNote, deleteNote } = useNotesStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState<{ id: string; title: string; content: string } | null>(null);
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const { toast } = useToast();

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddNote = () => {
    if (!newNote.title.trim() || !newNote.content.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Título e conteúdo são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    addNote(newNote.title, newNote.content);
    setNewNote({ title: '', content: '' });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Anotação adicionada",
      description: "Sua anotação foi adicionada com sucesso.",
    });
  };

  const handleEditNote = () => {
    if (!currentNote || !currentNote.title.trim() || !currentNote.content.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Título e conteúdo são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    updateNote(currentNote.id, currentNote.title, currentNote.content);
    setCurrentNote(null);
    setIsEditDialogOpen(false);
    
    toast({
      title: "Anotação atualizada",
      description: "Sua anotação foi atualizada com sucesso.",
    });
  };

  const handleDeleteNote = () => {
    if (currentNote) {
      deleteNote(currentNote.id);
      setCurrentNote(null);
      setIsDeleteDialogOpen(false);
      
      toast({
        title: "Anotação excluída",
        description: "Sua anotação foi excluída com sucesso.",
      });
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
                className="pl-10 bg-severino-gray border-severino-lightgray"
              />
            </div>
            
            <Button 
              onClick={() => setIsAddDialogOpen(true)} 
              className="bg-severino-pink hover:bg-severino-pink/90"
            >
              <Plus size={18} className="mr-2" />
              Nova Anotação
            </Button>
          </div>
        </div>

        {filteredNotes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredNotes.map((note) => (
              <Card key={note.id} className="bg-severino-gray border-severino-lightgray hover:border-severino-pink/50 transition-colors">
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-lg line-clamp-1">{note.title}</h3>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => {
                          setCurrentNote({
                            id: note.id,
                            title: note.title,
                            content: note.content,
                          });
                          setIsEditDialogOpen(true);
                        }}
                        className="p-1.5 text-gray-400 hover:text-white rounded-full hover:bg-severino-lightgray"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setCurrentNote({
                            id: note.id,
                            title: note.title,
                            content: note.content,
                          });
                          setIsDeleteDialogOpen(true);
                        }}
                        className="p-1.5 text-gray-400 hover:text-red-400 rounded-full hover:bg-severino-lightgray"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-gray-300 text-sm line-clamp-4 mb-3">
                    {note.content}
                  </div>
                  
                  <div className="text-xs text-gray-400">
                    Atualizado em {new Date(note.updatedAt).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 bg-severino-gray rounded-lg">
            <FileText size={48} className="text-gray-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Nenhuma anotação encontrada</h3>
            <p className="text-gray-400 text-center mb-4">
              {searchTerm ? 'Nenhuma anotação corresponde à sua busca.' : 'Você ainda não tem nenhuma anotação.'}
            </p>
            <Button 
              onClick={() => setIsAddDialogOpen(true)} 
              className="bg-severino-pink hover:bg-severino-pink/90"
            >
              <Plus size={18} className="mr-2" />
              Criar Anotação
            </Button>
          </div>
        )}
      </div>

      {/* Add Note Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-severino-gray border-severino-lightgray sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nova Anotação</DialogTitle>
            <DialogDescription>
              Crie uma nova anotação para seu projeto.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Título</label>
              <Input
                placeholder="Título da anotação"
                value={newNote.title}
                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                className="bg-severino-lightgray border-severino-lightgray"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Conteúdo</label>
              <Textarea
                placeholder="Conteúdo da anotação"
                value={newNote.content}
                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                className="bg-severino-lightgray border-severino-lightgray min-h-[150px]"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              onClick={() => setIsAddDialogOpen(false)} 
              variant="outline"
              className="bg-severino-lightgray text-white border-severino-lightgray hover:bg-severino-lightgray/80"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleAddNote} 
              className="bg-severino-pink hover:bg-severino-pink/90"
            >
              <Save size={16} className="mr-2" />
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Note Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-severino-gray border-severino-lightgray sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Anotação</DialogTitle>
            <DialogDescription>
              Atualize sua anotação.
            </DialogDescription>
          </DialogHeader>
          
          {currentNote && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Título</label>
                <Input
                  placeholder="Título da anotação"
                  value={currentNote.title}
                  onChange={(e) => setCurrentNote({ ...currentNote, title: e.target.value })}
                  className="bg-severino-lightgray border-severino-lightgray"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Conteúdo</label>
                <Textarea
                  placeholder="Conteúdo da anotação"
                  value={currentNote.content}
                  onChange={(e) => setCurrentNote({ ...currentNote, content: e.target.value })}
                  className="bg-severino-lightgray border-severino-lightgray min-h-[150px]"
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              onClick={() => setIsEditDialogOpen(false)} 
              variant="outline"
              className="bg-severino-lightgray text-white border-severino-lightgray hover:bg-severino-lightgray/80"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleEditNote} 
              className="bg-severino-pink hover:bg-severino-pink/90"
            >
              <Save size={16} className="mr-2" />
              Atualizar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Note Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-severino-gray border-severino-lightgray sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Excluir Anotação</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir esta anotação? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          
          {currentNote && (
            <div className="py-4">
              <div className="p-3 bg-severino-lightgray rounded-lg">
                <h3 className="font-medium">{currentNote.title}</h3>
                <p className="text-sm text-gray-400 line-clamp-2 mt-1">{currentNote.content}</p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              onClick={() => setIsDeleteDialogOpen(false)} 
              variant="outline"
              className="bg-severino-lightgray text-white border-severino-lightgray hover:bg-severino-lightgray/80"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleDeleteNote} 
              variant="destructive"
            >
              <Trash2 size={16} className="mr-2" />
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default Notes;
