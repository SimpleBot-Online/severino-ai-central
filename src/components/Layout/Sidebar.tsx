
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
  Menu,
  X
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

interface SidebarProps {
  collapsed: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const { logout } = useAuthStore();

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: <Home size={20} /> },
    { name: 'Anotações', path: '/notes', icon: <FileText size={20} /> },
    { name: 'Tarefas', path: '/tasks', icon: <CheckSquare size={20} /> },
    { name: 'Links Úteis', path: '/links', icon: <LinkIcon size={20} /> },
    { name: 'Ideias', path: '/ideas', icon: <Lightbulb size={20} /> },
    { name: 'Chat CEO', path: '/chat', icon: <MessageSquare size={20} /> },
    { name: 'Prompt Maker', path: '/prompts', icon: <Terminal size={20} /> },
    { name: 'Aquecimento de Chips', path: '/chips', icon: <Cpu size={20} /> },
    { name: 'Configurações', path: '/settings', icon: <Settings size={20} /> },
  ];

  return (
    <aside 
      className={`bg-severino-dark border-r border-severino-lightgray transition-all duration-300 
                ${collapsed ? 'w-20' : 'w-64'} flex flex-col fixed h-full z-10`}
    >
      <div className="flex items-center justify-between p-4 border-b border-severino-lightgray">
        {!collapsed && (
          <div className="flex items-center">
            <span className="text-severino-pink font-bold text-xl">Severino IA</span>
          </div>
        )}
        {collapsed && <span className="text-severino-pink font-bold mx-auto">S</span>}
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
                      ? 'bg-severino-pink text-white'
                      : 'text-gray-300 hover:bg-severino-gray hover:text-white'
                  }`
                }
              >
                <span className="mr-3">{item.icon}</span>
                {!collapsed && <span>{item.name}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-severino-lightgray">
        <button
          onClick={logout}
          className="flex items-center w-full p-2 rounded-md hover:bg-severino-gray text-gray-300 hover:text-white transition-colors"
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
