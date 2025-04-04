
import React from 'react';
import AppLayout from '../components/Layout/AppLayout';
import { useNotesStore } from '../store/dataStore';
import { useTasksStore } from '../store/dataStore';
import { useIdeasStore } from '../store/dataStore';
import { useChipInstancesStore } from '../store/dataStore';
import { 
  FileText, 
  CheckSquare, 
  Lightbulb, 
  Cpu,
  Calendar,
  Clock,
  ArrowUpRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { notes } = useNotesStore();
  const { tasks } = useTasksStore();
  const { ideas } = useIdeasStore();
  const { instances } = useChipInstancesStore();
  const navigate = useNavigate();

  const pendingTasks = tasks.filter(task => task.status === 'pending');
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress');
  const completedTasks = tasks.filter(task => task.status === 'completed');
  
  const activeChips = instances.filter(instance => instance.status === 'active');
  
  // Calculate due tasks for today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const dueTodayTasks = tasks.filter(task => {
    const taskDate = new Date(task.dueDate);
    taskDate.setHours(0, 0, 0, 0);
    return taskDate.getTime() === today.getTime() && task.status !== 'completed';
  });

  // Latest data
  const latestNotes = [...notes].sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  ).slice(0, 3);
  
  const latestIdeas = [...ideas].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 3);

  return (
    <AppLayout>
      <div className="animate-fadeIn">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="bg-severino-gray border-severino-lightgray">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total de Anotações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{notes.length}</div>
                <div className="p-2 bg-blue-500/20 rounded-full">
                  <FileText size={20} className="text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-severino-gray border-severino-lightgray">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Tarefas Pendentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{pendingTasks.length}</div>
                <div className="p-2 bg-yellow-500/20 rounded-full">
                  <CheckSquare size={20} className="text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-severino-gray border-severino-lightgray">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Ideias Registradas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{ideas.length}</div>
                <div className="p-2 bg-green-500/20 rounded-full">
                  <Lightbulb size={20} className="text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-severino-gray border-severino-lightgray">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Chips Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{activeChips.length}</div>
                <div className="p-2 bg-purple-500/20 rounded-full">
                  <Cpu size={20} className="text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Tasks Overview */}
          <Card className="bg-severino-gray border-severino-lightgray lg:col-span-2">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle>Visão Geral das Tarefas</CardTitle>
              <button 
                onClick={() => navigate('/tasks')}
                className="text-xs flex items-center text-severino-pink hover:underline"
              >
                Ver todas <ArrowUpRight size={14} className="ml-1" />
              </button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-severino-lightgray p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Pendentes</h3>
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs px-2 py-1 rounded-full">
                      {pendingTasks.length}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {pendingTasks.slice(0, 3).map(task => (
                      <div key={task.id} className="p-2 bg-severino-gray rounded-md">
                        <p className="text-sm font-medium truncate">{task.title}</p>
                        <div className="flex items-center text-xs text-gray-400 mt-1">
                          <Calendar size={12} className="mr-1" />
                          {new Date(task.dueDate).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                    {pendingTasks.length === 0 && (
                      <p className="text-sm text-gray-400">Nenhuma tarefa pendente</p>
                    )}
                  </div>
                </div>

                <div className="bg-severino-lightgray p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Em Progresso</h3>
                    <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-full">
                      {inProgressTasks.length}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {inProgressTasks.slice(0, 3).map(task => (
                      <div key={task.id} className="p-2 bg-severino-gray rounded-md">
                        <p className="text-sm font-medium truncate">{task.title}</p>
                        <div className="flex items-center text-xs text-gray-400 mt-1">
                          <Calendar size={12} className="mr-1" />
                          {new Date(task.dueDate).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                    {inProgressTasks.length === 0 && (
                      <p className="text-sm text-gray-400">Nenhuma tarefa em progresso</p>
                    )}
                  </div>
                </div>

                <div className="bg-severino-lightgray p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Concluídas</h3>
                    <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full">
                      {completedTasks.length}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {completedTasks.slice(0, 3).map(task => (
                      <div key={task.id} className="p-2 bg-severino-gray rounded-md">
                        <p className="text-sm font-medium truncate">{task.title}</p>
                        <div className="flex items-center text-xs text-gray-400 mt-1">
                          <Calendar size={12} className="mr-1" />
                          {new Date(task.dueDate).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                    {completedTasks.length === 0 && (
                      <p className="text-sm text-gray-400">Nenhuma tarefa concluída</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Today's Tasks */}
          <Card className="bg-severino-gray border-severino-lightgray">
            <CardHeader className="pb-2">
              <CardTitle>Tarefas para Hoje</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dueTodayTasks.map(task => (
                  <div key={task.id} className="flex items-center p-3 bg-severino-lightgray rounded-lg">
                    <div className={`w-3 h-3 rounded-full mr-3 ${
                      task.status === 'in-progress' ? 'bg-blue-400' : 'bg-yellow-400'
                    }`} />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{task.title}</p>
                      <p className="text-xs text-gray-400 truncate">{task.description}</p>
                    </div>
                    <div className="text-xs flex items-center text-gray-400">
                      <Clock size={12} className="mr-1" />
                      Hoje
                    </div>
                  </div>
                ))}
                {dueTodayTasks.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                    <Calendar size={24} className="mb-2" />
                    <p>Nenhuma tarefa para hoje</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Latest Notes */}
          <Card className="bg-severino-gray border-severino-lightgray">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle>Anotações Recentes</CardTitle>
              <button 
                onClick={() => navigate('/notes')}
                className="text-xs flex items-center text-severino-pink hover:underline"
              >
                Ver todas <ArrowUpRight size={14} className="ml-1" />
              </button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {latestNotes.map(note => (
                  <div key={note.id} className="p-3 bg-severino-lightgray rounded-lg">
                    <h4 className="font-medium mb-1">{note.title}</h4>
                    <p className="text-sm text-gray-400 line-clamp-2">{note.content}</p>
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      <Clock size={12} className="mr-1" />
                      Atualizado em {new Date(note.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
                {latestNotes.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                    <FileText size={24} className="mb-2" />
                    <p>Nenhuma anotação ainda</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Latest Ideas */}
          <Card className="bg-severino-gray border-severino-lightgray">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle>Ideias Recentes</CardTitle>
              <button 
                onClick={() => navigate('/ideas')}
                className="text-xs flex items-center text-severino-pink hover:underline"
              >
                Ver todas <ArrowUpRight size={14} className="ml-1" />
              </button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {latestIdeas.map(idea => (
                  <div key={idea.id} className="p-3 bg-severino-lightgray rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium">{idea.title}</h4>
                      <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full">
                        {idea.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 line-clamp-2">{idea.description}</p>
                  </div>
                ))}
                {latestIdeas.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                    <Lightbulb size={24} className="mb-2" />
                    <p>Nenhuma ideia registrada</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
