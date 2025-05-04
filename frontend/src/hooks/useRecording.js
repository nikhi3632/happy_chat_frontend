import { useState } from 'react';
import { useMicVAD } from '@ricky0123/vad-react';
import { STATES } from '../constants/uiStates';
import { generateUUID } from '../utils/uuid';
import { audioBufferToWavMono } from '../utils/audioBufferTowav';
import { transcribeAudio, thinkAndRespond } from '../services/api';

function useRecording() {
  const [state, setState] = useState(STATES.IDLE);
  const [chatHistory, setChatHistory] = useState([]);
  const [conversationId, setConversationId] = useState(generateUUID());
  const [userSpeaking, setUserSpeaking] = useState(false); // REACTIVE

  const vad = useMicVAD({
    onSpeechStart: () => {
      setUserSpeaking(true);
    },
    onSpeechEnd: async (audio) => {
      setUserSpeaking(false);

      if (state !== STATES.RECORDING) return;

      if (!(audio instanceof Float32Array)) {
        console.error("Invalid audio buffer", audio);
        return;
      }
      if (!audio || audio.numberOfChannels === 0) {
        console.error('Invalid audioBuffer: No channels found!');
        return;
      }

      const sampleRate = 16000;
      const channelBuffers = [audio]; // Mono audio only

      const wavData = audioBufferToWavMono(sampleRate, channelBuffers);
      const blobAudio = new Blob([wavData], { type: 'audio/wav' });
      setState(STATES.TRANSCRIBING);

      const result = await transcribeAudio(blobAudio);
      const userText = result['transcription'];

      setChatHistory(prev => [...prev, { text: userText, sender: 'User' }]);

      setState(STATES.THINKING);
      const { replyText, audioBlob } = await thinkAndRespond(userText, conversationId);

      setChatHistory(prev => [...prev, { text: replyText, sender: 'Confidant' }]);
      setState(STATES.RESPONDING);

      if (audioBlob) {
        const url = URL.createObjectURL(audioBlob);
        const audio = new Audio(url);
        audio.play();
        audio.onended = () => {
          URL.revokeObjectURL(url);
          setState(STATES.IDLE);
        };
      } else {
        setState(STATES.IDLE);
      }
    }
  });

  const handleMicClick = () => {
    if (state === STATES.IDLE) {
      vad.start();
      setState(STATES.RECORDING);
    }
  };

  const handleResetChat = () => {
    setChatHistory([]);
    setConversationId(generateUUID());
    setState(STATES.IDLE);
  };

  return {
    chatHistory,
    state,
    handleMicClick,
    handleResetChat,
    userSpeaking, // use reactive state here
  };
}

export default useRecording;
