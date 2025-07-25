import Classes from "./pages/Classes";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Teachers from "./pages/Teachers";
import Fees from "./pages/Fees";
import Subjects from "./pages/Subjects";
import Attendance from "./pages/Attendance";
import Syllabus from "./pages/Syllabus";
import Notices from "./pages/Notices";
import Expenses from "./pages/Expenses";
import SyllabusPage from "./pages/Syllabus";
import NotFound from "./pages/NotFound";
import { initializeSampleData } from "./lib/storage";
import { Toaster } from "@/components/ui/toaster";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    initializeSampleData();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        </BrowserRouter>
        <Sonner />
        <BrowserRouter>
          <DashboardLayout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/students" element={<Students />} />
              <Route path="/teachers" element={<Teachers />} />
              <Route path="/classes" element={<Classes />} />
              <Route path="/subjects" element={<Subjects />} />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/salary" element={<Salary />} />
              <Route path="/expenses" element={<Expenses />} />
              <Route path="/fees" element={<Fees />} />
              <Route path="/syllabus" element={<SyllabusPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="/syllabus" element={<Syllabus />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </DashboardLayout>
      </TooltipProvider>
    </QueryClientProvider>
  );
};
}

export default App;
