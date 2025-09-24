
/// <reference path="./types/react-shim.d.ts" />
// @ts-nocheck
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CustomAuthProvider } from "./hooks/useCustomAuth";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NewAuthPage from "./components/NewAuthPage";
import AuthTestPage from "./components/AuthTestPage";
import DebugVerificationInput from "./components/debug/DebugVerificationInput";
import SimpleVerificationTest from "./components/debug/SimpleVerificationTest";
import STT from "./pages/STT";
import ResetPassword from "./pages/ResetPassword";
import AuthDebugPanel from "./components/debug/AuthDebugPanel";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CustomAuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/auth-test" element={<AuthTestPage />} />
            <Route path="/debug-input" element={<DebugVerificationInput />} />
            <Route path="/simple-test" element={<SimpleVerificationTest />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/debug" element={<AuthDebugPanel />} />
            <Route path="/stt" element={<STT />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </CustomAuthProvider>
  </QueryClientProvider>
);

export default App;
