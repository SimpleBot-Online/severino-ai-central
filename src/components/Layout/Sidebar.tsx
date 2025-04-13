
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, FileText, CheckSquare, Link as LinkIcon, Lightbulb, MessageSquare, Terminal, Cpu, Settings, ChevronLeft, Book, Bot, Globe, Users } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SidebarProps {
  collapsed: boolean;
  toggleSidebar: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, toggleSidebar }) => {
  const { logout } = useAuthStore();
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <Home size={20} /> },
    { name: 'Anotações', path: '/notes', icon: <FileText size={20} /> },
    { name: 'Tarefas', path: '/tasks', icon: <CheckSquare size={20} /> },
    { name: 'Links Úteis', path: '/links', icon: <LinkIcon size={20} /> },
    { name: 'Ideias', path: '/ideas', icon: <Lightbulb size={20} /> },
    { name: 'Chat CEO', path: '/chat', icon: <MessageSquare size={20} /> },
    { name: 'Prompt Maker', path: '/prompts', icon: <Terminal size={20} /> },
    { name: 'Prompts Salvos', path: '/saved-prompts', icon: <Book size={20} /> },
    { name: 'Assistentes', path: '/assistants', icon: <Bot size={20} /> },
    { name: 'Aquecimento de Chips', path: '/farm', icon: <Cpu size={20} /> },
    { name: 'O Melhor Robô', path: '/melhor-robo', icon: <Globe size={20} /> },
    { name: 'SimpleBot', path: '/simplebot', icon: <Bot size={20} /> },
    { name: 'Quadro de Clientes', path: '/clients', icon: <Users size={20} /> },
    { name: 'Configurações', path: '/settings', icon: <Settings size={20} /> },
  ];

  return (
    <aside className="flex h-full flex-col border-r bg-card">
      <div className="flex h-16 items-center justify-between border-b px-4">
        <div className={cn("flex items-center gap-2", collapsed && "justify-center")}>
          <img
            alt="Severino Logo"
            src="/lovable-uploads/667a36a4-8750-4dc1-9211-b92df611c69e.png"
            className="h-8 w-8 object-cover"
          />
          {!collapsed && (
            <span className="text-lg font-semibold text-foreground">
              Severino+OMR
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className={cn(
            "hidden lg:flex",
            collapsed && "rotate-180",
            "transition-transform duration-200"
          )}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 py-2">
        <nav className="grid gap-1 px-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  "transition-colors duration-200",
                  (isActive || location.pathname === item.path) && "bg-accent text-accent-foreground",
                  collapsed && "justify-center"
                )
              }
              title={collapsed ? item.name : undefined}
            >
              {item.icon}
              {!collapsed && <span>{item.name}</span>}
            </NavLink>
          ))}
        </nav>
      </ScrollArea>

      <div className="border-t p-4">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-3 text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            collapsed && "justify-center"
          )}
          onClick={logout}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          {!collapsed && <span>Sair</span>}
        </Button>
      </div>
    </aside>
  );
};
