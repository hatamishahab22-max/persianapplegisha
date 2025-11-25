import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, Calendar, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ReferralStats {
  total: number;
  today: number;
  bySource: Array<{ source: string; count: number }>;
  converted: number;
}

interface Referral {
  id: string;
  source: string;
  sessionId: string | null;
  ip: string | null;
  userAgent: string | null;
  landingPage: string | null;
  converted: boolean;
  createdAt: string;
}

export default function ReferralAnalytics() {
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch stats
      const statsRes = await fetch("/api/referrals/stats");
      if (!statsRes.ok) throw new Error("Failed to fetch stats");
      const statsData = await statsRes.json();
      setStats(statsData);

      // Fetch all referrals
      const referralsRes = await fetch("/api/referrals");
      if (!referralsRes.ok) throw new Error("Failed to fetch referrals");
      const referralsData = await referralsRes.json();
      setReferrals(referralsData);

    } catch (error) {
      console.error("Error fetching referral data:", error);
      toast({
        title: "خطا",
        description: "خطا در دریافت اطلاعات معرفی‌ها",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center py-8">در حال بارگذاری...</div>;
  }

  if (!stats) {
    return <div className="text-center py-8">خطا در بارگذاری اطلاعات</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-8" data-testid="text-referrals-title">
        تحلیل معرفی‌ها و بازدیدکنندگان
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card data-testid="card-total-referrals">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">کل بازدیدها</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-referrals">
              {stats.total.toLocaleString('fa-IR')}
            </div>
            <p className="text-xs text-muted-foreground">از ابتدا تاکنون</p>
          </CardContent>
        </Card>

        <Card data-testid="card-today-referrals">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">بازدید امروز</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-today-referrals">
              {stats.today.toLocaleString('fa-IR')}
            </div>
            <p className="text-xs text-muted-foreground">بازدیدکنندگان جدید امروز</p>
          </CardContent>
        </Card>

        <Card data-testid="card-converted-referrals">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">تبدیل شده</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-converted-referrals">
              {stats.converted.toLocaleString('fa-IR')}
            </div>
            <p className="text-xs text-muted-foreground">
              نرخ تبدیل: {stats.total > 0 ? ((stats.converted / stats.total) * 100).toFixed(1) : 0}٪
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-sources-count">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">منابع مختلف</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-sources-count">
              {stats.bySource.length.toLocaleString('fa-IR')}
            </div>
            <p className="text-xs text-muted-foreground">منابع معرفی مختلف</p>
          </CardContent>
        </Card>
      </div>

      {/* Sources Breakdown */}
      <Card data-testid="card-sources-breakdown">
        <CardHeader>
          <CardTitle>تفکیک بر اساس منبع معرفی</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.bySource.map((source, index) => {
              const percentage = stats.total > 0 ? (source.count / stats.total) * 100 : 0;
              return (
                <div key={source.source} data-testid={`source-item-${index}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{source.source}</span>
                      <span className="text-sm text-muted-foreground">
                        ({source.count.toLocaleString('fa-IR')} بازدید)
                      </span>
                    </div>
                    <span className="text-sm font-medium">
                      {percentage.toFixed(1)}٪
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Referrals */}
      <Card data-testid="card-recent-referrals">
        <CardHeader>
          <CardTitle>آخرین بازدیدکنندگان</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-right py-3 px-4">منبع</th>
                  <th className="text-right py-3 px-4">صفحه ورود</th>
                  <th className="text-right py-3 px-4">تاریخ</th>
                  <th className="text-right py-3 px-4">وضعیت</th>
                </tr>
              </thead>
              <tbody>
                {referrals.slice(0, 20).map((referral) => (
                  <tr 
                    key={referral.id} 
                    className="border-b hover:bg-accent"
                    data-testid={`referral-row-${referral.id}`}
                  >
                    <td className="py-3 px-4">{referral.source}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {referral.landingPage || '/'}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {new Date(referral.createdAt).toLocaleDateString('fa-IR')}
                      {' '}
                      {new Date(referral.createdAt).toLocaleTimeString('fa-IR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="py-3 px-4">
                      {referral.converted ? (
                        <span className="text-green-600 text-sm">✓ تبدیل شده</span>
                      ) : (
                        <span className="text-gray-400 text-sm">بازدید</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {referrals.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                هنوز بازدیدکننده‌ای ثبت نشده است
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
