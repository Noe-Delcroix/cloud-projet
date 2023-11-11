import React, { useState } from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import UserPool from '../config/cognitoConfig';
import {Link} from "react-router-dom";
import toast from "react-hot-toast";

const Login = () => {
    const location = useLocation();
    const [email, setEmail] = useState(location.state?.email || '');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Ajout de useNavigate

    const onSubmit = event => {
        event.preventDefault();

        const user = new CognitoUser({
            Username: email,
            Pool: UserPool
        });

        const authDetails = new AuthenticationDetails({
            Username: email,
            Password: password
        });

        user.authenticateUser(authDetails, {
            onSuccess: data => {
                console.log('onSuccess:', data);
                toast.success('Successfully logged in!')
                navigate('/app', { state: { data } });
            },
            onFailure: err => {
                console.error('onFailure:', err);

                if (err.code === 'UserNotConfirmedException') {
                    navigate('/verify', { state: { email } });
                    toast.error('Your account is not verified. Please verify your account.');
                    return
                }

                toast.error(err.message || JSON.stringify(err));
            },
            newPasswordRequired: data => {
                console.log('newPasswordRequired:', data);
            }
        });
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="w-1/3 flex flex-col items-center justify-center bg-white shadow-md rounded px-8 py-4 mb-4">
                <h1 className="text-2xl font-bold mb-8">Log In</h1>

                <form onSubmit={onSubmit} className="w-full flex flex-col items-center">
                    <div className="mb-4 w-2/3">
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={email}
                            onChange={event => setEmail(event.target.value)}
                            placeholder="Email"
                        />
                    </div>
                    <div className="mb-2 w-2/3">
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                            value={password}
                            type="password"
                            onChange={event => setPassword(event.target.value)}
                            placeholder="Password"
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                            Login
                        </button>
                    </div>
                </form>
            </div>
            <p className="text-center text-gray-500 text-xs">
                Don't have an account? <Link to="/signup" className="text-blue-500">Sign up</Link>
            </p>
        </div>
    );
};

export default Login;