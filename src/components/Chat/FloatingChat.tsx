import React, { useState } from 'react';
import ChatBubble from './ChatBubble';
import ChatInput from './ChatInput';

const FloatingChat = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="fixed bottom-4 right-4">
            <ChatBubble onClick={toggleChat} />
            {isOpen && <ChatInput />}
        </div>
    );
};

export default FloatingChat;
