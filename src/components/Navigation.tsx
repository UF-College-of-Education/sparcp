import { useCallback, useEffect, useState } from "react";
import sparcLogo from "../assets/SPARC_Logo_BlueMulticolor.png";
import sparcIcon from "../assets/sparc-icon.svg";
import { 
  MenuIcon,
  MessageCircle, 
  BookOpen, 
  BarChart3, 
  ChevronRight,
  House,
  LogOut,
  TriangleAlert,
} from "lucide-react";
import { NavLink, useBlocker, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";
import { MenuTrayControlButton } from "./MenuTrayControlButton";
import { ClearGuide } from "./clear-guide/ClearGuide";
import { useProgress } from "../context/ProgressContext";
import { Confirm } from "./ui/confirm";

const navigationItems = [
  { id: "home", label: "Home", icon: House, route: "/", submenu: false, permissions: [] },
  { id: "training", label: "Training", icon: MessageCircle, route: "/clear", submenu: true, permissions: [] },
  { id: "resources", label: "Resources", icon: BookOpen, route: "/resources", submenu: false, permissions: [] },
  { id: "progress", label: "My Progress", icon: BarChart3, route: "/reports", submenu: false, permissions: ['dev'] },
];

export function Navigation() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const {logout, permissions} = useAuth();
  const location = useLocation();
  const {unityActive} = useProgress();

  // Collapse menu automatically on training page
  useEffect(()=>{
      if( location.pathname == '/training') setIsCollapsed(true);
    },
    [location.pathname]
  );

  // Show Confirmation Box if user tries to leave training early
  const confirmNavigation = useCallback<()=>boolean>( 
    ()=>{ return unityActive },
    [unityActive]
  );

  const blocker = useBlocker(confirmNavigation);

  const handleConfirm = () => {
    (blocker.state=='blocked') ? blocker.proceed() : console.log('Blocker not available.');
  }

  const handleCancel = () => {
    if (blocker.state=='blocked') {
      blocker.reset() }
      // Return focus to Unity window?
    else {
      console.log('Blocker not available.');
    }
  }

  return (
    <div className={`bg-card relative border-r transition-all duration-300 md:h-screen ${isCollapsed ? "w-16 " : "w-64"}`}>
      <div className={`p-2 border-b flex items-center justify-center transition-all duration-300 ${isCollapsed ? "w-16" : "w-64"}`}>
        <div className={`flex items-center gap-0 ${isCollapsed ? 'h-auto' : 'h-20'}`}>
          
          <div 
            className={`bg-yellow rounded-lg flex items-center justify-center transition-all duration-300 delay-200 h-12 ${isCollapsed ? 'w-12 opacity-100' : 'w-0 opacity-0' }`} 
          >
            <img 
              alt="SPARC-P Logo"
              width="28"
              height="28"
              className="w-full"
              src={sparcIcon}
            />
            {/* <MenuIcon className={`text-primary-foreground transition-all duration-300 h-6 delay-200 ${isCollapsed ? 'w-10 opacity-100' : 'w-0 opacity-0' }`} strokeWidth={3} /> */}
          </div>
          
          <div className={`overflow-hidden transition-all duration-300  ${isCollapsed ? 'w-0 h-0' : 'w-auto h-auto'}`}>
            <p><img 
              alt="SPARC-P Logo"
              className="w-44 pt-4 pl-2"
              src={sparcLogo}
            /></p>
          </div>
        </div>
      </div>

      <ClearGuide isCollapsed={isCollapsed}></ClearGuide>

      <button 
        className={`bg-black border-black-800 border rounded-lg m-2 flex items-center justify-center transition-all duration-300 delay-200 h-12 ${isCollapsed ? 'w-12 opacity-100' : 'w-0 h-0 opacity-0 absolute' }`} 
        onClick={()=>{setIsCollapsed(prev=>!prev)}}
      >
        <MenuIcon className={`text-primary-foreground transition-all duration-300 h-6 delay-200 ${isCollapsed ? 'w-10 opacity-100' : 'w-0 opacity-0' }`} strokeWidth={3} />
      </button>
      
      <div className="p-4">
          <nav id="sparc-nav" className={`space-y-1 overflow-hidden transition-all duration-300 ${isCollapsed ? 'h-0 opacity-0' : 'delay-200 opacity-100 h-auto'}`} >
            <ul>
            {navigationItems.map((item) => {
              const Icon = item.icon;
              let hasPermissions;
              
              // Check if user has permissions to access that item
              if (  Array.isArray(item.permissions) &&  item.permissions.length > 0 ) {
                hasPermissions = item.permissions.some(role=>permissions.includes(role));
              } else {
                hasPermissions = true;
              }

              // Skip item if user doesn't have permissions to view
              if(! hasPermissions) return null;

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

      {
        // Show pop-up if user tries to leave training earlier
        blocker.state === "blocked" ? (<>
          <Confirm onConfirm={handleConfirm} onCancel={handleCancel}>
            <TriangleAlert className="text-primary mb-4 mx-auto w-20 h-20 " />
            <p>You will lose your progress if you leave now. Are you sure that you want to leave?</p>
          </Confirm>
        </>) : null
      } 

    </div>
  );
}