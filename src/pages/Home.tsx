import { Button } from "../components/ui/button";
import { useState } from "react";
import Placeholder1 from "../../src/assets/placeholder-1.png";
import Placeholder2 from "../../src/assets/placeholder-2.png";
import Placeholder3 from "../../src/assets/placeholder-3.png";

export function Home() {
    const [userName, setUserName] = useState("Clinician")

    // Probably hard coding the text for now. We can figure out how to make it editable later.

    return (
        <main className="">
            <section className="sparc-welcome mt-6 space-y-6 p-12 pr-20">
                <h1 className="text-4xl font-semibold">Welcome, {userName}!</h1>

            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-20 space-y-6 p-12 pr-20 pb-10">
                <div className="sparc-column">
                    <h2 className="text-2xl mb-4 font-semibold">About the Training</h2>
                    <p className="mb-4">This training uses an AI avatar to help you practice using the CLEAR model to recommend the HPV vaccine. There will be two types of training sessions. First, you will complete the a guided training session where you will practice specific parts of the CLEAR model separately. Then in the Booster session, you will practice a full conversation with an AI patient.</p>
                    <Button className="bg-black">Start the Training</Button>
                </div>

                <div className="sparc-column2 border-2 border-black aspect-video p-6">
                    <p className="">Video Here</p>
                    <iframe src="" title="SPARC Training Welcome Video"></iframe>
                </div>
            </section>

            <section className="bg-gray-100 space-y-6 p-12 pr-20">
                <div>
                    <h2 className="text-2xl mb-4 font-semibold">What to expect for this training?</h2>
                    <p className="max-w-[800px]">During this training, you will interact with an AI avatar using your microphone to have a realistic conversation with a mock patient. This training uses an AI model trained on past conversations from live training sessions, and it will respond to you as a parent might in the real world. At various checkpoints, you will also hear from a virtual coach who will provide feedback based on your conversation.</p>
                </div>
                
                <div className="columns-3 gap-20 pt-8 pb-8">
                    <figure>
                        <img 
                            src={Placeholder1}
                            alt=""
                            className=""
                        ></img>
                        <figcaption className="">
                            <h3 className="text-2xl">Instructions</h3>
                            <p>You will receive specific instructions before each training segment.</p>
                        </figcaption>
                    </figure>

                    <figure>
                        <img 
                            src={Placeholder2}
                            alt=""
                            className=""
                        ></img>
                        <figcaption className="">
                            <h3 className="text-2xl">Interact</h3>
                            <p>Next you will speak with the virtual parent as if they are in the room with you.</p>
                        </figcaption>
                    </figure>

                    <figure>
                        <img 
                            src={Placeholder3}
                            alt=""
                            className=""
                        ></img>
                        <figcaption className="">
                            <h3 className="text-2xl">Feedback</h3>
                            <p>A virtual coach will appear on screen to provide feedback on what went well during the session and what can be improved.</p>
                        </figcaption>
                    </figure>
                </div>
            </section>
        </main>
    );
}