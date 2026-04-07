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