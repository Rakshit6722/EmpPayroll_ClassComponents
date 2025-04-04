import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';

const GitHubCallback: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const githubClientId = import.meta.env.VITE_GITHUB_CLIENTID;
    const githubClientSecret = import.meta.env.VITE_GITHUB_CLIENTSECRET;

    useEffect(() => {
        const handleCallback = async () => {

            const searchParams = new URLSearchParams(location.search);
            const code = searchParams.get('code');
            console.log("Code", code)

            if (!code) {
                setError('Authorization code not found');
                setLoading(false);
                return;
            }

            try {
                const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
                const tokenUrl = `${proxyUrl}https://github.com/login/oauth/access_token`;

                const response = await fetch(tokenUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        client_id: githubClientId,
                        client_secret: githubClientSecret,
                        code: code,
                        redirect_uri: 'http://localhost:5173/github/callback'
                    })
                });

                const data = await response.json();

                console.log("Data", data)

                if (data.error) {
                    throw new Error(data.error_description || 'Failed to get access token');
                }

                const accessToken = data.access_token;

                console.log("Access Token", accessToken)


                const userResponse = await fetch('https://api.github.com/user', {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Accept': 'application/vnd.github.v3+json'
                    }
                });

                const userData = await userResponse.json();


                const emailResponse = await fetch('https://api.github.com/user/emails', {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Accept': 'application/vnd.github.v3+json'
                    }
                });

                const emails = await emailResponse.json();
                const primaryEmail = emails[0]?.email;


                const userInfo = {
                    ...userData,
                    given_name: userData.name,
                    email: primaryEmail
                };


                localStorage.setItem('userInfo', JSON.stringify(userInfo));
                localStorage.setItem('credential', accessToken);
                localStorage.setItem('authProvider', 'github');


                navigate('/empTable');
            } catch (error: any) {
                console.error('GitHub authentication error:', error);
                setError(`Failed to authenticate with GitHub: ${error.message}`);
                setLoading(false);
            }
        };

        handleCallback();
        
    }, [location, navigate, githubClientId, githubClientSecret]);

    return (
        <>
            <Header container={"login"} />
            <div className="flex flex-col items-center justify-center min-h-[80vh] bg-[#F7F7F7]">
                <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
                    <div className="flex flex-col items-center">
                        <h2 className="text-2xl font-bold text-[#42515F] mb-6 text-center">
                            GitHub Authentication
                        </h2>

                        {loading && (
                            <div className="flex flex-col items-center">
                                <svg className="animate-spin h-10 w-10 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <p className="mt-4 text-gray-600">Processing GitHub authentication...</p>
                            </div>
                        )}

                        {/* {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 w-full" role="alert">
                                <span className="block sm:inline">{error}</span>
                                <div className="mt-4">
                                    <button 
                                        onClick={() => navigate('/')} 
                                        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
                                    >
                                        Back to Login
                                    </button>
                                </div>
                            </div>
                        )} */}
                    </div>
                </div>
            </div>
        </>
    );
};

export default GitHubCallback;