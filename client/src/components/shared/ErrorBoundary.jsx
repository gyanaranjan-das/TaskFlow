import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Button from '../ui/Button';

/**
 * Error boundary component
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-danger-100 dark:bg-danger-900/30 flex items-center justify-center mb-6">
            <AlertTriangle className="w-8 h-8 text-danger-500" />
          </div>
          <h2 className="text-xl font-semibold text-surface-900 dark:text-white mb-2">
            Something went wrong
          </h2>
          <p className="text-surface-500 dark:text-surface-400 mb-6 max-w-md">
            {this.state.error?.message || 'An unexpected error occurred.'}
          </p>
          <Button onClick={() => window.location.reload()}>
            Refresh Page
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
