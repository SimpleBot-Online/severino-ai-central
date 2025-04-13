import React from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

interface SimpleBotLinkProps {
  className?: string;
  buttonText?: string;
}

const SimpleBotLink: React.FC<SimpleBotLinkProps> = ({ 
  className = '', 
  buttonText = 'Abrir SimpleBot em Nova Aba' 
}) => {
  const handleOpenSimpleBot = () => {
    window.open('https://gen.simplebot.online/', '_blank', 'noopener,noreferrer');
  };

  return (
    <Button 
      onClick={handleOpenSimpleBot} 
      className={`bg-green-500 hover:bg-green-600 text-black ${className}`}
    >
      <ExternalLink size={16} className="mr-2" />
      {buttonText}
    </Button>
  );
};

export default SimpleBotLink;
