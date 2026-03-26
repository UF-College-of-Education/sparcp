import { 
    CircleQuestionMark, 
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
        <div className="clear-guide-container absolute bottom-2">
            {!isOpen && (<button 
                title="Open Clear Guide Card"
                className={`bg-black text-white text-center border-black border-2 rounded-lg p-2 m-2 text-center transition-all duration-300 flex justify-center items-center ${isCollapsed? '-ml-2 w-12' : 'ml-0'}`}
                aria-label="Open Clear Guide Card"
                onClick={ ()=>{setIsOpen(prev => !prev);} }
            >   
                <CircleQuestionMark className="h-6 w-6 inline" />
                <span className={`text-s font-semibold overflow-hidden ${isCollapsed ? ' opacity-0 w-0' : 'px-2 opacity-100 w-auto'}`}>Guide</span>
            </button>)}

            {isOpen && (
                <Card 
                    id="ClearGuideCard" 
                    className="w-96 max-h-full bg-white relative -ml-2 z-40 "
                >
                    <button
                        title="Close Clear Guide Card" 
                        className="absolute -right-4 -top-4 z-50 bg-red text-white rounded-full"
                        onClick={()=>{setIsOpen(false)}}
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
            )}
        </div>
    );
}