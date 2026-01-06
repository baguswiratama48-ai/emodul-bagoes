import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";
import ModuleInfo from "./pages/module/ModuleInfo";
import TriggerQuestions from "./pages/module/TriggerQuestions";
import MaterialPage from "./pages/module/MaterialPage";
import VideoPage from "./pages/module/VideoPage";
import LKPDPage from "./pages/module/LKPDPage";
import QuizPage from "./pages/module/QuizPage";
import GlossaryPage from "./pages/module/GlossaryPage";
import SummaryPage from "./pages/module/SummaryPage";
import TeacherDashboard from "./pages/TeacherDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/guru" element={<ProtectedRoute requiredRole="guru"><TeacherDashboard /></ProtectedRoute>} />
            <Route path="/modul/:moduleId" element={<ProtectedRoute><ModuleInfo /></ProtectedRoute>} />
            <Route path="/modul/:moduleId/pemantik" element={<ProtectedRoute><TriggerQuestions /></ProtectedRoute>} />
            <Route path="/modul/:moduleId/materi" element={<ProtectedRoute><MaterialPage /></ProtectedRoute>} />
            <Route path="/modul/:moduleId/video" element={<ProtectedRoute><VideoPage /></ProtectedRoute>} />
            <Route path="/modul/:moduleId/lkpd" element={<ProtectedRoute><LKPDPage /></ProtectedRoute>} />
            <Route path="/modul/:moduleId/kuis" element={<ProtectedRoute><QuizPage /></ProtectedRoute>} />
            <Route path="/modul/:moduleId/glosarium" element={<ProtectedRoute><GlossaryPage /></ProtectedRoute>} />
            <Route path="/modul/:moduleId/rangkuman" element={<ProtectedRoute><SummaryPage /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;