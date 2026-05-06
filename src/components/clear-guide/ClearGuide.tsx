import { 
    BookOpenText,
    X 
} from "lucide-react";
import { useState } from "react";
import { 
    Card,
    CardHeader,
    CardTitle 
} from "../ui/card";
import ClearOverview from "./ClearOverview";
import ClearFaqs from "./ClearFaqs";
import ClearGuideSectionToggle from "./ClearGuideSectionToggle";


/**
 * ClearGuide
 * Controls content shown in Clear Guide
 * @param   {bool}  isCollapsed 
 * 
 */

export function ClearGuide ({isCollapsed}: {isCollapsed: boolean}) {
    const [ isOpen, setIsOpen ] = useState(false);
    const [ activeSection, setActiveSection] = useState(1);

    const tabIds: Record<number, string> = {
        1: "tab-overview",
        2: "tab-faqs",
    };

    return (
        <div className="clear-guide-container m-2">
            {!isOpen && (<button 
                title="Open Clear Guide Card"
                className={`bg-primary text-white text-center border-primary border-2 rounded-lg p-2 my-2 text-center transition-all duration-300 flex justify-center items-center ${isCollapsed? 'm-0 w-12 h-12' : 'ml-0 w-full'}`}
                aria-label="Open Clear Guide Card"
                onClick={ ()=>{setIsOpen(prev => !prev);} }
            >   
                <BookOpenText className="h-6 w-6 inline" />
                <span className={`text-s font-semibold overflow-hidden transition-all duration-300 delay-300 ${isCollapsed ? ' opacity-0 w-0 h-0' : 'px-2 opacity-100 w-auto'}`}>CLEAR Guide</span>
            </button>)}

            <Card 
                id="ClearGuideCard" 
                className={`w-96 max-h-full bg-white absolute z-40 top-8 left-0 transition-all duration-300  ${isOpen?  '-ml-2' :'-ml-96 opacity-0'} `}
            >
                <button
                    title="Close Clear Guide Card" 
                    className="absolute -right-4 -top-4 z-50 bg-red text-white rounded-full"
                    onClick={()=>{setIsOpen(prev => !prev);} }
                    aria-label="Close Clear Guide Card"
                    
                >
                    <X className="h-8 w-8 p-1" /><span className="sr-only">Close</span>
                </button>

                <CardHeader className="bg-primary rounded-t-lg text-white mb-4">
                    <CardTitle className="text-xxl">Make a C-LEAR&trade; Endorsement</CardTitle>
                </CardHeader>

                <ClearGuideSectionToggle
                    activeSection={activeSection}
                    clickHandler={setActiveSection}
                    sectionContainerId="clearGuideContentContainer"
                />

                <div 
                    id="clearGuideContentContainer"
                    className="clearGuideContentContainer overflow-y-auto z-40"
                    role="tabpanel"
                    aria-labelledby={tabIds[activeSection]}
                >
                    { activeSection == 1 && <ClearOverview /> }

                    { activeSection == 2 && <ClearFaqs/> }
                </div>
            </Card>  
        </div>
    );
}