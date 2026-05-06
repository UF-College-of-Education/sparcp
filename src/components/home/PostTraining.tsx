import { Button } from "@firebase-oss/ui-react";

export function PostTraining() {

    const surveyUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSczmUFQOxjN3yGZQ1AVEyMppvjF-TIt4jogNVzbIa6BAyRfaw/viewform';

    return (
        <div className="flex flex-col w-[600px] p-12 m-auto h-full items-center justify-center">
            <h1 className="text-4xl font-semibold mb-8">Tell Us What You Think</h1>
            <p className="mb-8">Thanks for completing the HPV Vaccine Communication Training Simulation. Please complete the short survey below to share your feedback.</p>
            <Button 
                className="bg-yellow px-8 py-4 font-semibold text-lg mb-12 border-2 border-yellow hover:bg-white"
                onClick={()=>{window. open(surveyUrl, "_blank") }}
            >
                Complete Survey
            </Button>  
        </div>
    );
}