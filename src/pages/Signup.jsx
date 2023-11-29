import React, { useState } from 'react';
import UserPool from '../config/cognitoConfig';
import {CognitoUserAttribute} from "amazon-cognito-identity-js";
import {Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import PasswordInput from "../components/Passwordinput";

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const navigate = useNavigate();

    const onSubmit = event => {
        event.preventDefault();

        if (!email || !password || !nickname || !confirmPassword) {
            toast.error('Please fill out all fields');
            return;
        }

        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        const attributeList = [
            new CognitoUserAttribute({
                Name: 'nickname',
                Value: nickname
            })
        ];

        toast.promise(
            new Promise((resolve, reject) => {
                UserPool.signUp(email, password, attributeList, null, (err, data) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(data);
                    }
                });
            }),
            {
                loading: 'Creating account...',
                success: 'Account created successfully! Please verify your account.',
                error: err => `Error: ${err.message || JSON.stringify(err)}`
            }
        ).then(() => {
            navigate('/verify', { state: { email } });
        }).catch(err => {

        });
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="lg:w-1/3 sm:w-2/3 w-full flex flex-col items-center justify-center bg-white shadow-md rounded px-8 py-4 mb-4">
                <h1 className="text-2xl font-bold mb-8">Create an account</h1>
                <form onSubmit={onSubmit} className="w-full flex flex-col items-center">
                    <div className="mb-4 lg:w-2/3 w-3/4">
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={nickname}
                            onChange={(event) => setNickname(event.target.value)}
                            placeholder="Username"
                        />
                    </div>
                    <div className="mb-4 lg:w-2/3 w-3/4">
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="Email"
                        />
                    </div>
                    <div className="mb-2 lg:w-2/3 w-3/4">
                        <PasswordInput
                            value={password}
                            placeholder="Password"
                            onChange={(event) => setPassword(event.target.value)}
                        />
                    </div>
                    <div className="mb-2 lg:w-2/3 w-3/4">
                        <PasswordInput
                            value={confirmPassword}
                            placeholder="Confirm Password"
                            onChange={(event) => setConfirmPassword(event.target.value)}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                            Create account
                        </button>
                    </div>
                </form>
            </div>
            <p className="text-center text-gray-500 text-xs">
                Already have an account? <Link to="/login" className="text-blue-500">Login</Link>
            </p>
        </div>
    );
};

export default Signup;