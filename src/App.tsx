import { useState } from "react";
import { Navigation } from "./components/Navigation";
import { Dashboard } from "./components/Dashboard";
import { AvatarChat } from "./components/AvatarChat";
import { LearningResources } from "./components/LearningResources";
import { StartNewSession } from "./components/StartNewSession";
import SparcUnityPage from "./components/SparcUnityPage";

export default function App() {
  const [currentView, setCurrentView] = useState("dashboard");
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(null);
  const [selectedFocusAreas, setSelectedFocusAreas] = useState<string[]>([]);

  const handleStartSession = (scenarioId: string, focusAreas: string[] = []) => {
    setSelectedScenarioId(scenarioId);
      setSelectedFocusAreas(focusAreas);  
    setCurrentView("practice");
  };

  const handleBackToDashboard = () => {
    setCurrentView("dashboard");

  };

  const renderCurrentView = () => {
    switch (currentView) {
      case "dashboard":
        return <Dashboard onStartNewSession={() => setCurrentView("start-session")} />;
      case "start-session":
        return (
          <StartNewSession 
            onBack={handleBackToDashboard}
            onStartSession={handleStartSession}
          />
        );
      case "practice":
        return <AvatarChat             
        selectedScenarioId={selectedScenarioId}
        selectedFocus={selectedFocusAreas}    
        
        />;
        
      case "unity":
        return <SparcUnityPage />;
        
      case "resources":
        return <LearningResources />;
      case "analytics":
        return (
          <div className="p-6">
            <h1 className="text-3xl font-semibold mb-4">
              Analytics
            </h1>
            <p className="text-muted-foreground">
              Detailed analytics and progress tracking coming
              soon...
            </p>
          </div>
        );
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