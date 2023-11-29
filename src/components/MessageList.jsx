import React from "react";
import { Message } from "./Message";
import { OwnMessage } from "./OwnMessage";

export const MessageList = ({ messages, user_id }) => {
    return (
        <div className="flex flex-col-reverse overflow-y-auto h-[calc(100vh-200px)]">
            {messages.map((message, index) =>
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
            )}
        </div>
    );
};