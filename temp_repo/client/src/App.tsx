import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense, useEffect, useState } from "react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { setupGlobalErrorHandlers } from "@/lib/errorLogger";
import { useSwipeBack } from "@/hooks/useSwipeBack";
import { GlobalBackground } from "@/components/GlobalBackground";

// Pages
import Splash from "@/pages/Splash";
import Home from "@/pages/Home";
import Admin from "@/pages/Admin";
import AdminLogin from "@/pages/AdminLogin";
import Contact from "@/pages/Contact";
import Products from "@/pages/Products";
import Category from "@/pages/Category";
import ProductDetail from "@/pages/ProductDetail";
import UsedPhoneOrder from "@/pages/UsedPhoneOrder";
import UsedPhones from "@/pages/UsedPhones";
import UsedPhonesAvailable from "@/pages/UsedPhonesAvailable";
import NotFound from "@/pages/not-found";

// Lazy load components
const AIChatbot = lazy(() => import("@/components/ai-chatbot"));

// Loading component
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">در حال بارگذاری...</p>
      </div>
    </div>
  );
}

// Protected Route Component
function ProtectedRoute({ component: Component }: { component: any }) {
  const [location, setLocation] = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication status
    fetch('/api/auth/check')
      .then(res => res.json())
      .then(data => {
        setIsAuthenticated(data.authenticated);
        setIsLoading(false);
        if (!data.authenticated) {
          setLocation('/admin/login');
        }
      })
      .catch(() => {
        setIsAuthenticated(false);
        setIsLoading(false);
        setLocation('/admin/login');
      });
  }, [setLocation]);

  if (isLoading) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <Component />;
}

function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/admin/login" component={AdminLogin} />
        <Route path="/admin" component={() => <ProtectedRoute component={Admin} />} />
        <Route path="/admin/:section" component={() => <ProtectedRoute component={Admin} />} />
        <Route path="/products" component={Products} />
        <Route path="/product/:id" component={ProductDetail} />
        <Route path="/category/:slug" component={Category} />
        <Route path="/used-phones" component={UsedPhones} />
        <Route path="/used-phones/available" component={UsedPhonesAvailable} />
        <Route path="/used-phone-order" component={UsedPhoneOrder} />
        <Route path="/cart" component={CartPage} />
        <Route path="/checkout" component={CheckoutPage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/register" component={RegisterPage} />
        <Route path="/profile" component={ProfilePage} />
        <Route path="/about" component={AboutPage} />
        <Route path="/contact" component={Contact} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    setupGlobalErrorHandlers();
  }, []);

  // Enable swipe back gesture (excluding back buttons and specific interactive elements)
  useSwipeBack({
    threshold: 100,
    excludeSelectors: [
      '[data-no-swipe]',
      'button',
      'a[href]',
      'input',
      'textarea',
      'select',
    ]
  });

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  if (showSplash) {
    return <Splash onComplete={handleSplashComplete} />;
  }

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <GlobalBackground />
          <div className="min-h-screen" dir="rtl">
            <Router />
            <Toaster />
          </div>
          
          {/* AI Chatbot - outside RTL to fix positioning */}
          <Suspense fallback={null}>
            <AIChatbot />
          </Suspense>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;

// Placeholder pages (to be implemented)
function UsedPhonesPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">آیفون‌های کارکرده</h1>
      <p className="text-muted-foreground">صفحه آیفون‌های کارکرده در حال توسعه است...</p>
    </div>
  );
}

function CartPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">سبد خرید</h1>
      <p className="text-muted-foreground">صفحه سبد خرید در حال توسعه است...</p>
    </div>
  );
}

function CheckoutPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">تسویه حساب</h1>
      <p className="text-muted-foreground">صفحه تسویه حساب در حال توسعه است...</p>
    </div>
  );
}

function LoginPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">ورود به حساب کاربری</h1>
      <p className="text-muted-foreground">صفحه ورود در حال توسعه است...</p>
    </div>
  );
}

function RegisterPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">ثبت‌نام</h1>
      <p className="text-muted-foreground">صفحه ثبت‌نام در حال توسعه است...</p>
    </div>
  );
}

function ProfilePage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">پروفایل کاربری</h1>
      <p className="text-muted-foreground">صفحه پروفایل در حال توسعه است...</p>
    </div>
  );
}

function AboutPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">درباره ما</h1>
      <p className="text-muted-foreground">صفحه درباره ما در حال توسعه است...</p>
    </div>
  );
}

