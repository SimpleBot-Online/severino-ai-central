import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const notificationVariants = cva(
  'fixed flex items-center gap-3 p-4 rounded-md shadow-lg transition-all duration-300 z-50',
  {
    variants: {
      variant: {
        default: 'bg-green-800 text-white border border-green-700',
        success: 'bg-green-800 text-white border border-green-700',
        error: 'bg-red-800 text-white border border-red-700',
        warning: 'bg-yellow-800 text-white border border-yellow-700',
        info: 'bg-cyber-dark text-white border border-green-500/50',
      },
      position: {
        'top-right': 'top-4 right-4',
        'top-left': 'top-4 left-4',
        'bottom-right': 'bottom-4 right-4',
        'bottom-left': 'bottom-4 left-4',
      },
    },
    defaultVariants: {
      variant: 'default',
      position: 'top-right',
    },
  }
);

export interface NotificationProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof notificationVariants> {
  title: string;
  message: string;
  duration?: number;
  onClose?: () => void;
}

const Notification = ({
  className,
  variant,
  position,
  title,
  message,
  duration = 5000,
  onClose,
  ...props
}: NotificationProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) setTimeout(onClose, 300);
  };

  const getIcon = () => {
    switch (variant) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-300" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-300" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-300" />;
      case 'info':
      default:
        return <Info className="h-5 w-5 text-green-300" />;
    }
  };

  return (
    <div
      className={cn(
        notificationVariants({ variant, position, className }),
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      )}
      {...props}
    >
      <div className="flex-shrink-0">{getIcon()}</div>
      <div className="flex-1">
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm opacity-90">{message}</p>
      </div>
      <button
        onClick={handleClose}
        className="flex-shrink-0 rounded-full p-1 hover:bg-black/20 transition-colors"
        aria-label="Close notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export { Notification, notificationVariants };
