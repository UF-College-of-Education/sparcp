import { useState } from "react";
import { Navigation } from "./components/Navigation";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
  Navigate
} from "react-router";
import { Dashboard } from "./pages/Dashboard";
import { Reports } from "./pages/Reports";
import { LearningResources } from "./pages/LearningResources";
import { Login } from "./pages/Login";
import { Home } from "./pages/Home";
import { Training } from "./pages/Training";
import { Resources } from "./pages/Resources";
import SparcUnityPage from "./components/SparcUnityPage";

export default function App() {
  const [selectedFocusAreas, setSelectedFocusAreas] = useState<string[]>([]);

  const handleBackToDashboard = () => {
    setCurrentView("dashboard");
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case "dashboard":
        return <Dashboard/>;
        
      case "unity":
        return <SparcUnityPage />;
        
      case "resources":
        return <LearningResources />;
      case "reports":
        return <Reports />;
      case "settings":
        return (
          <div className="p-6">
            <h1 className="text-3xl font-semibold mb-4">
              Settings
            </h1>
            <p className="text-muted-foreground">
              Application settings and preferences coming
              soon...
            </p>
          </div>
        );
      default:
        return <Dashboard onStartNewSession={() => setCurrentView("start-session")} />;
    }
  };

  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/" element={ <Home />} />
        <Route path="/dashboard" element={ <Dashboard />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/training" element={<Training />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>      
  );
}