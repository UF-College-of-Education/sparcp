import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export function Login () {
    const [username, setUserName] = useState('');
    const [pw, setPw] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const success = login(username, pw);
        if (success) {
            navigate("/");
        } else {
            setError("Invalid username or password.");
        }
    };

    return (
        <main className="sparc-login-container flex-1 justify-items-center content-center">
            <div className="sparc-login-content space-y-8 w-1/4 max-w-md border-style-solid">
                <h1 className="text-2xl font-bold">Please Login To Continue</h1>
                <form id="sparc-login-form" onSubmit={handleSubmit}>
                    <fieldset>
                        <label htmlFor="sparc-username">Username</label>
                        <input
                            id="sparc-username"
                            type="text"
                            className="block w-full grow bg-transparent py-1.5 pr-3 pl-1 mt-0.5 mb-1.5 border-style-solid border-black border-2 text-base placeholder:text-gray-500 border-black sm:text-sm/6 "
                            value={username}
                            onChange={(e)=>setUserName(e.target.value)}
                        />
                    </fieldset>

                    <fieldset>
                        <label htmlFor="sparc-pw">Password</label>
                        <input
                            id="sparc-pw"
                            name="password"
                            type="password"
                            className="block w-full grow bg-transparent py-1.5 pr-3 pl-1 mt-0.5 mb-1.5 border-style-solid border-black border-2 text-base placeholder:text-gray-500 border-black sm:text-sm/6 "
                            value={pw}
                            onChange={(e)=>setPw(e.target.value)}
                        />
                    </fieldset>

                    {error && <p className="text-red-600 text-sm mt-1">{error}</p>}

                    <div className="text-right">
                        <button
                            type="submit"
                            id="login-submit"
                            className="bg-black mt-2 text-white px-6 py-3 hover:bg-gray-600">
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}