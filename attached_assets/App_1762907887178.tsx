import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import IphonePage from "@/pages/iphone";
import IpadPage from "@/pages/ipad";
import AirpodPage from "@/pages/airpod";
import UsedIphonesPage from "@/pages/used-iphones";
import ContactPage from "@/pages/contact";
import AdminDashboard from "@/pages/admin/dashboard";
import Header from "@/components/header";
import Footer from "@/components/footer";
import AIChatbot from "@/components/ai-chatbot";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/iphone" component={IphonePage} />
      <Route path="/ipad" component={IpadPage} />
      <Route path="/airpod" component={AirpodPage} />
      <Route path="/used-iphones" component={UsedIphonesPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/admin" component={AdminDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">
            <Router />
          </main>
          <Footer />
          <AIChatbot />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
