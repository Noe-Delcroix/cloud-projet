import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import toast from "react-hot-toast";

export const Application = () => {
    const navigate = useNavigate();

    const [session, setSession] = useState(JSON.parse(sessionStorage.getItem('userData')) || '');

    useEffect(() => {
        if (!session) {
            navigate('/login');
        }
    }, [session, navigate]);

    const logout = () => {
        console.log("logout")
        toast.success("Successfully logged out!")

        // Effacer les données de session
        sessionStorage.removeItem('userData');
        setSession('')

        navigate("/login")
    }

    return (
        <div className="h-full w-full">
            <div className="fixed w-full bg-white shadow">

                <div className="w-full flex flex-row items-center justify-between px-5 py-2">
                    <p className="text-3xl font-bold">Cloud App</p>

                    <div className="flex flex-row items-center">
                        <p className="mr-3">Logged as {session.idToken?.payload?.nickname}</p>
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={logout}>
                            Log out
                        </button>
                    </div>


                </div>


            </div>


            <div className="h-full flex flex-col bg-blue-600 mx-[150px]">
                <ul>
                    <li className="bg-white shadow p-3 my-3">message</li>
                    <li className="bg-white shadow p-3 my-3">message</li>
                    <li className="bg-white shadow p-3 my-3">message</li>
                    <li className="bg-white shadow p-3 my-3">message</li>
                    <li className="bg-white shadow p-3 my-3">message</li>
                    <li className="bg-white shadow p-3 my-3">message</li>
                </ul>
            </div>
        </div>
    )
}