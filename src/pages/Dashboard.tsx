import React, { useMemo, useEffect } from 'react';
import AppLayout from '../components/Layout/AppLayout';
import {
  useNotesStore,
  useTasksStore,
  useIdeasStore,
  useChipInstancesStore,
  useSettingsStore
} from '../store/dataStore';
import {
  FileText,
  CheckSquare,
  Lightbulb,
  Cpu,
  Calendar,
  Clock,
  ArrowUpRight,
  Webhook,
  Zap,
  MessageSquare,
  Terminal,
  Database,
  Settings,
  BarChart
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/hooks/use-theme';
import { useToast } from '@/components/ui/use-toast';

const Dashboard = () => {
  const { notes } = useNotesStore();
  const { tasks } = useTasksStore();
  const { ideas } = useIdeasStore();
  const { instances } = useChipInstancesStore();
  const { settings, updateSettings } = useSettingsStore();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { toast } = useToast();

  // Check data persistence on component mount
  useEffect(() => {
    // Verify that data is being persisted correctly
    const storageKeys = [
      'severino-notes-storage',
      'severino-tasks-storage',
      'severino-ideas-storage',
      'severino-chip-instances-storage',
      'severino-settings-storage'
    ];

    const missingKeys = storageKeys.filter(key => !localStorage.getItem(key));

    if (missingKeys.length > 0) {
      toast({
        title: "Aviso de Armazenamento",
        description: "Alguns dados podem não estar sendo persistidos corretamente.",
        variant: "destructive"
      });
      console.warn("Missing storage keys:", missingKeys);
    }
  }, [toast]);

  // Memoize filtered and sorted data to prevent unnecessary recalculations
  const pendingTasks = useMemo(() => tasks.filter(task => task.status === 'pending'), [tasks]);
  const inProgressTasks = useMemo(() => tasks.filter(task => task.status === 'in-progress'), [tasks]);
  const completedTasks = useMemo(() => tasks.filter(task => task.status === 'completed'), [tasks]);

  const activeChips = useMemo(() => instances.filter(instance => instance.status === 'active'), [instances]);

  // Calculate due tasks for today
  const today = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);

  const dueTodayTasks = useMemo(() => tasks.filter(task => {
    const taskDate = new Date(task.dueDate);
    taskDate.setHours(0, 0, 0, 0);
    return taskDate.getTime() === today.getTime() && task.status !== 'completed';
  }), [tasks, today]);

  // Latest data
  const latestNotes = useMemo(() =>
    [...notes]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 3),
    [notes]
  );

  const latestIdeas = useMemo(() =>
    [...ideas]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3),
    [ideas]
  );

  // Calculate task completion rate
  const taskCompletionRate = useMemo(() => {
    if (tasks.length === 0) return 0;
    return Math.round((completedTasks.length / tasks.length) * 100);
  }, [tasks, completedTasks]);

  // Use cyber theme classes instead of severino classes
  const cardBgClass = 'bg-cyber-dark/80';
  const cardBorderClass = 'border-cyan-500/30';

  return (
    <AppLayout>
      <div className="animate-fadeIn">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Parquinho de Diversão</h1>
            <p className="text-gray-400 text-sm mt-1">Bem-vindo ao seu sonho!</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="terminal"
              size="sm"
              onClick={() => navigate('/settings')}
            >
              <Settings size={16} className="mr-2" />
              Configurações
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="terminal-header mb-3">
            <span>system_actions.sh</span>
          </div>
          <div className="terminal-command">
            <span className="terminal-prompt">atalhos_lindos</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            <Button
              onClick={() => navigate('/notes')}
              variant="outline"
              className={`h-auto flex flex-col items-center justify-center py-4 ${cardBgClass} hover:bg-cyan-500/10`}
            >
              <FileText className="h-6 w-6 mb-2 text-cyan-500" />
              <span className="text-xs">Notas</span>
            </Button>

            <Button
              onClick={() => navigate('/tasks')}
              variant="outline"
              className={`h-auto flex flex-col items-center justify-center py-4 ${cardBgClass} hover:bg-cyan-500/10`}
            >
              <CheckSquare className="h-6 w-6 mb-2 text-cyan-500" />
              <span className="text-xs">Tarefas</span>
            </Button>

            <Button
              onClick={() => navigate('/chat')}
              variant="outline"
              className={`h-auto flex flex-col items-center justify-center py-4 ${cardBgClass} hover:bg-cyan-500/10`}
            >
              <MessageSquare className="h-6 w-6 mb-2 text-cyan-500" />
              <span className="text-xs">Chat</span>
            </Button>

            <Button
              onClick={() => navigate('/farm')}
              variant="outline"
              className={`h-auto flex flex-col items-center justify-center py-4 ${cardBgClass} hover:bg-cyan-500/10`}
            >
              <Cpu className="h-6 w-6 mb-2 text-cyan-500" />
              <span className="text-xs">FARM</span>
            </Button>

            <Button
              onClick={() => navigate('/ideas')}
              variant="outline"
              className={`h-auto flex flex-col items-center justify-center py-4 ${cardBgClass} hover:bg-cyan-500/10`}
            >
              <Lightbulb className="h-6 w-6 mb-2 text-cyan-500" />
              <span className="text-xs">Ideias</span>
            </Button>

            <Button
              onClick={() => navigate('/settings')}
              variant="outline"
              className={`h-auto flex flex-col items-center justify-center py-4 ${cardBgClass} hover:bg-cyan-500/10`}
            >
              <Webhook className="h-6 w-6 mb-2 text-cyan-500" />
              <span className="text-xs">Integração</span>
            </Button>
          </div>
        </div>

        <div className="terminal-command mb-4">
          <span className="terminal-prompt">resumao_querido</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className={`${cardBgClass} ${cardBorderClass} hover:border-cyan-500/50 transition-all duration-300`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-cyan-400">Total de Anotações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{notes.length}</div>
                <div className="p-2 bg-cyan-500/20 rounded-full">
                  <FileText size={20} className="text-cyan-400" />
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-400">
                {notes.length > 0 ? `Última atualização: ${new Date(notes[0].updatedAt).toLocaleDateString()}` : 'Nenhuma anotação'}
              </div>
            </CardContent>
          </Card>

          <Card className={`${cardBgClass} ${cardBorderClass} hover:border-cyan-500/50 transition-all duration-300`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-cyan-400">Tarefas Pendentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{pendingTasks.length}</div>
                <div className="p-2 bg-cyan-500/20 rounded-full">
                  <CheckSquare size={20} className="text-cyan-400" />
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-400">
                {dueTodayTasks.length > 0 ? `${dueTodayTasks.length} para hoje` : 'Nenhuma tarefa para hoje'}
              </div>
            </CardContent>
          </Card>

          <Card className={`${cardBgClass} ${cardBorderClass} hover:border-cyan-500/50 transition-all duration-300`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-cyan-400">Ideias Registradas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{ideas.length}</div>
                <div className="p-2 bg-cyan-500/20 rounded-full">
                  <Lightbulb size={20} className="text-cyan-400" />
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-400">
                {ideas.length > 0 ? `Última ideia: ${new Date(ideas[0].createdAt).toLocaleDateString()}` : 'Nenhuma ideia'}
              </div>
            </CardContent>
          </Card>

          <Card className={`${cardBgClass} ${cardBorderClass} hover:border-cyan-500/50 transition-all duration-300`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-cyan-400">Progresso de Tarefas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{taskCompletionRate}%</div>
                <div className="p-2 bg-cyan-500/20 rounded-full">
                  <BarChart size={20} className="text-cyan-400" />
                </div>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2">
                <div
                  className="bg-cyan-500 h-2.5 rounded-full"
                  style={{ width: `${taskCompletionRate}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Tasks Overview */}
          <Card className={`${cardBgClass} ${cardBorderClass} lg:col-span-2 hover:border-cyan-500/50 transition-all duration-300`}>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-cyan-400">Visão Geral das Tarefas</CardTitle>
              <Button
                onClick={() => navigate('/tasks')}
                variant="ghost"
                size="sm"
                className="text-xs flex items-center text-cyan-500 hover:text-cyan-400"
              >
                Ver todas <ArrowUpRight size={14} className="ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-cyber-dark/60 border border-cyan-500/20 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-cyan-400">Pendentes</h3>
                    <span className="bg-cyan-500/20 text-cyan-400 text-xs px-2 py-1 rounded-full">
                      {pendingTasks.length}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {pendingTasks.slice(0, 3).map(task => (
                      <div key={task.id} className="p-2 bg-cyber-dark/80 border border-cyan-500/10 rounded-md hover:border-cyan-500/30 transition-colors">
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

                <div className="bg-cyber-dark/60 border border-cyan-500/20 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-cyan-400">Em Progresso</h3>
                    <span className="bg-cyan-500/20 text-cyan-400 text-xs px-2 py-1 rounded-full">
                      {inProgressTasks.length}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {inProgressTasks.slice(0, 3).map(task => (
                      <div key={task.id} className="p-2 bg-cyber-dark/80 border border-cyan-500/10 rounded-md hover:border-cyan-500/30 transition-colors">
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

                <div className="bg-cyber-dark/60 border border-cyan-500/20 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-cyan-400">Concluídas</h3>
                    <span className="bg-cyan-500/20 text-cyan-400 text-xs px-2 py-1 rounded-full">
                      {completedTasks.length}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {completedTasks.slice(0, 3).map(task => (
                      <div key={task.id} className="p-2 bg-cyber-dark/80 border border-cyan-500/10 rounded-md hover:border-cyan-500/30 transition-colors">
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
          <Card className={`${cardBgClass} ${cardBorderClass} hover:border-cyan-500/50 transition-all duration-300`}>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-cyan-400">Tarefas para Hoje</CardTitle>
              <span className="text-xs text-gray-400">{new Date().toLocaleDateString()}</span>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dueTodayTasks.map(task => (
                  <div key={task.id} className="flex items-center p-3 bg-cyber-dark/60 border border-cyan-500/20 rounded-lg hover:border-cyan-500/40 transition-colors">
                    <div className={`w-3 h-3 rounded-full mr-3 ${
                      task.status === 'in-progress' ? 'bg-cyan-400' : 'bg-cyan-500'
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
                    <Calendar size={24} className="mb-2 text-cyan-500/50" />
                    <p>Nenhuma tarefa para hoje</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className={`${cardBgClass} ${cardBorderClass} mb-6 hover:border-cyan-500/50 transition-all duration-300`}>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-cyan-400">
              <Webhook className="mr-2 text-cyan-500" size={20} />
              Integração Evolution API
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-gray-300">
                Configure a integração com a Evolution API para automação de WhatsApp e comunicação via webhooks.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Card className="bg-cyber-dark/60 border border-cyan-500/20 hover:border-cyan-500/40 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-sm text-cyan-400">Webhooks</h3>
                      <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
                    </div>
                    <p className="text-xs text-gray-400 mb-2">Receba eventos do WhatsApp em tempo real</p>
                    <Button
                      variant="terminal"
                      size="sm"
                      className="w-full text-xs"
                      onClick={() => navigate('/settings')}
                    >
                      Configurar
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-cyber-dark/60 border border-cyan-500/20 hover:border-cyan-500/40 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-sm text-cyan-400">Farm</h3>
                      <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
                    </div>
                    <p className="text-xs text-gray-400 mb-2">Gerencie instâncias de WhatsApp</p>
                    <Button
                      variant="terminal"
                      size="sm"
                      className="w-full text-xs"
                      onClick={() => navigate('/farm')}
                    >
                      Gerenciar
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-cyber-dark/60 border border-cyan-500/20 hover:border-cyan-500/40 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-sm text-cyan-400">API Key</h3>
                      <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
                    </div>
                    <p className="text-xs text-gray-400 mb-2">Configure sua chave de API</p>
                    <Button
                      variant="terminal"
                      size="sm"
                      className="w-full text-xs"
                      onClick={() => navigate('/settings')}
                    >
                      Configurar
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Latest Notes */}
          <Card className={`${cardBgClass} ${cardBorderClass} hover:border-cyan-500/50 transition-all duration-300`}>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-cyan-400">Anotações Recentes</CardTitle>
              <Button
                onClick={() => navigate('/notes')}
                variant="ghost"
                size="sm"
                className="text-xs flex items-center text-cyan-500 hover:text-cyan-400"
              >
                Ver todas <ArrowUpRight size={14} className="ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {latestNotes.map(note => (
                  <div key={note.id} className="p-3 bg-cyber-dark/60 border border-cyan-500/20 rounded-lg hover:border-cyan-500/40 transition-colors">
                    <h4 className="font-medium mb-1 text-cyan-400">{note.title}</h4>
                    <p className="text-sm text-gray-300 line-clamp-2">{note.content}</p>
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      <Clock size={12} className="mr-1" />
                      Atualizado em {new Date(note.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
                {latestNotes.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                    <FileText size={24} className="mb-2 text-cyan-500/50" />
                    <p>Nenhuma anotação ainda</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Latest Ideas */}
          <Card className={`${cardBgClass} ${cardBorderClass} hover:border-cyan-500/50 transition-all duration-300`}>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-cyan-400">Ideias Recentes</CardTitle>
              <Button
                onClick={() => navigate('/ideas')}
                variant="ghost"
                size="sm"
                className="text-xs flex items-center text-cyan-500 hover:text-cyan-400"
              >
                Ver todas <ArrowUpRight size={14} className="ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {latestIdeas.map(idea => (
                  <div key={idea.id} className="p-3 bg-cyber-dark/60 border border-cyan-500/20 rounded-lg hover:border-cyan-500/40 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-cyan-400">{idea.title}</h4>
                      <span className="bg-cyan-500/20 text-cyan-400 text-xs px-2 py-1 rounded-full">
                        {idea.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 line-clamp-2">{idea.description}</p>
                  </div>
                ))}
                {latestIdeas.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                    <Lightbulb size={24} className="mb-2 text-cyan-500/50" />
                    <p>Nenhuma ideia registrada</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Persistence Status */}
        <div className="mt-8 text-xs text-gray-500 flex items-center justify-center">
          <Database size={12} className="mr-1 text-cyan-500/50" />
          <span>Dados armazenados localmente</span>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
