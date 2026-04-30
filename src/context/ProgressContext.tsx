import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router";

type ProgressContext = {
    didacticComplete: boolean;
    setDidacticComplete: (v:boolean)=>void;
    unityActive: boolean;
    surveyComplete: boolean;
    setSurveyComplete: (v:boolean)=>void;
};

const ProgressContext = createContext<ProgressContext | null>(null);

/**
 * Allows ProgressContext to be dynamically updated
 */
export function ProgressProvider ({ children }: { children: React.ReactNode }) {

    const [didacticComplete, setDidacticComplete] = useState(false);
    const [unityActive, setUnityActive] = useState(false);
    const [surveyComplete, setSurveyComplete]  = useState(false);
    
    // Update unityActive based on the current url path
    const location = useLocation();

    useEffect(()=>{    
        setUnityActive(['/training'].includes(location.pathname))
    }, [location]);


    return <ProgressContext.Provider 
        value={{
            didacticComplete,
            unityActive,
            surveyComplete,
            setSurveyComplete,
            setDidacticComplete
        }}>
        {children}
    </ProgressContext.Provider>;
}

/**
 * Used to access the ProgressContext within a ProgressProvider
 * @returns ProgressContext 
 */
export function useProgress() {
    const session = useContext(ProgressContext);
    if (!session) throw new Error("useProgress must be used in ProgressProvider");
    return session;
}