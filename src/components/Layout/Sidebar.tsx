
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
    { name: 'Central', path: '/dashboard', icon: <Home size={20} /> },
    { name: 'Caderninho', path: '/notes', icon: <FileText size={20} /> },
    { name: 'Pendências', path: '/tasks', icon: <CheckSquare size={20} /> },
    { name: 'Atalhos', path: '/links', icon: <LinkIcon size={20} /> },
    { name: 'Genius', path: '/ideas', icon: <Lightbulb size={20} /> },
    { name: 'SAC do Chefe', path: '/chat', icon: <MessageSquare size={20} /> },
    { name: 'PromptMaker', path: '/prompts', icon: <Terminal size={20} /> },
    { name: 'Banco de Talentos', path: '/saved-prompts', icon: <Book size={20} /> },
    { name: 'Afinador', path: '/assistants', icon: <Bot size={20} /> },
    { name: 'FARM (dev)', path: '/farm', icon: <Cpu size={20} /> },
    { name: 'OMR', path: '/melhor-robo', icon: <Globe size={20} /> },
    { name: 'N8N', path: '/simplebot', icon: <Bot size={20} /> },
    { name: 'BlackList', path: '/clients', icon: <Users size={20} /> },
    { name: 'Ajustes', path: '/settings', icon: <Settings size={20} /> },
  ];

  return (
    <aside className="flex h-full flex-col border-r border-green-500/30 bg-black">
      <div className="flex h-16 items-center justify-between border-b border-green-500/30 px-4">
        <div className={cn("flex items-center gap-2", collapsed && "justify-center")}>
          <img
            alt="Severino Logo"
            src="/lovable-uploads/667a36a4-8750-4dc1-9211-b92df611c69e.png"
            className="h-8 w-8 object-cover"
          />
          {!collapsed && (
            <span className="text-lg font-mono font-semibold text-green-500">
              MÓDULOS
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className={cn(
            "hidden lg:flex text-green-500 hover:bg-green-500/10 hover:text-green-400",
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
                  "flex items-center gap-3 rounded-none px-3 py-2 text-green-500/80 hover:bg-green-500/10 hover:text-green-400 font-mono",
                  "transition-colors duration-200",
                  (isActive || location.pathname === item.path) && "bg-green-500/10 text-green-400 border-l-2 border-green-500",
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

      <div className="border-t border-green-500/30 p-4">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-3 text-green-500/80 hover:bg-green-500/10 hover:text-green-400 font-mono",
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
            className="text-green-500"
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
