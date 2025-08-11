import { useState } from "react";
import { Navigation } from "./components/Navigation";
import { Dashboard } from "./components/Dashboard";
import { AvatorChat } from "./components/AvatorChat";
import { LearningResources } from "./components/LearningResources.tsx";

export default function App() {
  const [currentView, setCurrentView] = useState("dashboard");

  const renderCurrentView = () => {
      switch (currentView) {
        case "dashboard":
          return <Dashboard />;
        case "practice":
          return <AvatorChat />;
        case "resources":
          return <LearningResources />;
        case "analytics":
          return(
            <div className="p-6">
              <h1 className="text-3xl font-semibold mb-4">
                Analytics
              </h1>
              <p className="text-muted-foreground">
              Detailed analytics and progress tracking coming
              </p>
            </div>

          );

          case "settings":
            return(
              <div className="p-6">
                <h1 className="text-3xl font-semibold mb-4">
                  Settings
                </h1>
                <p className="text-muted-foreground">
                Settings and preferences coming soon!
                </p>
              </div>
            );
        default:
          return <Dashboard />;

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