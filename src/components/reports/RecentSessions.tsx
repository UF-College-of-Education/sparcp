import { useEffect, useState } from "react";
import { Card } from "../ui/card"
import { SessionEntry } from "./SessionEntry";
import SessionDetails from "./SessionDetails";
import Button from "../ui/button";


const sessions = [
    {
        id: "abcdefghi",
        createdAt: "3/31/26 8:00 PM",
        phaseCompletions: [
            {
                phaseName: 'counsel',
                tryNextTime: 'Counsel data'
            },
            {
                phaseName: 'listen',
                tryNextTime: 'Listen data'
            }
        ]

    },
    {
        id: "bcdefghij",
        createdAt: "3/31/26 2:00 PM",
        phaseCompletions: [
            {
                phaseName: 'listen',
                tryNextTime: 'Listen data'
            }
        ]
    }
]



export function RecentSessions () {

    const [ sessionEntries, setSessionEntries ] = useState(sessions); // All sessions available - shape SessionData[]
    const [ selectedSession, setSelectedSession] = useState(''); // Id of session to pull from sessionEntries
    const [ currentSegment, setCurrentSegment] = useState(''); // Id of segement within selectedSession to display
    const [ segmentData, setSegmentData] = useState({}) // Actual data that gets displayed

    function handleSessionSelection (sessionId: string) {
        setCurrentSegment('');
        setSelectedSession(sessionId);
    }
    
    function handleSegmentClick( selectedSegment: string ) {
        setCurrentSegment(selectedSegment);
    }

    useEffect(
        ()=> {
            const allSegmentData = sessionEntries[0].phaseCompletions;
            const newSegmentData = allSegmentData.filter(
                phaseData=>phaseData.phaseName == currentSegment
            );
            setSegmentData(newSegmentData[0]);
        }, [currentSegment]
    );

    return (
        <div className="w-full grid grid-cols-4 gap-8 w-full">
            <Card 
                className="px-6 py-4 w-full font-bold h-fit" 
            >
                <h2 className="text-xl mb-4 mx-4 font-bold">Choose a Session</h2>
                <div 
                    className="overflow-auto max-h-page" 
                    role="tablist"
                >
                    {sessionEntries.map(
                        (session)=> {
                            return (
                                <Button
                                    className={`px-2 py-6 my-2 w-full text-md text-center text-black border-2 border-gray-300 bg-white focus:bg-white hover:bg-white hover:border-gray-800 hover:shadow-md ${selectedSession==session.id ? 'border-4 border-primary font-bold' : ''}`}
                                    key={session.id}
                                    aria-selected= { selectedSession==session.id ? true : false }
                                    role="tab"
                                    onClick={ ()=>{ handleSessionSelection( session.id )}}
                                >
                                    <p>{session.createdAt}</p>
                                </Button>
                            )
                        }
                    )}
                </div>
            </Card>

            { selectedSession == '' ? 
                <p className="p-4 col-span-2">Select a session to view your training feedback.</p> :
                <SessionEntry 
                    sessionData = {sessionEntries.find( entry => entry.id == selectedSession)} 
                    selectedSegment={currentSegment}
                    onClick={handleSegmentClick}
                />
            }

            { currentSegment == '' ? '' :
                <SessionDetails 
                    segmentData = {segmentData} 
                    segment = {currentSegment}
                /> 
            }
        </div>
    );
}