import type { SessionData } from "../../types";
import Button from "../ui/button";
import { Card } from "../ui/card";

type SessionEntry = {
    sessionData?: SessionData;
    selectedSegment?: string;
    onClick: ( selectedSegment: string ) => void;
}

export function SessionEntry ( {sessionData, selectedSegment, onClick }: SessionEntry ) {

    if ( !sessionData ) {
        return (
            <p>There has been an error retrieving your results.</p>
        );
    }

    return (
        <Card className="h-fit p-4">
            <div className="mb-8">
                <h2 className="text-xl font-bold mb-2">Choose a Session Segment</h2>
            </div>

            <div>
                <div className="mb-8" role="tablist">
                    <h3 className="text-lg font-semibold">Practice 1</h3>
                    <Button 
                        className={`px-2 py-6 my-1 w-full text-md text-center text-black border-2 border-gray-300 focus:bg-white  bg-white hover:border-gray-800 hover:shadow-md hover:bg-white ${selectedSegment == 'counsel' ? 'border-4 border-primary' : '' }`}
                        onClick={()=>onClick("counsel")}
                        role="tab"
                    >
                        Counsel
                    </Button>

                    <Button 
                        className={`px-2 py-6 my-1 w-full text-md text-center text-black border-2 border-gray-300 focus:bg-white  hover:border-gray-800 bg-white hover:shadow-md hover:bg-white ${selectedSegment == 'listen' ? 'border-4 border-primary' : '' }`}
                        onClick={()=>onClick("listen")}
                        role="tab"
                    >
                        Listen
                    </Button>
                    
                    <Button 
                        className={`px-2 py-6 my-1 w-full text-md text-center text-black border-2 border-gray-300 focus:bg-white  hover:border-gray-800 bg-white hover:shadow-md hover:bg-white ${selectedSegment == 'empathize' ? 'border-4 border-primary' : '' }`}
                        onClick={()=>onClick("empathize")}
                        role="tab"
                    >
                        Empathize
                    </Button>
                    
                    <Button 
                        className={`px-2 py-6 my-1 w-full text-md text-center text-black border-2 border-gray-300 focus:bg-white  hover:border-gray-800 bg-white hover:shadow-md hover:bg-white ${selectedSegment == 'answer' ? 'border-4 border-primary' : '' }`}
                        onClick={()=>onClick("answer")}
                        role="tab"
                    >
                        Answer/Recommend
                    </Button>
                    
                    
                    <Button 
                        className={`px-2 py-6 my-1 w-full text-md text-center text-black border-2 border-gray-300 focus:bg-white  hover:border-gray-800 bg-white hover:shadow-md hover:bg-white ${selectedSegment == 'summary' ? 'border-4 border-primary' : '' }`}
                        onClick={()=>onClick("summary")}
                        role="tab"
                    >
                        Summary
                    </Button>
                </div>
                <div>
                    <h3 className="text-lg font-semibold">Practice 2</h3>
                    <Button 
                        className={`px-2 py-6 my-1 w-full text-md text-center text-black border-2 border-gray-300 focus:bg-white hover:border-gray-800 bg-white hover:shadow-md hover:bg-white ${selectedSegment == 'summary2' ? 'border-4 border-primary' : '' }`}
                        onClick={()=>onClick("summary2")}
                        role="tab"
                    >
                        Summary
                    </Button>
                </div>

                <Button className="bg-yellow text-black font-semibold mt-8 border-2 border-yellow hover:bg-gray-100 hover:border-gray-800 hover:shadow-md" >
                    Download All Session Data
                </Button>
            </div>
        </Card>
    );
}