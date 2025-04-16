import React, { useState, useEffect } from 'react';
import { Menu, Bell, User, Settings, LogOut, Terminal, Shield } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/components/NotificationProvider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/hooks/use-toast';
import { playNotificationSound } from '@/services/notificationService';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { userId, logout } = useAuthStore();
  const navigate = useNavigate();
  const { notifications, dismissNotification } = useNotifications();
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (notifications) {
      setUnreadCount(notifications.length);
      
      if (notifications.length > 0) {
        playNotificationSound();
      }
    }
  }, [notifications]);

  const handleNotificationClick = (id: string) => {
    dismissNotification(id);
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b border-green-500/30 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60">
      <div className="container flex h-16 items-center px-4">
        <button
          onClick={toggleSidebar}
          className="lg:hidden mr-2 rounded-sm p-2 text-green-500 hover:bg-green-500/10"
          aria-label="Toggle Sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 flex-1">
          <Terminal className="h-5 w-5 text-green-500 hidden sm:block" />
          <h1 className="text-xl font-mono text-green-500 hidden md:block">Campo de Batalha</h1>
        </div>

        <div className="flex items-center gap-2">
          <Popover open={showNotifications} onOpenChange={setShowNotifications}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative text-green-500 hover:text-green-400 hover:bg-green-500/10"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 bg-black border border-green-500/30" align="end" sideOffset={8}>
              <div className="flex items-center justify-between p-2 border-b border-green-500/20">
                <h4 className="font-medium text-green-400">Notificações</h4>
                {unreadCount > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400">
                    {unreadCount} novas
                  </span>
                )}
              </div>
              <ScrollArea className="h-80">
                {notifications && notifications.length > 0 ? (
                  <div className="flex flex-col gap-1 p-1">
                    {notifications.map((notification) => (
                      <button
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification.id)}
                        className="flex flex-col gap-1 p-3 text-left hover:bg-green-500/10 rounded-md border border-green-500/10"
                      >
                        <div className="flex justify-between items-start">
                          <h5 className="font-medium text-green-400 text-sm">{notification.title}</h5>
                          <span className="text-xs text-green-500/60">
                            {new Date().toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-xs text-green-300/80 line-clamp-2">{notification.message}</p>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full p-6">
                    <Bell className="h-10 w-10 text-green-500/30 mb-2" />
                    <p className="text-sm text-green-500/50">Nenhuma notificação</p>
                  </div>
                )}
              </ScrollArea>
            </PopoverContent>
          </Popover>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full hover:bg-green-500/10">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-green-500/50 text-green-500">
                  <User className="h-5 w-5" />
                </div>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56 bg-black border border-green-500/30">
              <div className="flex items-center justify-start gap-2 p-2">
                <Shield className="h-5 w-5 text-green-500" />
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium text-green-400">Administrador</p>
                  <p className="text-xs text-green-500/70">Acesso Master</p>
                </div>
              </div>
              <DropdownMenuSeparator className="bg-green-500/20" />
              <DropdownMenuItem onClick={() => navigate('/settings')} className="text-green-400 focus:bg-green-500/10 focus:text-green-400">
                <Settings className="mr-2 h-4 w-4" />
                <span>Configurações</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-green-500/20" />
              <DropdownMenuItem
                className="text-red-400 focus:bg-red-500/10 focus:text-red-400"
                onClick={logout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
