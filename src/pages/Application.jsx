import React, {useCallback, useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import {Message} from "../components/Message";
import {OwnMessage} from "../components/OwnMessage";
import {BeatLoader} from "react-spinners";
import {format, isSameDay, parseISO, startOfDay} from 'date-fns';
import {ChevronUpIcon} from "@heroicons/react/solid";

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

    const scrollRef = useRef(null);
    const [showScrollToTopButton, setShowScrollToTopButton] = useState(false);


    useEffect(() => {
        if (!session) {
            navigate('/login');
        }else {
            fetchMessages();
        }
    }, [session]);

    const fetchMessages = async () => {
        if (!hasMoreMessages || isLoadingMessages) return;
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
            scrollToTop();
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

    const onScroll = () => {
        if (scrollRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
            if (scrollTop + clientHeight >= scrollHeight * 0.95) {
                fetchMessages();
            }
            setShowScrollToTopButton(scrollTop > 500);
        }
    };

    const scrollToTop = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    };


    const groupedMessages = () => {
        const grouped = [];
        let lastDate = null;

        const today = startOfDay(new Date());
        messages.forEach(message => {
            const messageDate = parseISO(message.date);
            if ((!lastDate || !isSameDay(lastDate, messageDate)) && !isSameDay(messageDate, today)) {
                grouped.push({ type: 'date', date: messageDate });
                lastDate = messageDate;
            }
            grouped.push(message);
        });

        return grouped;
    };

    return (
        <div className="h-[100vh] w-[100-vw]">
            <div className="fixed top-0 w-full bg-white shadow h-[60px]">
                <div className="w-full flex flex-row items-center justify-between px-5 py-2">
                    <div className="flex flex-row items-center">
                        <img className="w-[50px]" src={`${process.env.PUBLIC_URL}/logo.png`} alt="logo" />
                        <p className="text-3xl ml-4 font-bold sm:block hidden">ThunderChat</p>
                    </div>
                    <div className="flex flex-row items-center">
                        <p className="mr-3 font-bold ">Logged as {session.idToken?.payload?.nickname}</p>
                        <p className="mr-3 text-[0.7em] md:block hidden">(aka "{session.idToken?.payload?.sub}")</p>
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={logout}>
                            Log out
                        </button>
                    </div>
                </div>
            </div>


            <div className="h-full w-full flex flex-col justify-center items-center shadow-xl">
                <div className="md:h-2/3 h-full md:w-2/3 w-full overflow-y-auto flex flex-col bg-gray-100 px-5 md:mt-0 mt-[60px]"
                onScroll={onScroll} ref={scrollRef}>

                    {groupedMessages().map((item, index) => (
                        item.type === 'date' ? (
                            <div key={index}
                                 className="text-center text-gray-500 text-sm py-2 border-b-2">
                                {format(item.date, 'EEEE d MMMM yyyy')}
                            </div>
                        ) : (
                            item.user_id === session.idToken.payload.sub ? (
                                <OwnMessage
                                    key={index}
                                    date={item.date}
                                    content={item.content}
                                />
                            ) : (
                                <Message
                                    key={index}
                                    userId={item.user_id}
                                    date={item.date}
                                    content={item.content}
                                />
                            )
                        )
                    ))}

                    {isLoadingMessages &&
                        <div className="flex justify-center items-center">
                            <BeatLoader color="#4A90E2" size={15} />
                        </div>}

                </div>

                <div className={`md:bottom-[20px] md:right-[20px] fixed bottom-[90px] right-[20px] z-50 w-[50px] h-[50px] ${showScrollToTopButton ? 'block' : 'hidden'}`}>
                    <button
                        className="bg-blue-500 w-full h-full text-white font-bold py-2 px-4 rounded-full shadow-xl"
                        onClick={scrollToTop}>
                        <ChevronUpIcon></ChevronUpIcon>
                    </button>
                </div>

                <div className="md:w-2/3 w-full p-4 bg-white shadow">
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
        </div>
    )
}