import type { phaseCompletion } from "../../types";
import { Card } from "../ui/card";

export default function SessionDetails ({segmentData, segment}: {segmentData?: phaseCompletion, segment?: string } ) {
    if ((!segmentData) || (!segment) ){ 
        return <p className="p-4 col-span-2">Oops! Looks like we don't have any data for this segment of your session.</p>; 
    }

    return (
        <Card className="col-span-2 p-8"
            key={ segment }
        >
            <p>{segmentData.tryNextTime}</p>
        </Card>
    );
}