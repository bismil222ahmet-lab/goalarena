import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import { AdminRoute } from "@/components/auth/ProtectedRoute";
import { useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import { getLanguageConfig } from "@/i18n/languages";

import HomePage from "./pages/HomePage";
import LivePage from "./pages/LivePage";
import MatchDetailPage from "./pages/MatchDetailPage";
import NewsPage from "./pages/NewsPage";
import NewsArticlePage from "./pages/NewsArticlePage";
import TransfersPage from "./pages/TransfersPage";
import HighlightsPage from "./pages/HighlightsPage";
import LeaguesPage from "./pages/LeaguesPage";
import LeagueDetailPage from "./pages/LeagueDetailPage";
import AdminPage from "./pages/AdminPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import NotFound from "./pages/NotFound";
import CookieConsent from "./components/common/CookieConsent";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsOfServicePage from "./pages/TermsOfServicePage";
import ContactPage from "./pages/ContactPage";
import AboutPage from "./pages/AboutPage";
import GlobalTranslationProvider from "./components/common/GlobalTranslationProvider";

const queryClient = new QueryClient();

function AppInit() {
  const { theme, language } = useAppStore();
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);
  useEffect(() => {
    const config = getLanguageConfig(language);
    document.documentElement.dir = config.dir;
    document.documentElement.lang = config.code;
  }, [language]);
  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <AppInit />
        <GlobalTranslationProvider />
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/live" element={<LivePage />} />
            <Route path="/match/:id" element={<MatchDetailPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/news/:slug" element={<NewsArticlePage />} />
            <Route path="/transfers" element={<TransfersPage />} />
            <Route path="/highlights" element={<HighlightsPage />} />
            <Route path="/leagues" element={<LeaguesPage />} />
            <Route path="/leagues/:leagueId" element={<LeagueDetailPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsOfServicePage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <CookieConsent />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
