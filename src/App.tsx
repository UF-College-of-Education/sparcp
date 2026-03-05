import { Navigation } from "./components/Navigation";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router";
import { Dashboard } from "./pages/Dashboard";
import { Reports } from "./pages/Reports";
import { LearningResources } from "./pages/LearningResources";
import { Login } from "./pages/Login";
import { Home } from "./pages/Home";
import { Training } from "./pages/Training";
import { Resources } from "./pages/Resources";
import SparcUnityPage from "./components/SparcUnityPage";

/**
 * Layout is used because useLocation can't be called
 * directly in App. It needs the context from the 
 * BrowserRouter component to fetch current route.
 */
function Layout() {
  const location = useLocation();
  const showNav = location.pathname !== "/login";

  return (
    <>
      {showNav && <Navigation />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/training" element={<Training />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}