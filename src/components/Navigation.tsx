import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  LayoutDashboard, 
  MessageCircle, 
  BookOpen, 
  BarChart3, 
  Settings, 
  User,
  ChevronRight,
  Award,
  Gamepad2
} from "lucide-react";

interface NavigationProps {
    currentView: string;
    onViewChange: (view: string) => void;
}

const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "practice", label: "AI Practice", icon: MessageCircle },
    { id: "unity", label: "Unity Practice", icon: Gamepad2 },
    { id: "resources", label: "Learning Resources", icon: BookOpen },
    { id: "reports", label: "Reports", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ];
  
  export function Navigation({ currentView, onViewChange }: NavigationProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);
  
    return (
      <div className={`bg-card border-r transition-all duration-300 ${isCollapsed ? "w-16" : "w-64"}`}>
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-primary-foreground" />
            </div>
            {!isCollapsed && (
              <div>
                <h2 className="font-semibold">SPARC-P</h2>
                <p className="text-xs text-muted-foreground">Communication Training</p>
              </div>
            )}
          </div>
        </div>
  
        <div className="p-4">
          {!isCollapsed && (
            <Card className="p-3 mb-4 bg-primary/5 border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-primary" />
                <span className="font-medium text-sm">Dr. Sarah Williams</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-3 h-3 text-primary" />
                <span className="text-xs text-muted-foreground">Pediatrician</span>
                <Badge variant="secondary" className="text-xs ml-auto">Pro</Badge>
              </div>
            </Card>
          )}
  
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "secondary" : "ghost"}
                  className={`w-full justify-start ${isCollapsed ? "px-3" : "px-3"}`}
                  onClick={() => onViewChange(item.id)}
                >
                  <Icon className="w-4 h-4" />
                  {!isCollapsed && (
                    <>
                      <span className="ml-3">{item.label}</span>
                      {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                    </>
                  )}
                </Button>
              );
            })}
          </nav>
        </div>
  
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-4 -right-3 bg-background border shadow-sm rounded-full w-6 h-6 p-0"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <ChevronRight className={`w-3 h-3 transition-transform ${isCollapsed ? "" : "rotate-180"}`} />
        </Button>
      </div>
    );
  }