import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { EmailLinkAuthForm } from "@firebase-oss/ui-react";
import logo from "../assets/SPARC_Logo_BlueMulticolor.png"

export function Login () {
    const { isLoggedIn } = useAuth();

    return (
        <main className="sparc-login-container flex flex-1 justify-items-center content-center">
            {isLoggedIn ? 
                <Navigate to="/" /> : 
                <div className="sparc-login-content space-y-8 w-1/4 max-w-md border-style-solid m-auto">
                    <div className="pb-2"><img src={logo} width="320" className="m-auto"/> </div>
                    <h1 className="text-2xl font-bold text-center pb-0">Please Login To Continue</h1>

                    <EmailLinkAuthForm/>

                </div>
            }
        </main>
    );
}