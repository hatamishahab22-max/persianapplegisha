import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "خانه" },
    { href: "/iphone", label: "iPhone" },
    { href: "/ipad", label: "iPad" },
    { href: "/airpod", label: "AirPods" },
    { href: "/used-iphones", label: "کارکرده" },
    { href: "/contact", label: "تماس" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return location === href;
    return location.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-24 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-4" data-testid="link-home-logo">
            <img 
              src="/logo-header.jpg" 
              alt="Persian Apple Store" 
              className="h-16 object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <Link 
                key={item.href} 
                href={item.href}
                className={cn(
                  "inline-flex items-center justify-center rounded-md text-lg font-semibold transition-colors hover-elevate active-elevate-2 h-12 px-6 py-3",
                  isActive(item.href)
                    ? "bg-card text-card-foreground"
                    : "hover:bg-card/50"
                )}
                data-testid={`nav-${item.label.toLowerCase()}`}
              >
                {item.label}
              </Link>
            ))}
            <Link 
              href="/admin"
              className="inline-flex items-center justify-center rounded-md text-lg font-semibold transition-colors bg-card text-card-foreground hover-elevate active-elevate-2 h-12 px-6 py-3"
              data-testid="nav-admin"
            >
              مدیریت
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {isMobileMenuOpen ? <X className="h-10 w-10" /> : <Menu className="h-10 w-10" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2" data-testid="mobile-menu">
            {navItems.map((item) => (
              <Link 
                key={item.href} 
                href={item.href}
                className={cn(
                  "block rounded-md text-lg font-semibold transition-colors hover-elevate active-elevate-2 px-6 py-4 bg-card text-card-foreground",
                  isActive(item.href)
                    ? "bg-card"
                    : "hover:bg-card/50"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
                data-testid={`mobile-nav-${item.label.toLowerCase()}`}
              >
                {item.label}
              </Link>
            ))}
            <Link 
              href="/admin"
              className="block rounded-md text-lg font-semibold transition-colors bg-card text-card-foreground hover-elevate active-elevate-2 px-6 py-4"
              onClick={() => setIsMobileMenuOpen(false)}
              data-testid="mobile-nav-admin"
            >
              مدیریت
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
