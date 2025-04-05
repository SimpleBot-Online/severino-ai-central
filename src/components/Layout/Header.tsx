
import React, { useState } from 'react';
import { Menu, Bell, User, Settings, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/hooks/use-theme";

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { user, logout } = useAuthStore();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="bg-severino-gray border-b border-severino-lightgray py-4 px-6 flex items-center justify-between">
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="text-gray-300 hover:text-white mr-4 focus:outline-none md:hidden"
          aria-label="Toggle Sidebar"
        >
          <Menu size={24} />
        </button>
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Severino Logo" className="h-8 w-8" />
          <h1 className="text-xl font-semibold md:block hidden">Severino IA Central</h1>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="text-gray-300 hover:text-white focus:outline-none relative">
          <Bell size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-severino-pink rounded-full"></span>
        </button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center space-x-2 focus:outline-none">
              <div className="bg-severino-pink rounded-full w-8 h-8 flex items-center justify-center">
                <User size={16} />
              </div>
              <span className="text-sm hidden md:block">{user?.username || 'Usuário'}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-severino-gray border-severino-lightgray text-white">
            <DropdownMenuItem className="cursor-pointer hover:bg-severino-lightgray focus:bg-severino-lightgray">
              <User className="mr-2 h-4 w-4" />
              <span>Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="cursor-pointer hover:bg-severino-lightgray focus:bg-severino-lightgray"
              onClick={toggleTheme}
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>{theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-severino-lightgray" />
            <DropdownMenuItem 
              className="cursor-pointer text-severino-pink hover:bg-severino-lightgray focus:bg-severino-lightgray"
              onClick={logout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
