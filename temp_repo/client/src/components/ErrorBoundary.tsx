import { Component, ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    this.logErrorToBackend(error, errorInfo);
  }

  async logErrorToBackend(error: Error, errorInfo: any) {
    try {
      await fetch('/api/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'frontend',
          errorType: error.name,
          message: error.message,
          stack: error.stack,
          url: window.location.href,
          userAgent: navigator.userAgent,
          severity: 'error',
          metadata: {
            componentStack: errorInfo.componentStack,
            timestamp: new Date().toISOString(),
          },
          resolved: false,
        }),
      });
    } catch (e) {
      console.error('Failed to log error to backend:', e);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="max-w-lg w-full">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-6 w-6 text-destructive" />
                <CardTitle>متأسفانه مشکلی پیش آمد</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                یک خطای غیرمنتظره رخ داده است. لطفاً صفحه را رفرش کنید یا بعداً دوباره تلاش کنید.
              </p>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="bg-muted p-4 rounded-md text-sm">
                  <p className="font-medium mb-2">Error Details:</p>
                  <p className="text-destructive">{this.state.error.message}</p>
                  {this.state.error.stack && (
                    <pre className="mt-2 text-xs overflow-auto max-h-40">
                      {this.state.error.stack}
                    </pre>
                  )}
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  onClick={() => window.location.reload()}
                  data-testid="button-reload"
                >
                  رفرش صفحه
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.location.href = '/'}
                  data-testid="button-home"
                >
                  بازگشت به صفحه اصلی
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
