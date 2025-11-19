import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  CheckCircle,
  Code,
  Globe,
  Server,
} from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { queryClient, apiRequest } from "@/lib/queryClient";

interface ErrorLog {
  id: string;
  source: string;
  errorType: string;
  message: string;
  stack?: string;
  url?: string;
  severity: string;
  resolved: boolean;
  createdAt: string;
  metadata?: any;
}

interface ErrorStats {
  total: number;
  today: number;
  unresolved: number;
  bySeverity: {
    critical: number;
    error: number;
    warning: number;
  };
  bySource: {
    frontend: number;
    backend: number;
    api: number;
  };
}

export default function ErrorMonitor() {
  const [selectedError, setSelectedError] = useState<ErrorLog | null>(null);

  const { data: stats } = useQuery<ErrorStats>({
    queryKey: ["/api/errors/stats"],
  });

  const { data: errors = [] } = useQuery<ErrorLog[]>({
    queryKey: ["/api/errors"],
  });

  const resolveMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("PATCH", `/api/errors/${id}/resolve`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/errors"] });
      queryClient.invalidateQueries({ queryKey: ["/api/errors/stats"] });
      setSelectedError(null);
    },
  });

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'warning':
        return <Info className="h-4 w-4 text-yellow-500" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getSeverityVariant = (severity: string): "default" | "destructive" | "secondary" => {
    switch (severity) {
      case 'critical':
        return 'destructive';
      case 'error':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'frontend':
        return <Globe className="h-4 w-4" />;
      case 'backend':
        return <Server className="h-4 w-4" />;
      case 'api':
        return <Code className="h-4 w-4" />;
      default:
        return <Code className="h-4 w-4" />;
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">مانیتورینگ خطاها</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">کل خطاها</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-errors">
              {stats?.total.toLocaleString("fa-IR") || "0"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">خطاهای امروز</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-today-errors">
              {stats?.today.toLocaleString("fa-IR") || "0"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">حل نشده</CardTitle>
            <Info className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500" data-testid="text-unresolved-errors">
              {stats?.unresolved.toLocaleString("fa-IR") || "0"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">بحرانی</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive" data-testid="text-critical-errors">
              {stats?.bySeverity.critical.toLocaleString("fa-IR") || "0"}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>لیست خطاها</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all" data-testid="tab-all-errors">همه</TabsTrigger>
              <TabsTrigger value="unresolved" data-testid="tab-unresolved">حل نشده</TabsTrigger>
              <TabsTrigger value="critical" data-testid="tab-critical">بحرانی</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <ErrorTable 
                errors={errors} 
                onSelect={setSelectedError}
                onResolve={resolveMutation.mutate}
                getSeverityIcon={getSeverityIcon}
                getSeverityVariant={getSeverityVariant}
                getSourceIcon={getSourceIcon}
              />
            </TabsContent>

            <TabsContent value="unresolved">
              <ErrorTable 
                errors={errors.filter(e => !e.resolved)} 
                onSelect={setSelectedError}
                onResolve={resolveMutation.mutate}
                getSeverityIcon={getSeverityIcon}
                getSeverityVariant={getSeverityVariant}
                getSourceIcon={getSourceIcon}
              />
            </TabsContent>

            <TabsContent value="critical">
              <ErrorTable 
                errors={errors.filter(e => e.severity === 'critical')} 
                onSelect={setSelectedError}
                onResolve={resolveMutation.mutate}
                getSeverityIcon={getSeverityIcon}
                getSeverityVariant={getSeverityVariant}
                getSourceIcon={getSourceIcon}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {selectedError && (
        <Card className="mt-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                {getSeverityIcon(selectedError.severity)}
                جزئیات خطا
              </CardTitle>
              <div className="flex gap-2">
                {!selectedError.resolved && (
                  <Button
                    size="sm"
                    onClick={() => resolveMutation.mutate(selectedError.id)}
                    disabled={resolveMutation.isPending}
                    data-testid="button-resolve-error"
                  >
                    علامت‌گذاری به عنوان حل شده
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedError(null)}
                  data-testid="button-close-details"
                >
                  بستن
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-1">پیام:</p>
              <p className="text-sm text-muted-foreground">{selectedError.message}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium mb-1">نوع:</p>
                <p className="text-sm text-muted-foreground">{selectedError.errorType}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">منبع:</p>
                <div className="flex items-center gap-1">
                  {getSourceIcon(selectedError.source)}
                  <p className="text-sm text-muted-foreground">{selectedError.source}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">زمان:</p>
                <p className="text-sm text-muted-foreground" dir="ltr">
                  {format(new Date(selectedError.createdAt), 'yyyy-MM-dd HH:mm:ss')}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">وضعیت:</p>
                <Badge variant={selectedError.resolved ? "secondary" : "destructive"}>
                  {selectedError.resolved ? "حل شده" : "حل نشده"}
                </Badge>
              </div>
            </div>

            {selectedError.url && (
              <div>
                <p className="text-sm font-medium mb-1">URL:</p>
                <p className="text-sm text-muted-foreground break-all">{selectedError.url}</p>
              </div>
            )}

            {selectedError.stack && (
              <div>
                <p className="text-sm font-medium mb-1">Stack Trace:</p>
                <pre className="text-xs bg-muted p-3 rounded-md overflow-auto max-h-60">
                  {selectedError.stack}
                </pre>
              </div>
            )}

            {selectedError.metadata && (
              <div>
                <p className="text-sm font-medium mb-1">Metadata:</p>
                <pre className="text-xs bg-muted p-3 rounded-md overflow-auto max-h-40">
                  {JSON.stringify(selectedError.metadata, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function ErrorTable({ 
  errors, 
  onSelect, 
  onResolve,
  getSeverityIcon,
  getSeverityVariant,
  getSourceIcon
}: { 
  errors: ErrorLog[];
  onSelect: (error: ErrorLog) => void;
  onResolve: (id: string) => void;
  getSeverityIcon: (severity: string) => JSX.Element;
  getSeverityVariant: (severity: string) => "default" | "destructive" | "secondary";
  getSourceIcon: (source: string) => JSX.Element;
}) {
  if (errors.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        خطایی یافت نشد
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>سطح</TableHead>
          <TableHead>منبع</TableHead>
          <TableHead>پیام</TableHead>
          <TableHead>زمان</TableHead>
          <TableHead>وضعیت</TableHead>
          <TableHead className="text-left">عملیات</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {errors.map((error) => (
          <TableRow 
            key={error.id}
            className="hover-elevate cursor-pointer"
            onClick={() => onSelect(error)}
            data-testid={`row-error-${error.id}`}
          >
            <TableCell>
              <div className="flex items-center gap-2">
                {getSeverityIcon(error.severity)}
                <Badge variant={getSeverityVariant(error.severity)}>
                  {error.severity}
                </Badge>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1">
                {getSourceIcon(error.source)}
                <span className="text-sm">{error.source}</span>
              </div>
            </TableCell>
            <TableCell className="max-w-xs truncate">
              {error.message}
            </TableCell>
            <TableCell className="text-sm" dir="ltr">
              {format(new Date(error.createdAt), 'MM-dd HH:mm')}
            </TableCell>
            <TableCell>
              {error.resolved ? (
                <Badge variant="secondary" className="gap-1">
                  <CheckCircle className="h-3 w-3" />
                  حل شده
                </Badge>
              ) : (
                <Badge variant="destructive">حل نشده</Badge>
              )}
            </TableCell>
            <TableCell>
              {!error.resolved && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    onResolve(error.id);
                  }}
                  data-testid={`button-resolve-${error.id}`}
                >
                  حل شد
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
