import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowRight, LogIn, User, Lock, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import dreamBackground from "@assets/dream-background.jpeg";

export default function SellerLogin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      toast({
        title: "خطا",
        description: "لطفا نام کاربری و رمز عبور را وارد کنید",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/seller/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "خوش آمدید!",
          description: `${data.seller.name} عزیز، به پنل فروشندگان خوش آمدید`,
        });
        setLocation("/seller/panel");
      } else {
        toast({
          title: "خطا در ورود",
          description: data.message || "نام کاربری یا رمز عبور اشتباه است",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "خطا",
        description: "مشکلی در ارتباط با سرور پیش آمد",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden" dir="rtl">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${dreamBackground})` }}
      />
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6">
        <div className="absolute top-6 right-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/dream-deals")}
            className="text-white hover:bg-white/20"
            data-testid="button-back"
          >
            <ArrowRight className="w-6 h-6" />
          </Button>
        </div>

        <Card className="w-full max-w-md bg-gray-900/80 border-gray-700 backdrop-blur-xl">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-gradient-to-r from-purple-500/30 to-pink-500/30">
                <Store className="w-10 h-10 text-purple-400" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-white">
              ورود فروشندگان
            </CardTitle>
            <p className="text-gray-400 text-sm mt-2">
              وارد پنل مدیریت محصولات خود شوید
            </p>
          </CardHeader>

          <CardContent className="pt-4">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-300">
                  نام کاربری
                </Label>
                <div className="relative">
                  <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pr-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                    placeholder="نام کاربری خود را وارد کنید"
                    data-testid="input-username"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">
                  رمز عبور
                </Label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                    placeholder="رمز عبور خود را وارد کنید"
                    data-testid="input-password"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 font-bold py-6 text-lg"
                data-testid="button-login"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                ) : (
                  <>
                    <LogIn className="w-5 h-5 ml-2" />
                    ورود
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-700">
              <p className="text-center text-gray-500 text-sm">
                برای دریافت حساب کاربری با مدیر تماس بگیرید
              </p>
              <a 
                href="tel:+989121149079"
                className="block mt-3"
                data-testid="link-contact-admin"
              >
                <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-800">
                  تماس با مدیر: ۰۹۱۲۱۱۴۹۰۷۹
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
