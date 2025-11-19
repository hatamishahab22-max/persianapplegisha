interface LogErrorParams {
  error: Error | string;
  severity?: 'error' | 'warning' | 'critical';
  metadata?: Record<string, any>;
}

export async function logError({ error, severity = 'error', metadata = {} }: LogErrorParams) {
  const errorMessage = typeof error === 'string' ? error : error.message;
  const errorStack = typeof error === 'string' ? undefined : error.stack;
  const errorType = typeof error === 'string' ? 'Error' : error.name;

  const payload = {
    source: 'frontend',
    errorType,
    message: errorMessage,
    stack: errorStack,
    url: window.location.href,
    userAgent: navigator.userAgent,
    severity,
    metadata: {
      ...metadata,
      timestamp: new Date().toISOString(),
    },
    resolved: false,
  };

  try {
    await fetch('/api/errors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (e) {
    console.error('Failed to log error to backend:', e);
  }
}

export function setupGlobalErrorHandlers() {
  window.addEventListener('error', (event) => {
    logError({
      error: event.error || event.message,
      severity: 'error',
      metadata: {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      },
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    logError({
      error: event.reason,
      severity: 'error',
      metadata: {
        type: 'unhandledRejection',
        promise: event.promise,
      },
    });
  });
}
