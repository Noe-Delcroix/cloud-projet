import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import {Message} from "../components/Message";
import {OwnMessage} from "../components/OwnMessage";
import {BeatLoader} from "react-spinners";

export const Application = () => {
    const navigate = useNavigate();

    const [session, setSession] = useState(JSON.parse(sessionStorage.getItem('userData')) || '');
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        if (!session) {
            navigate('/login');
        }else {
            fetchMessages();
        }
    }, [session, navigate]);

    const fetchMessages = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('https://396fjl6556.execute-api.eu-west-1.amazonaws.com/dev/messages', {
                headers: {
                    Authorization: `Bearer ${session.idToken.jwtToken}`
                }
            });
            console.log(response.data?.body)
            setMessages(JSON.parse(response.data?.body));
        } catch (error) {
            toast.error('Failed to fetch messages:', error);
        }
        setIsLoading(false);
    };

    const handleNewMessageChange = (event) => {
        setNewMessage(event.target.value);
    };

    const sendMessage = async () => {
        if (!newMessage.trim()) return;

        setIsLoading(true);

        const messageBody = {
            user_id: session.idToken.payload.sub,
            content: newMessage
        };

        try {
            // Send a POST request to the specified URL with the required body format
            const response = await axios.post('https://396fjl6556.execute-api.eu-west-1.amazonaws.com/dev/messages', {
                body: JSON.stringify(messageBody)
            });

            setNewMessage('');
            fetchMessages(); // Reload messages to include the new one
        } catch (error) {
            toast.error(`Failed to send message: ${error}`);
            setIsLoading(false);
        }

    };

    const logout = () => {
        console.log("logout")
        toast.success("Successfully logged out!")

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
                        <p className="mr-3">Logged as {session.idToken?.payload?.nickname} (aka "{session.idToken?.payload?.sub}")</p>
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={logout}>
                            Log out
                        </button>
                    </div>
                </div>
            </div>


            <div className="h-full flex flex-col-reverse mx-[150px] pt-[60px] pb-[70px] bg-gray-200 shadow px-5">
                {isLoading ? (
                    <div className="flex justify-center items-center">
                        <BeatLoader color="#4A90E2" size={15} /> {/* Using BeatLoader */}
                    </div>
                ) : (
                    <ul>
                        {messages.map((message, index) => (
                            message.user_id === session.idToken.payload.sub ? (
                                <OwnMessage
                                    key={index}
                                    date={message.date}
                                    content={message.content}
                                />
                            ) : (
                                <Message
                                    key={index}
                                    userId={message.user_id}
                                    date={message.date}
                                    content={message.content}
                                />
                            )
                        ))}
                    </ul>
                )}
            </div>


            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white shadow">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={handleNewMessageChange}
                        className="flex-1 p-2 border rounded"
                        placeholder="Write a message..."
                    />
                    <button
                        onClick={sendMessage}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    )
}