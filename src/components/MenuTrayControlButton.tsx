import { ArrowRightCircleIcon } from "lucide-react";

/**
 * MenuTrayControlButton
 * Button to expand and collapse side menu.
 * 
 * @param   {function}  handleClick     pass in setter function to update isCollapsed state
 * @param   {state}     isCollapsed     isCollapsed state passed in from parent
 */
export function MenuTrayControlButton({ handleClick, isCollapsed }: { handleClick: () => void; isCollapsed: boolean }) {
    
    return (
        <button
            className="sparc-open-menu shadow-sm bg-white absolute -right-4 bottom-1/2 rounded-full z-30"
            onClick={handleClick}
            aria-expanded={isCollapsed ? false : true}
            aria-controls="sparc-nav"
            aria-label={isCollapsed ? "Expand Menu" : "Collapse Menu"}
            title={ isCollapsed ? 'Expand Menu' : 'Collapse Menu'}
        >
            <ArrowRightCircleIcon size={32} className={`transition-all delay-300 duration-300 ${isCollapsed? 'rotate-0' : '-rotate-180'}`}/>
        </button>
    );
}