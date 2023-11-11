import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import UserPool from '../config/cognitoConfig';
import {Link} from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Ajout de useNavigate

    const onSubmit = event => {
        event.preventDefault();
        setError(''); // Réinitialiser l'erreur

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
                //TODO : Ajouter la logique de redirection en cas de succès
            },
            onFailure: err => {
                console.error('onFailure:', err);
                setError(err.message || JSON.stringify(err)); // Afficher le message d'erreur

                if (err.code === 'UserNotConfirmedException') {
                    navigate('/verify', { state: { email } });
                }
            },
            newPasswordRequired: data => {
                console.log('newPasswordRequired:', data);
            }
        });
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <form onSubmit={onSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={email}
                        onChange={event => setEmail(event.target.value)}
                        placeholder="Email"
                    />
                </div>
                <div className="mb-6">
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                        value={password}
                        type="password"
                        onChange={event => setPassword(event.target.value)}
                        placeholder="Password"
                    />
                </div>
                {error && <p className="text-red-500 text-xs italic">{error}</p>}
                <div className="flex items-center justify-between">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                        Login
                    </button>
                </div>
            </form>
            <p className="text-center text-gray-500 text-xs">
                Don't have an account? <Link to="/signup" className="text-blue-500">Sign up</Link>
            </p>
        </div>
    );
};

export default Login;