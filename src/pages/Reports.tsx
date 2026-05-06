import { RecentSessions } from "../components/reports/RecentSessions";

export function Reports(){
    return (
        <main className="p-6 border w-full ">
            <h1 className="text-3xl font-bold mb-10 mt-4 ml-6">
                My Progress & Feedback
            </h1>
       
            <RecentSessions />
        </main>
    );
}