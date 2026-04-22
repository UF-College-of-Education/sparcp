import { useEffect } from "react";
import { Navigation } from "./components/Navigation";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  Outlet,
} from "react-router";
import { Dashboard } from "./pages/Dashboard";
import { Reports } from "./pages/Reports";
import { Login } from "./pages/Login";
import { Home } from "./pages/Home";
import { Resources } from "./pages/Resources";
import SparcUnityPage from "./pages/SparcUnityPage";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { sendPageView } from "./lib/analytics";

function ProtectedLayout() {
  const { isLoggedIn } = useAuth();
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }

  return (<> 
    <Navigation/>
    <Outlet/>
  </>) ;
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

  useEffect(() => {
    const pageTitle = PAGE_TITLES[location.pathname] ?? "SPARC";
    document.title = `${pageTitle} | ${APP_NAME}`;
    sendPageView(location.pathname, document.title);
  }, [location]);

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedLayout/>}>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/training" element={<SparcUnityPage />} />
        </Route>
        
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout/>
      </BrowserRouter>
    </AuthProvider>
  );
}