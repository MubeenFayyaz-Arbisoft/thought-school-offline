import { useEffect } from "react";
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
import NotFound from "./pages/NotFound";
import Salary from "./pages/Salary";
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
              <Route path="/notices" element={<Notices />} />
              <Route path="/syllabus" element={<Syllabus />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </DashboardLayout>
        </BrowserRouter>
        <Sonner />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
