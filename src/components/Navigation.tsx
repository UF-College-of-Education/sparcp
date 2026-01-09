import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  MessageCircle, 
  BookOpen, 
  BarChart3, 
  Settings, 
  User,
  ChevronRight,
  Award,
  House
} from "lucide-react";
import { NavLink } from "react-router";

const navigationItems = [
  { id: "home", label: "Home", icon: House, route: "/", submenu: false },
  { id: "training", label: "Training", icon: MessageCircle, route: "/training", submenu: true },
  { id: "resources", label: "Resources", icon: BookOpen, route: "/resources", submenu: false },
  { id: "progress", label: "My Progress", icon: BarChart3, route: "/reports", submenu: false },
  { id: "settings", label: "Settings", icon: Settings, route: "", submenu: false },
];

  export function Navigation() {
    const [isCollapsed, setIsCollapsed] = useState(false);
  
    return (
      <div className={`bg-card border-r transition-all duration-300 md:h-screen ${isCollapsed ? "w-16" : "w-64"}`}>
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
            <ul>
            {navigationItems.map((item) => {
              const Icon = item.icon;
              
              // Associate a submenu as a prop of the menu item
              // Set click listener to fetch and render submenu when needed
  
              return (                
                <li className="text-sm" key={item.id} >
                  <NavLink to={item.route} className="flex items-center p-3 hover:bg-gray-100 rounded-md">
                    <Icon className="w-4 h-4" /> 
                    <span className="pl-5">{item.label}</span>
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  </NavLink>
                </li>
                
              );
            })}
            </ul>
          </nav>
        </div>
      </div>
    );
  }