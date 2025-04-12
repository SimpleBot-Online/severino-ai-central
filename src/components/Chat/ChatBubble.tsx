import React from 'react';

const ChatBubble = ({ onClick }) => {
    return (
        <div onClick={onClick} className="bg-neon-green p-2 rounded-full cursor-pointer">
            💬
        </div>
    );
};

export default ChatBubble;
