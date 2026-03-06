// Page: Resources 
export interface Module {
    id: string;
    letter: string;
    title: string;
    description: string;
    duration: string;
    completed: boolean;
    content: {
      keyPoints: string[];
      examples: string[];
    };
}

export interface Video {
    id: number;
    title: string;
    description: string;
    url: string | null; // Optional
    duration: string;
    skills: string[];
    host: "Youtube" | "Vimeo" | "Other";
    embedCode: string | null; //Optional
    // Possibly add thumbnail in the future
}

export interface ResourceListing {
    id: number;
    title: string;
    description?: string; // Optional no default
    url: string;
    type: "link" | "document";
    category: string;
}

/**
 * Messages received FROM Unity (iframe to React)
 */
export type InboundUnityMessage =
  | { type: "UNITY_READY"; data: { ready: boolean; timestamp: string } }
  | { type: "UNITY_SESSION_EVENT"; data: any }
  | { type: "UNITY_ANALYTICS_EVENT"; data: { eventName: string; eventData: any } }
  | { type: "UNITY_ERROR"; data: { errorType: string; errorMessage: string } }
  | { type: "UNITY_REQUEST_DATA"; data: { requestType: string; requestId: string; parameters: any } }
  | { type: string; data: any }; // fallback for unknown Unity messages

/**
 * Messages sent TO Unity (React to iframe)
 */
export type OutboundUnityMessage =
  | { type: "REACT_TO_UNITY_SESSION"; data: { sessionData: Record<string, any> } }
  | { type: "REACT_TO_UNITY_COMMAND"; data: { command: string } };