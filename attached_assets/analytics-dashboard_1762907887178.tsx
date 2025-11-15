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
import { Eye, TrendingUp, Calendar } from "lucide-react";

interface VisitStats {
  totalVisits: number;
  todayVisits: number;
  popularPages: { page: string; count: number }[];
}

export default function AnalyticsDashboard() {
  const { data: stats, isLoading } = useQuery<VisitStats>({
    queryKey: ["/api/visits/stats"],
  });

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

  const pageNameMap: Record<string, string> = {
    home: "صفحه اصلی",
    iphone: "آیفون",
    ipad: "آیپد",
    airpod: "ایرپاد",
    contact: "تماس با ما",
    "used-iphones": "گوشی‌های کارکرده",
    admin: "پنل مدیریت",
    accessories: "لوازم جانبی",
  };

  return (
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
              {stats?.totalVisits.toLocaleString("fa-IR") || "0"}
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
              {stats?.todayVisits.toLocaleString("fa-IR") || "0"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              از ابتدای امروز
            </p>
          </CardContent>
        </Card>

        {/* Most Popular */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">محبوب‌ترین صفحه</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-popular-page">
              {stats && stats.popularPages.length > 0
                ? pageNameMap[stats.popularPages[0].page] || stats.popularPages[0].page
                : "—"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats && stats.popularPages.length > 0
                ? `${stats.popularPages[0].count.toLocaleString("fa-IR")} بازدید در ۳۰ روز اخیر`
                : "هنوز بازدیدی ثبت نشده"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Popular Pages Table */}
      <Card>
        <CardHeader>
          <CardTitle>صفحات محبوب (۳۰ روز اخیر)</CardTitle>
        </CardHeader>
        <CardContent>
          {stats && stats.popularPages.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>رتبه</TableHead>
                  <TableHead>صفحه</TableHead>
                  <TableHead className="text-left">تعداد بازدید</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.popularPages.map((page, index) => (
                  <TableRow key={page.page}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>
                      {pageNameMap[page.page] || page.page}
                    </TableCell>
                    <TableCell className="text-left" data-testid={`text-page-count-${page.page}`}>
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
  );
}
