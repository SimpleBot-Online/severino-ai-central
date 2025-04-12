import React, { useState } from 'react';

const ChatInput = () => {
    const [message, setMessage] = useState('');

    const handleSend = () => {
        // TODO: Implement send message logic
        console.log('Message sent:', message);
        setMessage('');
    };

    return (
        <div className="bg-black border border-neon-green p-4 rounded-lg">
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="bg-black text-neon-green border border-neon-green p-2 w-full mb-2"
                placeholder="Type your message..."
            />
            <button 
                onClick={handleSend}
                className="bg-neon-green text-black px-4 py-2 rounded hover:bg-opacity-80"
            >
                Send
            </button>
        </div>
    );
};

export default ChatInput;
