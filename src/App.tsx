import { useState } from "react";
import { Navigation } from "./components/Navigation";
import { Dashboard } from "./pages/Dashboard";
import { LearningResources } from "./pages/LearningResources";
import { Reports } from "./pages/Reports";
import SparcUnityPage from "./components/SparcUnityPage";

export default function App() {
  const [currentView, setCurrentView] = useState("dashboard");
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
    <div className="flex h-screen bg-background">
      <Navigation
        currentView={currentView}
        onViewChange={setCurrentView}
      />
      <main className="flex-1 overflow-auto">
        {renderCurrentView()}
      </main>
    </div>
  );
}