import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AdminLoginProps {
  onLogin: () => void;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "admin", password }),
      });

      if (response.ok) {
        sessionStorage.setItem("adminAuth", "true");
        onLogin();
        toast({
          title: "ورود موفق",
          description: "به پنل مدیریت خوش آمدید",
        });
      } else {
        toast({
          title: "خطا",
          description: "رمز عبور اشتباه است",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "خطا",
        description: "مشکلی پیش آمد، لطفاً دوباره تلاش کنید",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold mb-2">پنل مدیریت</h1>
          <p className="text-sm text-muted-foreground">لطفاً رمز عبور را وارد کنید</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">رمز عبور</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="رمز عبور را وارد کنید"
              data-testid="input-admin-password"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
            data-testid="button-admin-login"
          >
            {loading ? "در حال ورود..." : "ورود"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
