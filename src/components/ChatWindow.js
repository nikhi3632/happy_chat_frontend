import ChatBubble from './ChatBubble';

function ChatWindow({ chatHistory }) {
  return (
    <div className="chat-window">
      {chatHistory.map((msg, i) => (
        <ChatBubble
          key={i}
          {...msg}
          isUser={msg.sender === 'User'}
        />
      ))}
    </div>
  );
}

export default ChatWindow;
