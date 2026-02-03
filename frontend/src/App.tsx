import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Booking from "./pages/Booking";
import NotFound from "./pages/NotFound";
import api from "./lib/api";
import { toast } from "./hooks/use-toast";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    const checkBackendHealth = async () => {
      try {
        const res = await api.get("/health");
        const databaseStatus = res.data?.database;

        if (databaseStatus === "fallback") {
          toast({
            title: "Connected to local data files",
            description:
              "No MongoDB URL is registered or the database is unreachable. The app is currently using local JSON files instead of MongoDB.",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Backend not reachable",
          description:
            "We could not connect to the API server. The app will show limited or fallback data.",
          variant: "destructive",
        });
      }
    };

    void checkBackendHealth();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/booking" element={<Booking />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
