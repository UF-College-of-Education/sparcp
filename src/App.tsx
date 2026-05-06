import { useEffect } from "react";
import { Navigation } from "./components/Navigation";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  useLocation,
  Outlet,
} from "react-router";
import { sendPageView } from "./lib/analytics";
// Page Components
import { Dashboard } from "./pages/Dashboard";
import { Reports } from "./pages/Reports";
import { Login } from "./pages/Login";
import { Home } from "./pages/Home";
import { Resources } from "./pages/Resources";
import SparcUnityPage from "./pages/SparcUnityPage";
import { Didactic } from "./pages/Didactic";
// Contexts
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ProgressProvider } from "./context/ProgressContext";
import { FirebaseUIProvider } from "@firebase-oss/ui-react";
import { ui } from "./lib/firebase";


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
  "/clear":     "The C-LEAR Method"
};

const APP_NAME = "SPARC";

function Layout() {
  const location = useLocation();

  useEffect(() => {
    const pageTitle = PAGE_TITLES[location.pathname] ?? "SPARC";
    document.title = `${pageTitle} | ${APP_NAME}`;
    sendPageView(location.pathname, document.title);
  }, [location]);

  return (
    <ProgressProvider>
      <Outlet />
    </ProgressProvider>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/login", element: <Login /> },
      {
        element: <ProtectedLayout />,
        children: [
          { path: "/", element: <Home /> },
          { path: "/dashboard", element: <Dashboard /> },
          { path: "/reports", element: <Reports /> },
          { path: "/resources", element: <Resources /> },
          { path: "/training", element: <SparcUnityPage /> },
          { path: "/clear", element: <Didactic /> },
        ],
      },
    ],
  },
]);

export default function App() {
  return (
    <FirebaseUIProvider ui={ui}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </FirebaseUIProvider>
  );
}