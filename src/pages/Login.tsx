import React, { useState } from 'react';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

interface UserInfo {
    name: string;
    email: string;
    picture?: string;
}

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

    const handleSuccess = (credentialResponse: any) => {
        try {
            const decoded = jwtDecode(credentialResponse.credential);

      
            localStorage.setItem('userInfo', JSON.stringify(decoded));
            localStorage.setItem('credential', credentialResponse.credential);


            navigate('/empTable');
        } catch (error) {
            console.error('Error decoding credential', error);
            setError('Authentication failed. Please try again.');
        }
    };

    const handleError = () => {
        setError('Login Failed. Please try again.');
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

                        <GoogleLogin
                            onSuccess={handleSuccess}
                            onError={handleError}
                            useOneTap
                            width="300"
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

const GoogleAuthWrapper: React.FC = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

    return (
        <GoogleOAuthProvider clientId={clientId}>
            <Login />
        </GoogleOAuthProvider>
    );
};

export default GoogleAuthWrapper;