import React, { useState } from 'react';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const githubClientId = import.meta.env.VITE_GITHUB_CLIENTID;

    const handleGoogleSuccess = (credentialResponse: any) => {
        try {
            const decoded = jwtDecode(credentialResponse.credential);

            localStorage.setItem('userInfo', JSON.stringify(decoded));
            localStorage.setItem('credential', credentialResponse.credential);
            localStorage.setItem('authProvider', 'google');

            navigate('/empTable');
        } catch (error) {
            setError('Google authentication failed. Please try again.');
        }
    };

    const handleGoogleError = () => {
        setError('Google login failed. Please try again.');
    };

    const handleGithubLogin = () => {
     
        const callbackUrl = 'https://emp-payroll-class-components-git-main-rakshit6722s-projects.vercel.app';
        const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${githubClientId}&redirect_uri=${encodeURIComponent(callbackUrl)}&scope=user:email`;

        window.location.href = githubAuthUrl;
    };

    return (
        <>
            <Header container={"login"} />
            <div className="flex flex-col items-center justify-center min-h-[80vh] bg-[#F7F7F7]">
                <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
                    <div className="flex flex-col items-center">
                        <h2 className="text-2xl font-bold text-[#42515F] mb-6 text-center">
                            Employee Login
                        </h2>

                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 w-full" role="alert">
                                <span className="block sm:inline">{error}</span>
                            </div>
                        )}

                        <div className="mx-auto w-full flex flex-col items-center space-y-4">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={handleGoogleError}
                                useOneTap
                                width="300"
                            />

                            <div className="flex items-center w-full max-w-[300px]">
                                <div className="flex-grow border-t border-gray-300"></div>
                                <span className="px-3 text-gray-500 text-sm">OR</span>
                                <div className="flex-grow border-t border-gray-300"></div>
                            </div>

                            <button
                                onClick={handleGithubLogin}
                                className="flex items-center justify-center w-full max-w-[300px] bg-gray-800 hover:bg-gray-900 text-white font-medium py-2 px-4 rounded"
                            >
                                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" clipRule="evenodd" />
                                </svg>
                                Sign in with GitHub
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

const AuthWrapper: React.FC = () => {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    return (
        <GoogleOAuthProvider clientId={googleClientId}>
            <Login />
        </GoogleOAuthProvider>
    );
};

export default AuthWrapper;