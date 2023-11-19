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

    const [lastKey, setLastKey] = useState(null);
    const [hasMoreMessages, setHasMoreMessages] = useState(true);

    //loading states
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const [isSendingMessage, setIsSendingMessage] = useState(false);


    useEffect(() => {
        if (!session) {
            navigate('/login');
        }else {
            fetchMessages();
        }
    }, [session]);

    const fetchMessages = async () => {
        setIsLoadingMessages(true);
        try {

            const params = {
                limit: 5,
            };
            if (lastKey) {
                params.lastKey = lastKey;
            }
            //console.log("sending : ",params)

            const response = await axios.get('https://396fjl6556.execute-api.eu-west-1.amazonaws.com/dev/messages?lastkey='+lastKey+'&limit=10', {
                headers: {
                    Authorization: `Bearer ${session.idToken.jwtToken}`
                }
            });
            const data= JSON.parse(response.data?.body);
            //console.log("received : ",data);
            setMessages(prevMessages => [...prevMessages, ...data.data]);
            setLastKey(data.lastKey);
            setHasMoreMessages(data.lastKey !== null);
        } catch (error) {
            toast.error('Failed to fetch messages:', error);
        }
        setIsLoadingMessages(false);
    };

    const loadMoreMessages = () => {
        fetchMessages();
    };

    const handleNewMessageChange = (event) => {
        setNewMessage(event.target.value);
    };

    const sendMessage = async () => {
        if (!newMessage.trim()) return;

        setIsSendingMessage(true);

        const messageBody = {
            user_id: session.idToken.payload.sub,
            content: newMessage
        };

        try {
            const response = await axios.post('https://396fjl6556.execute-api.eu-west-1.amazonaws.com/dev/messages', {
                body: JSON.stringify(messageBody)
            },{
                headers: {
                    Authorization: `Bearer ${session.idToken.jwtToken}`
                }
            });

            setMessages(prevMessages => [
                {
                    user_id: session.idToken.payload.sub,
                    content: newMessage,
                    date: new Date().toISOString()
                },
                ...prevMessages
            ]);

            setNewMessage('');
            setIsSendingMessage(false)
        } catch (error) {
            toast.error(`Failed to send message: ${error}`);
            setIsSendingMessage(false)
        }

    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    };

    const logout = () => {
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

                {isLoadingMessages &&
                    <div className="flex justify-center items-center">
                        <BeatLoader color="#4A90E2" size={15} />
                    </div>}

                {hasMoreMessages &&
                    <button
                        onClick={loadMoreMessages}
                        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Load More Messages
                    </button>
                }

            </div>


            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white shadow">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={handleNewMessageChange}
                        onKeyDown={handleKeyPress}
                        className="flex-1 p-2 border rounded"
                        placeholder="Write a message..."
                        disabled={isSendingMessage}
                    />
                    <button
                        onClick={sendMessage}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        disabled={isSendingMessage}
                    >
                        {isSendingMessage ? <BeatLoader color="#4A90E2" size={15} /> : "Send"}
                    </button>
                </div>
            </div>
        </div>
    )
}