import React, { useState } from 'react';
import UserPool from '../config/cognitoConfig';
import {CognitoUserAttribute} from "amazon-cognito-identity-js";
import {Link, useNavigate } from "react-router-dom"; // Assurez-vous que ce chemin mène à votre fichier de configuration Cognito

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const onSubmit = event => {
        event.preventDefault();
        setError('');

        const attributeList = [
            new CognitoUserAttribute({
                Name: 'nickname',
                Value: nickname
            })
        ];

        UserPool.signUp(email, password, attributeList, null, (err, data) => {
            if (err) {
                console.error(err);
                setError(err.message || JSON.stringify(err)); // Afficher le message d'erreur
                return;
            }
            console.log(data);
            navigate('/verify', { state: { email } }); // Redirection vers la page de vérification
        });
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <form onSubmit={onSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={nickname}
                        onChange={(event) => setNickname(event.target.value)}
                        placeholder="Nickname"
                    />
                </div>
                <div className="mb-4">
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="Email"
                    />
                </div>
                <div className="mb-6">
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                        value={password}
                        type="password"
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Password"
                    />
                </div>
                {error && <p className="text-red-500 text-xs italic">{error}</p>}
                <div className="flex items-center justify-between">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                        Signup
                    </button>
                </div>
            </form>
            <p className="text-center text-gray-500 text-xs">
                Already have an account? <Link to="/login" className="text-blue-500">Login</Link>
            </p>
        </div>
    );
};

export default Signup;