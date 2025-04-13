import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from './ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 bg-card rounded-lg shadow-lg border border-destructive/20">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-center mb-2">Algo deu errado</h1>
            
            <p className="text-muted-foreground text-center mb-6">
              Ocorreu um erro inesperado. Tente recarregar a página ou voltar para a página inicial.
            </p>
            
            {this.state.error && (
              <div className="bg-muted p-3 rounded-md mb-6 overflow-auto max-h-32">
                <p className="text-sm font-mono">{this.state.error.toString()}</p>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={this.handleGoHome}
              >
                Página Inicial
              </Button>
              <Button 
                className="flex-1"
                onClick={this.handleReload}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Recarregar
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
