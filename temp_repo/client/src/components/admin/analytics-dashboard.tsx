import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, TrendingUp, Calendar, Users } from "lucide-react";

interface VisitStats {
  total: number;
  today: number;
  uniqueVisitors: number;
}

interface PopularPage {
  path: string;
  count: number;
}

export default function AnalyticsDashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery<VisitStats>({
    queryKey: ["/api/analytics/stats"],
  });

  const { data: popularPages = [], isLoading: pagesLoading } = useQuery<PopularPage[]>({
    queryKey: ["/api/analytics/popular-pages"],
  });

  const isLoading = statsLoading || pagesLoading;

  if (isLoading) {
    return (
      <Card data-testid="card-analytics-loading">
        <CardContent className="p-8">
          <div className="text-center text-muted-foreground">
            در حال بارگذاری آمار...
          </div>
        </CardContent>
      </Card>
    );
  }

  const getPageName = (path: string): string => {
    const pathMap: Record<string, string> = {
      "/": "صفحه اصلی",
      "/products": "محصولات",
      "/category/iphone": "آیفون",
      "/category/ipad": "آیپد",
      "/category/airpods": "ایرپاد",
      "/contact": "تماس با ما",
      "/used-iphones": "گوشی‌های کارکرده",
      "/admin": "پنل مدیریت",
    };
    return pathMap[path] || path;
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">آمار و گزارشات</h1>
      
      <div className="space-y-6" data-testid="container-analytics">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Visits */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">کل بازدیدها</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" data-testid="text-total-visits">
                {stats?.total.toLocaleString("fa-IR") || "0"}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                از ابتدای راه‌اندازی
              </p>
            </CardContent>
          </Card>

          {/* Today's Visits */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">بازدید امروز</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" data-testid="text-today-visits">
                {stats?.today.toLocaleString("fa-IR") || "0"}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                از ابتدای امروز
              </p>
            </CardContent>
          </Card>

          {/* Unique Visitors */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">بازدیدکنندگان یکتا</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" data-testid="text-unique-visitors">
                {stats?.uniqueVisitors.toLocaleString("fa-IR") || "0"}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                کاربران منحصر به فرد
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Popular Pages Table */}
        <Card>
          <CardHeader>
            <CardTitle>صفحات محبوب</CardTitle>
          </CardHeader>
          <CardContent>
            {popularPages.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>رتبه</TableHead>
                    <TableHead>صفحه</TableHead>
                    <TableHead>آدرس</TableHead>
                    <TableHead className="text-left">تعداد بازدید</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {popularPages.map((page, index) => (
                    <TableRow key={page.path}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>{getPageName(page.path)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{page.path}</TableCell>
                      <TableCell className="text-left" data-testid={`text-page-count-${index}`}>
                        {page.count.toLocaleString("fa-IR")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                هنوز بازدیدی ثبت نشده است
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
