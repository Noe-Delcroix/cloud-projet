import React, {useEffect, useState} from 'react';
import { CognitoUser } from 'amazon-cognito-identity-js';
import UserPool from '../config/cognitoConfig';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";

const VerifyAccount = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [email] = useState(location.state?.email || '');
    const [code, setCode] = useState('');

    useEffect(() => {
        if (!email) {
            navigate('/login');
        }
    }, [email, navigate]);

    const onSubmit = event => {
        event.preventDefault();

        if (!code || code.length !== 6) {
            toast.error('Code must be 6 digits');
            return;
        }

        const user = new CognitoUser({
            Username: email,
            Pool: UserPool
        });

        toast.promise(
            new Promise((resolve, reject) => {
                user.confirmRegistration(code, true, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            }),
            {
                loading: 'Verifying account...',
                success: 'Account verified successfully! Please login.',
                error: err => `${err.message || JSON.stringify(err)}`
            }
        ).then(() => {
            navigate('/login', { state: { email } });
        }).catch(err => {

        });
    };

    const resendVerificationCode = () => {
        const user = new CognitoUser({
            Username: email,
            Pool: UserPool
        });

        toast.promise(
            new Promise((resolve, reject) => {
                user.resendConfirmationCode((err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            }),
            {
                loading: 'Resending code...',
                success: 'Verification code resent. Check your email.',
                error: err => `Error resending code: ${err.message || JSON.stringify(err)}`
            }
        );
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="lg:w-1/3 sm:w-2/3 w-full  flex flex-col items-center justify-center bg-white shadow-md rounded px-8 py-4 mb-4">
                <h1 className="text-2xl font-bold mb-8">Verify your account</h1>

                <p className="mb-2 text-center">Please enter the 6 digits code that was sent to you at <strong className="text-blue-500">{email}</strong></p>

                <p className="mb-2 text-[0.7em] text-center">
                    Can't find your verification code?
                    <button
                        onClick={resendVerificationCode}
                        className="text-blue-500 underline pl-1 focus:outline-none mr-1"
                        type="button"
                    >
                        Click here
                    </button>
                     to send a new one.
                </p>

                <form onSubmit={onSubmit} className="w-full flex flex-col items-center">
                    <div className="mb-4 w-2/3">
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={code}
                            type="text"
                            onChange={(event) => setCode(event.target.value)}
                            placeholder="Verification Code"
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                            Verify Account
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VerifyAccount;