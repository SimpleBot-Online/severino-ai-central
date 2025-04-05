
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  FileText, 
  CheckSquare, 
  Link as LinkIcon, 
  Lightbulb, 
  MessageSquare, 
  Terminal, 
  Cpu, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Bot
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface SidebarProps {
  collapsed: boolean;
  toggleSidebar: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, toggleSidebar }) => {
  const { logout } = useAuthStore();

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: <Home size={20} /> },
    { name: 'Anotações', path: '/notes', icon: <FileText size={20} /> },
    { name: 'Tarefas', path: '/tasks', icon: <CheckSquare size={20} /> },
    { name: 'Links Úteis', path: '/links', icon: <LinkIcon size={20} /> },
    { name: 'Ideias', path: '/ideas', icon: <Lightbulb size={20} /> },
    { name: 'Chat CEO', path: '/chat', icon: <MessageSquare size={20} /> },
    { name: 'Prompt Maker', path: '/prompts', icon: <Terminal size={20} /> },
    { name: 'Assistentes', path: '/assistants', icon: <Bot size={20} /> },
    { name: 'Aquecimento de Chips', path: '/chips', icon: <Cpu size={20} /> },
    { name: 'Configurações', path: '/settings', icon: <Settings size={20} /> },
  ];

  return (
    <aside 
      className={`bg-sidebar border-r border-sidebar-border transition-all duration-300 
                ${collapsed ? 'w-20' : 'w-64'} h-full z-10 fixed`}
    >
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center">
            <img src="/logo.png" alt="Severino Logo" className="h-8 w-8 mr-2" />
            <span className="text-primary font-bold text-xl">Severino IA</span>
          </div>
        )}
        {collapsed && <img src="/logo.png" alt="S" className="h-8 w-8 mx-auto" />}
        
        <button 
          className="text-primary hover:bg-sidebar-accent p-1 rounded-full focus:outline-none"
          onClick={toggleSidebar}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-2 px-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-md transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                  }`
                }
                title={collapsed ? item.name : ""}
              >
                <span className="mr-3">{item.icon}</span>
                {!collapsed && <span>{item.name}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <button
          onClick={logout}
          className="flex items-center w-full p-2 rounded-md hover:bg-sidebar-accent text-sidebar-foreground hover:text-sidebar-accent-foreground transition-colors"
          title={collapsed ? "Logout" : ""}
        >
          <span className="mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </span>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};
