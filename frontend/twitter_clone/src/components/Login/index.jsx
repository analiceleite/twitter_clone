import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import { useNavigate } from 'react-router-dom';

import { login, register, resetPassword } from '../../api/login_api';

const Login = ({ onLogin }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [isLoginMode, setIsLoginMode] = useState(true);
    const [isResetPasswordMode, setIsResetPasswordMode] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            if (isLoginMode) {
                const result = await login(email, password);
                console.log("Login result:", result);

                if (result.success) {
                    localStorage.setItem('user_token', result.data.access);
                    localStorage.setItem('user_refresh_token', result.data.refresh);
                    setEmail('');
                    setPassword('');
                    onLogin();
                    navigate('/home');
                } else {
                    setError(result.message || "Error logging in.");
                }
            } else if (isResetPasswordMode) {
                const result = await resetPassword(email);
                console.log("Reset password result:", result);

                if (result.success) {
                    setSuccessMessage("Password redefined successfully.");
                    setEmail('');
                } else {
                    setError(result.message || "Error redefining the password.");
                }
            } else {
                const result = await register(name, email, password);
                console.log("Register result:", result);

                if (result.success) {
                    setSuccessMessage(result.message);
                    setEmail('');
                    setPassword('');
                    setName('');
                    setIsLoginMode(true);
                } else {
                    setError(result.message || "Error during the registration.");
                }
            }
        } catch (error) {
            setError("Unespected error. Try again.");
            console.log("Erro:", error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = () => {
        setIsResetPasswordMode(true);
        setIsLoginMode(false);
        setPassword('');
        setConfirmPassword('');
    };

    return (
        <div className="flex h-screen bg-gray-900">
            <div className="flex-grow flex items-center justify-center">
                <form onSubmit={handleSubmit} className="p-6 rounded-lg w-96">
                    <div className='absolute top-10'>
                        <FontAwesomeIcon icon={faTwitter} className="text-6xl text-twitter-blue" />
                    </div>

                    {isResetPasswordMode ? (
                        <div className="mb-4">
                            <input
                                type="email"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-gray-700 text-white rounded py-2 px-4"
                                required
                            />
                        </div>
                    ) : (
                        <>
                            {!isLoginMode && (
                                <div className="mb-4">
                                    <input
                                        type="text"
                                        placeholder="Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-gray-700 text-white rounded py-2 px-4"
                                        required
                                    />
                                </div>
                            )}
                            <div className="mb-4">
                                <input
                                    type="email"
                                    placeholder="Email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-gray-700 text-white rounded py-2 px-4"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-gray-700 text-white rounded py-2 px-4"
                                    required
                                />
                            </div>
                        </>
                    )}

                    {isResetPasswordMode && (
                        <>
                            <div className="mb-4">
                                <input
                                    type="password"
                                    placeholder="New Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-gray-700 text-white rounded py-2 px-4"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <input
                                    type="password"
                                    placeholder="Confirm New Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full bg-gray-700 text-white rounded py-2 px-4"
                                    required
                                />
                            </div>
                        </>
                    )}

                    {!isLoginMode ? (
                        <p className='mb-8 text-sm'>By signing up, you agree with our <span className='text-twitter-blue font-bold cursor-pointer hover:underline'>Terms of Use</span></p>
                    ) : (
                        <p className='mb-8 text-sm'>
                            {isResetPasswordMode ? "Remembered your password? " : "Forgot your password? "}
                            <span className='text-twitter-blue font-bold cursor-pointer hover:underline' onClick={handleResetPassword}>
                                {isResetPasswordMode ? "Back to Login" : "Click here"}
                            </span>
                        </p>
                    )}
                    <button
                        type="submit"
                        className="w-full bg-twitter-blue text-white font-bold py-2 rounded hover:bg-blue-600 transition duration-200"
                    >
                        {isResetPasswordMode ? 'Send' : (isLoginMode ? 'Login' : 'Sign Up')}
                    </button>
                    <div className='absolute bottom-12'>
                        <p className='mt-6'>
                            {isLoginMode ? 'Not a member? ' : 'Already a member? '}
                            <span
                                className='text-twitter-blue font-bold cursor-pointer hover:underline'
                                onClick={() => {
                                    setIsLoginMode(!isLoginMode);
                                    setIsResetPasswordMode(false);
                                    setEmail('');
                                    setPassword('');
                                    setName('');
                                    setConfirmPassword('');
                                }}
                            >
                                {isLoginMode ? 'Sign Up' : 'Login'}
                            </span>
                        </p>
                    </div>
                    {error && <p className="text-red-500 mt-4">{error}</p>}
                    {successMessage && <p className="text-green-500 mt-4">{successMessage}</p>}
                </form>
            </div>
            <div className="w-5/12 hidden md:flex flex-col items-center justify-center bg-gray-800 text-white p-6">
                <h2 className="text-2xl text-center mb-4">
                    It's what's happening
                </h2>
                <div className="flex items-center">
                    <h1 className="text-4xl font-bold mr-2 font-Comfortaa">Twitter</h1>
                    <FontAwesomeIcon icon={faTwitter} className="text-4xl" />
                </div>
            </div>
        </div>
    );
};

export default Login;
