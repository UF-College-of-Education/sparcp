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
    url: string; // Optional
    type: "link" | "document";
    category: string;
}