import React, { useState } from 'react';
import { EyeIcon, EyeOffIcon } from '@heroicons/react/outline';

const PasswordInput = ({ value,placeholder, onChange }) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = (event) => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="flex flex-row shadow border rounded w-full py-2 px-3 text-gray-700 mb-3 ">
            <input
                className="w-full appearance-none leading-tight focus:outline-none focus:shadow-outline"
                type={showPassword ? 'text' : 'password'}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
            />
            <button
                className=""
                type="button"
                onClick={togglePasswordVisibility}
            >
                {showPassword ? (
                    <EyeOffIcon className="h-5 w-5 text-gray-700" onClick={togglePasswordVisibility} />
                ) : (
                    <EyeIcon className="h-5 w-5 text-gray-700" onClick={togglePasswordVisibility} />
                )}
            </button>
        </div>
    );
};

export default PasswordInput;