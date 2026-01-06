import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ModuleInfo from "./pages/module/ModuleInfo";
import TriggerQuestions from "./pages/module/TriggerQuestions";
import MaterialPage from "./pages/module/MaterialPage";
import VideoPage from "./pages/module/VideoPage";
import LKPDPage from "./pages/module/LKPDPage";
import QuizPage from "./pages/module/QuizPage";
import GlossaryPage from "./pages/module/GlossaryPage";
import SummaryPage from "./pages/module/SummaryPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/modul/:moduleId" element={<ModuleInfo />} />
          <Route path="/modul/:moduleId/pemantik" element={<TriggerQuestions />} />
          <Route path="/modul/:moduleId/materi" element={<MaterialPage />} />
          <Route path="/modul/:moduleId/video" element={<VideoPage />} />
          <Route path="/modul/:moduleId/lkpd" element={<LKPDPage />} />
          <Route path="/modul/:moduleId/kuis" element={<QuizPage />} />
          <Route path="/modul/:moduleId/glosarium" element={<GlossaryPage />} />
          <Route path="/modul/:moduleId/rangkuman" element={<SummaryPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
