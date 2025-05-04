import React from 'react';

function ChatBubble({ text, isUser }) {
  return (
    <div className={`chat-bubble ${isUser ? 'user' : 'confidant'}`}>
      <div className="chat-bubble-content">
        <p>{text}</p>
      </div>
    </div>
  );
}

export default ChatBubble;
