import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Outlet, Navigate } from "react-router-dom";
import { AuthProvider } from "./providers/AuthProvider";
import Dashboard from "./pages/Dashboard";
import Interview from "./pages/Interview";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useAuth } from "./hooks/useAuth";
import Loader from "./components/Loader";
import Landing from "./pages/Landing";
import InterviewHistory from "./pages/InterviewHistory";
import InterviewSetup from "./components/InterviewSetup";
import { Toaster } from "react-hot-toast"; // ✅ Import Toaster

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          {/* ✅ Add Toaster at the root */}
          <Toaster 
            position="top-right" 
            toastOptions={{
              success: {
                style: {
                  background: "#e0f8ea",
                  color: "#065f46",
                },
              },
              error: {
                style: {
                  background: "#ffe4e6",
                  color: "#b91c1c",
                },
              },
            }}
          />
          
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route element={<RequireAuth />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/setup-interview" element={<InterviewSetup />} />
              <Route path="/interview" element={<Interview />} />
              <Route path="/history" element={<InterviewHistory />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

function RequireAuth() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Loader />;
  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
