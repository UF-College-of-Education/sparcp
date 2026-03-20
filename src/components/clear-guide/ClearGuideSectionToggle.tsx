/**
 * ClearSectionGuideToggle
 * Controls which section of the Guide is displayed
 * 
 * TODO: Spin the functionality into a general purpose toggle
 */

type Props = {
    activeSection: number;
    clickHandler: (section: number) => void;
    sectionContainerId: string; // Section controlled by the toggle
}

export default function ClearGuideSectionToggle ({activeSection, clickHandler, sectionContainerId}: Props) {
    return (
        <div>
            <div 
                className="inline-block my-4 m-6 border border-gray off-white rounded-3xl "
                role="tablist"
            >
                <button 
                    title="Show CLEAR Method Overview"
                    id="tab-overview"
                    className={`py-2 px-4 rounded-3xl font-semibold  ${activeSection==1 ? 'bg-white' : ''} `}
                    onClick={()=>clickHandler(1)} 
                    aria-controls={sectionContainerId}
                    aria-label="CLEAR Method Overview"
                    role="tab"
                    aria-selected={activeSection == 1} >
                    Overview
                </button>
                <button 
                    title="Show CLEAR Method FAQs"
                    id="tab-faqs"
                    className={`px-4 py-2 rounded-3xl font-semibold ${activeSection==2 ? 'bg-white' : ''} `}
                    onClick={()=>clickHandler(2)}
                    aria-controls={sectionContainerId}
                    aria-label="CLEAR Method FAQs"
                    role="tab"
                    aria-selected={activeSection == 2} >
                    FAQs
                </button>
            </div>
        </div>
    );
}
