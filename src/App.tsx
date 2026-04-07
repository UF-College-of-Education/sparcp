import { useEffect } from "react";
import { Navigation } from "./components/Navigation";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router";
import { Dashboard } from "./pages/Dashboard";
import { Reports } from "./pages/Reports";
import { Login } from "./pages/Login";
import { Home } from "./pages/Home";
import { Resources } from "./pages/Resources";
import SparcUnityPage from "./pages/SparcUnityPage";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { sendPageView } from "./lib/analytics";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <>{children}</> : <Navigate to="/login" replace />;
}

const PAGE_TITLES: Record<string, string> = {
  "/":          "Home",
  "/dashboard": "Dashboard",
  "/reports":   "My Progress",
  "/resources": "Resources",
  "/training":  "Training",
  "/login":     "Login",
};

const APP_NAME = "SPARC";

/**
 * Layout is used because useLocation can't be called
 * directly in App. It needs the context from the
 * BrowserRouter component to fetch current route.
 */
function Layout() {
  const location = useLocation();
  const showNav = location.pathname !== "/login";

  useEffect(() => {
    const pageTitle = PAGE_TITLES[location.pathname] ?? "SPARC";
    document.title = `${pageTitle} | ${APP_NAME}`;
    sendPageView(location.pathname, document.title);
  }, [location]);

  return (
    <>
      {showNav && <Navigation />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
        <Route path="/resources" element={<ProtectedRoute><Resources /></ProtectedRoute>} />
        <Route path="/training" element={<ProtectedRoute><SparcUnityPage /></ProtectedRoute>} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </AuthProvider>
  );
}