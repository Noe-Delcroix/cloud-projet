import React, { useState } from 'react';
import { CognitoUser } from 'amazon-cognito-identity-js';
import UserPool from '../config/cognitoConfig';
import { useLocation } from 'react-router-dom';

const VerifyAccount = () => {
    const location = useLocation();
    const [email, setEmail] = useState(location.state?.email || '');
    const [code, setCode] = useState('');

    const onSubmit = event => {
        event.preventDefault();

        const user = new CognitoUser({
            Username: email,
            Pool: UserPool
        });

        user.confirmRegistration(code, true, (err, result) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log(result);
        });
    };

    return (
        <div>
            <form onSubmit={onSubmit}>
                <input
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Email"
                />
                <input
                    value={code}
                    type="text"
                    onChange={(event) => setCode(event.target.value)}
                    placeholder="Verification Code"
                />
                <button type="submit">Verify Account</button>
            </form>
        </div>
    );
};

export default VerifyAccount;