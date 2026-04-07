import { useState } from "react";
import Placeholder1 from "../assets/placeholder-1.png";
import Placeholder2 from "../assets/placeholder-2.png";
import Placeholder3 from "../assets/placeholder-3.png";
import { WelcomeNewUser } from "../components/home/WelcomeNewUser";

export function Home() {

    return (
        <main className="">
            <WelcomeNewUser />

            <section className="bg-gray-100 space-y-6 p-12 pr-20">
                <div>
                    <h2 className="text-2xl mb-4 font-semibold">What to expect for this training?</h2>
                    <p className="max-w-[800px]">During this training, you will interact with an AI avatar using your microphone to have a realistic conversation with a mock patient. This training uses an AI model trained on past conversations from live training sessions, and it will respond to you as a parent might in the real world. At various checkpoints, you will also hear from a virtual coach who will provide feedback based on your conversation.</p>
                </div>
                
                <div className="columns-3 gap-20 pt-8 pb-8">
                    <figure className="flex flex-col items-center">
                        <img 
                            src={Placeholder1}
                            alt="Doctor receives instructions"
                            className="mb-4"
                            width={"280"}
                        />
                        <figcaption className="">
                            <h3 className="text-xl font-semibold mb-2">Instructions</h3>
                            <p>You will receive specific instructions before each training segment.</p>
                        </figcaption>
                    </figure>

                    <figure className="flex flex-col items-center">
                        <img 
                            src={Placeholder2}
                            alt="Doctor interacts with online content"
                            className="mb-4 text-center"
                            width={"280"}
                        ></img>
                        <figcaption className="">
                            <h3 className="text-xl font-semibold mb-2">Interact</h3>
                            <p>Next you will speak with the virtual parent as if they are in the room with you.</p>
                        </figcaption>
                    </figure>

                    <figure className="flex flex-col items-center">
                        <img 
                            src={Placeholder3}
                            alt="Doctor receives feedback"
                            className="mb-4 text-center"
                            width={"280"}
                        ></img>
                        <figcaption className="">
                            <h3 className="text-xl font-semibold mb-2">Feedback</h3>
                            <p>A virtual coach will appear on screen to provide feedback on what went well during the session and what can be improved.</p>
                        </figcaption>
                    </figure>
                </div>
            </section>
        </main>
    );
}