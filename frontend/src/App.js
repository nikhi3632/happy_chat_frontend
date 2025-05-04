import useRecording from './hooks/useRecording';
import ChatWindow from './components/ChatWindow';
import MicButton from './components/MicButton';
import ResetButton from './components/ResetButton';
import './styles/styles.css';

function App() {
  const {
    chatHistory,
    state,
    handleMicClick,
    handleResetChat,
    userSpeaking
  } = useRecording();

  return (
    <div className="app">
      <div className="header">
        <h2>Happy Chat</h2>
        <ResetButton onClick={handleResetChat} />
      </div>
      <ChatWindow chatHistory={chatHistory} />
      <div className="controls">
        <MicButton onClick={handleMicClick} state={state} speaking={userSpeaking} />
      </div>
    </div>
  );
}

export default App;
