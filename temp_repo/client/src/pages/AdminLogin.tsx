import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Lock, User } from "lucide-react";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      return apiRequest('POST', '/api/auth/login', credentials);
    },
    onSuccess: () => {
      toast({
        title: "ورود موفق",
        description: "خوش آمدید به پنل مدیریت",
      });
      setLocation("/admin");
    },
    onError: (error: any) => {
      toast({
        title: "خطا در ورود",
        description: error.message || "نام کاربری یا رمز عبور اشتباه است",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast({
        title: "خطا",
        description: "لطفاً نام کاربری و رمز عبور را وارد کنید",
        variant: "destructive",
      });
      return;
    }
    loginMutation.mutate({ username, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4" dir="rtl">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">ورود به پنل مدیریت</CardTitle>
          <CardDescription className="text-center">
            پرشین اپل استور گیشا
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">نام کاربری</Label>
              <div className="relative">
                <User className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  placeholder="نام کاربری را وارد کنید"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pr-10"
                  data-testid="input-username"
                  disabled={loginMutation.isPending}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">رمز عبور</Label>
              <div className="relative">
                <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="رمز عبور را وارد کنید"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                  data-testid="input-password"
                  disabled={loginMutation.isPending}
                />
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full"
              disabled={loginMutation.isPending}
              data-testid="button-login"
            >
              {loginMutation.isPending ? "در حال ورود..." : "ورود"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}