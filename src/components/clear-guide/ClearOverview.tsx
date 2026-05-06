import { 
    Award, 
    Ear, 
    Heart, 
    MessageCircleQuestionMarkIcon, 
    Sparkles, 
} from "lucide-react";
import { CardContent } from "../ui/card";

/**
 * ClearOverview
 * TODO: Move content to MDX for easy editing
 */

export default function ClearOverview () {
    return (
        <CardContent>
            <div className="mb-4">
                <h3 className="font-semibold text-lg text-primary"><span className="underline text-blue">
                    <Sparkles className="bg-yellow inline text-white rounded-full p-1 mr-2 w-8 h-8"/>C</span>ounsel</h3>
                <p className="pl-10">"We have a vaccine for 9-year-olds that prevents against six types of cancer. I recommend they get this safe vaccine today and then come back in 6 to 12 months to get the second dose."</p>
            </div>

            <div className="mb-4">
                <h3 className="font-semibold text-lg text-primary"><span className="underline text-blue">
                    <Ear className="bg-yellow inline text-white rounded-full p-1 mr-2 w-8 h-8" />L</span>isten</h3>
                <p className="pl-10">Allow time for the parent to state their concerns or questions, then restate or explore what they said.</p>
            </div>

            <div className="mb-4">
                <h3 className="font-semibold text-lg text-primary"><span className="underline text-blue">
                    <Heart className="bg-yellow inline text-white rounded-full p-1 mr-2 w-8 h-8" />E</span>mpathize</h3>
                <p className="pl-10">Acknowledge, validate, or normalize the parents’ concern or experience.</p>
            </div>

            <div className="mb-4">
                <h3 className="font-semibold text-lg text-primary"><span className="underline text-blue">
                    <MessageCircleQuestionMarkIcon className="bg-yellow inline text-white rounded-full p-1 mr-2 w-8 h-8" />A</span>nswer</h3>
                <p className="pl-10">Answer their questions. See tips for answering common questions on the reverse side of the card.</p>
            </div>

            <div className="mb-4">
                <h3 className="font-semibold text-lg text-primary"><span className="underline text-blue">
                    <Award className="bg-yellow inline text-white rounded-full p-1 mr-2 w-8 h-8" />R</span>ecommend</h3>
                <p className="pl-10">"Because the HPV vaccine prevents against six types of cancer, I strongly recommend that your child receive it today."</p>
            </div>
        </CardContent>
    );
}