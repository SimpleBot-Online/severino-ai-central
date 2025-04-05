
import React from 'react';
import { Menu, Bell, User } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { user } = useAuthStore();

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
        <h1 className="text-xl font-semibold md:block hidden">Severino IA Central</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="text-gray-300 hover:text-white focus:outline-none relative">
          <Bell size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-severino-pink rounded-full"></span>
        </button>
        
        <div className="flex items-center space-x-2">
          <div className="bg-severino-pink rounded-full w-8 h-8 flex items-center justify-center">
            <User size={16} />
          </div>
          <span className="text-sm hidden md:block">{user?.username || 'Usuário'}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
