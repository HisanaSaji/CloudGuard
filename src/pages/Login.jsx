import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { Shield, AlertCircle } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            if (auth) {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                localStorage.setItem("dev_bypass", "true");
            }
            navigate('/dashboard');
        } catch (err) {
            if (err.code === 'auth/invalid-credential') {
                setError('Invalid email or password.');
            } else {
                setError(err.message || 'Failed to login');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#030712] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-inter">
            {/* Background gradients similar to LandingPage */}
            <div
                className="absolute inset-0 z-0 pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse at center, #1a1f35 0%, #0a0e1a 40%, #030712 100%)',
                }}
            ></div>

            <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center flex-col items-center">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-blue-500/10 border border-blue-500/20 mb-6 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                        <Shield className="w-8 h-8 text-blue-400" />
                    </div>
                    <h2 className="mt-2 text-center text-3xl font-extrabold text-white tracking-tight">
                        Security Console
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-400">
                        Sign in to access CloudGuard
                    </p>
                </div>
            </div>

            <div className="relative z-10 mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div
                    className="border border-gray-700/50 py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10"
                    style={{
                        backgroundColor: 'rgba(15, 25, 45, 0.6)',
                        backdropFilter: 'blur(12px)',
                    }}
                >
                    <form className="space-y-6" onSubmit={handleLogin}>
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-center">
                                <AlertCircle className="h-5 w-5 text-red-400 mr-2 flex-shrink-0" />
                                <span className="text-sm text-red-400">{error}</span>
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                                Email address
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none block w-full px-4 py-3 border border-gray-600 rounded-xl shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm bg-gray-900/50 text-white transition-all duration-200"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none block w-full px-4 py-3 border border-gray-600 rounded-xl shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm bg-gray-900/50 text-white transition-all duration-200"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold tracking-wide text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                                style={{
                                    boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)',
                                }}
                            >
                                {isLoading ? 'Signing in...' : 'Sign in'}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="mt-6 text-center">
                    <a href="/" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">
                        &larr; Return to Home
                    </a>
                </div>
            </div>
        </div>
    );
}
