import { useState } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  MenuIcon,
  MessageCircle, 
  BookOpen, 
  BarChart3, 
  Settings, 
  User,
  ChevronRight,
  Award,
  House,
  LogOut
} from "lucide-react";
import { NavLink } from "react-router";
import { useAuth } from "../context/AuthContext";
import { MenuTrayControlButton } from "./MenuTrayControlButton";
import { ClearGuide } from "./clear-guide/ClearGuide";

const navigationItems = [
  { id: "home", label: "Home", icon: House, route: "/", submenu: false },
  { id: "training", label: "Training", icon: MessageCircle, route: "/training", submenu: true },
  { id: "resources", label: "Resources", icon: BookOpen, route: "/resources", submenu: false },
  { id: "progress", label: "My Progress", icon: BarChart3, route: "/reports", submenu: false },
  { id: "settings", label: "Settings", icon: Settings, route: "", submenu: false },
];

export function Navigation() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const {logout} = useAuth();

  return (
    <div className={`bg-card relative border-r transition-all duration-300 md:h-screen ${isCollapsed ? "w-16 " : "w-64"}`}>
      <div className={`p-2 border-b flex items-center justify-center transition-all duration-300 ${isCollapsed ? "w-16" : "w-64"}`}>
        <div className={`flex items-center gap-0 ${isCollapsed ? 'h-auto' : 'h-20'}`}>
          
          <div 
            className={`bg-primary rounded-lg flex items-center justify-center transition-all duration-300 delay-200 h-10 ${isCollapsed ? 'w-10 opacity-100' : 'w-0 opacity-0' }`} 
            onClick={() => setIsCollapsed(prev => !prev)}
          >
            <MenuIcon className={`text-primary-foreground transition-all duration-300 h-6 delay-200 ${isCollapsed ? 'w-10 opacity-100' : 'w-0 opacity-0' }`} strokeWidth={3} />
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
          <nav id="sparc-nav" className={`space-y-1 overflow-hidden transition-all duration-300 ${isCollapsed ? 'h-0 opacity-0' : 'delay-200 opacity-100 h-auto'}`} >
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

              <li>
                <button
                  className="text-sm mt-6 flex items-center p-3 hover:bg-gray-100 rounded-md"
                  onClick={logout}
                >
                  <LogOut className="w-4 h-4" />
                  <span className="pl-5">Logout</span>
                </button>
              </li>
            </ul>
          </nav>
        <MenuTrayControlButton
          handleClick={() => setIsCollapsed(prev => !prev)}
          isCollapsed={isCollapsed}
        />
      </div>

    </div>
  );
}