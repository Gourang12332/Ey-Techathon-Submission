import React, { useState } from "react";

const Login: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    const login = () => {
        setError(null);

        if (email === "user@test.com" && password === "1234") {
            window.location.href = "/vehicles";
        } else {
            setError("Invalid email or password. Hint: user@test.com / 1234");
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4 sm:p-8 font-sans">
            <div className="w-full max-w-sm mx-auto bg-white p-8 rounded-xl shadow-2xl border border-gray-200 transition duration-500 ease-in-out">
                
                <h2 className="text-3xl font-extrabold text-center text-blue-600 mb-8 border-b-2 pb-3 border-blue-100">
                    System Login
                </h2>
                
                <div className="space-y-4">
                    <input 
                        placeholder="Email" 
                        type="email"
                        onChange={e => setEmail(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-inner 
                                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                                   text-gray-800 transition duration-150"
                    />
                    <input 
                        placeholder="Password" 
                        type="password" 
                        onChange={e => setPassword(e.target.value)} 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-inner 
                                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                                   text-gray-800 transition duration-150"
                    />
                </div>

                {error && (
                    <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 text-sm rounded-lg">
                        {error}
                    </div>
                )}
                
                <button 
                    onClick={login}
                    className="mt-6 w-full py-3 bg-blue-600 text-white text-lg font-bold 
                               rounded-xl shadow-lg shadow-blue-500/50 
                               transition-all duration-300 ease-in-out
                               transform hover:bg-blue-700 hover:scale-[1.01] hover:shadow-blue-600/60
                               focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50"
                >
                    Login
                </button>
                
                <p className="text-center text-xs text-gray-400 mt-6 pt-4 border-t border-gray-100">
                    Access to the Fleet Telemetry Console requires valid credentials.
                </p>

            </div>
        </div>
    );
}

export default Login;