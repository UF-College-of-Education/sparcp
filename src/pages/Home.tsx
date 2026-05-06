import { PostTraining } from "../components/home/PostTraining";
import { WelcomeNewUser } from "../components/home/WelcomeNewUser";
import { useProgress } from "../context/ProgressContext";

export function Home() {

    const progress = useProgress();
    const trainingComplete = progress.unityComplete;

    return (
        <main className="w-full">
            {trainingComplete ?
                <PostTraining /> :
                <WelcomeNewUser />
            }
            
        </main>
    );
}