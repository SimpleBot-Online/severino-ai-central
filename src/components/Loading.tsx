import React from 'react';

export const Loading = ({ message = "CARREGANDO MÓDULO" }: { message?: string }) => (
  <div className="flex items-center justify-center h-screen bg-cyber-dark">
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-16 h-16 mb-4">
        <div className="absolute inset-0 border-2 border-t-cyber-primary border-r-cyber-primary border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        <div className="absolute inset-2 border-2 border-t-transparent border-r-transparent border-b-cyber-secondary border-l-cyber-secondary rounded-full animate-spin animation-delay-500"></div>
      </div>
      <div className="text-cyber-primary font-mono text-sm">{message}</div>
    </div>
  </div>
);
