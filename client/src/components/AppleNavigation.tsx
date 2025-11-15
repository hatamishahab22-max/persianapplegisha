import { useState } from "react";
import { Menu, X, User } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function AppleNavigation() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: "صفحه اصلی", path: "/" },
    { label: "آیفون", path: "/category/iphone" },
    { label: "آیپد", path: "/category/ipad" },
    { label: "مک", path: "/category/macbook" },
    { label: "واچ", path: "/category/apple-watch" },
    { label: "گوشی‌های کارکرده", path: "/used-phones" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 hover-elevate rounded-lg px-3 py-2">
            <div className="text-xl font-bold">پرشین اپل</div>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <Button
                  variant={location === item.path ? "secondary" : "ghost"}
                  className="text-sm font-medium"
                  data-testid={`link-nav-${item.label}`}
                >
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link href="/admin">
              <Button
                variant="ghost"
                size="icon"
                data-testid="button-admin"
              >
                <User className="w-5 h-5" />
              </Button>
            </Link>

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  data-testid="button-mobile-menu"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <div className="flex flex-col gap-2 mt-8">
                  {navItems.map((item) => (
                    <Link key={item.path} href={item.path}>
                      <Button
                        variant={location === item.path ? "secondary" : "ghost"}
                        className="w-full justify-start text-base font-medium"
                        onClick={() => setIsOpen(false)}
                        data-testid={`link-mobile-${item.label}`}
                      >
                        {item.label}
                      </Button>
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
