
import React, { useState } from 'react';
import { Menu, Bell, User, Settings, LogOut, Moon, Sun } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
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
    <header className="bg-card border-b border-border py-4 px-6 flex items-center justify-between">
      <div className="flex items-center">
        <button onClick={toggleSidebar} className="text-foreground hover:text-primary mr-4 focus:outline-none md:hidden" aria-label="Toggle Sidebar">
          <Menu size={24} />
        </button>
        <div className="flex items-center gap-2">
          <img alt="Severino Logo" src="/lovable-uploads/b78248f0-9127-4245-8146-41531235c56f.png" className="h-8 w-8 object-cover" />
          <h1 className="text-xl font-semibold md:block hidden">Severino IA Central</h1>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <button 
          onClick={toggleTheme} 
          className="text-foreground hover:text-primary focus:outline-none"
          aria-label={theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        
        <button className="text-foreground hover:text-primary focus:outline-none relative">
          <Bell size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-severino-pink rounded-full"></span>
        </button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center space-x-2 focus:outline-none">
              <div className="bg-severino-pink rounded-full w-8 h-8 flex items-center justify-center">
                <User size={16} />
              </div>
              <span className="text-sm hidden md:block">{user?.email ? user.email.split('@')[0] : 'Usuário'}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={toggleTheme}>
              <Settings className="mr-2 h-4 w-4" />
              <span>{theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-severino-pink" onClick={logout}>
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
