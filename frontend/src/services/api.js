import { apiFetch } from '../utils/request';

export async function transcribeAudio(audioBlob) {
  try {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.wav');

    return await apiFetch('/transcribe', {
      method: 'POST',
      body: formData
    });

  } catch (error) {
    console.error('Error during transcribeAudio:', error);
    throw error;
  }
}

export async function thinkAndRespond(text, conversationId) {
  try {
    const result = await apiFetch('/think-and-respond', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        user_input: text, 
        conversation_id: conversationId,
        model: process.env.REACT_APP_CHAT_MODEL
      })
    });

    const replyText = result.text;
    const audioBase64 = result.audio_base64;

    const audioBuffer = new Uint8Array(
      atob(audioBase64).split('').map(c => c.charCodeAt(0))
    );
    const audioBlob = new Blob([audioBuffer], { type: 'audio/wav' });

    return { replyText, audioBlob };

  } catch (error) {
    console.error('Error during thinkAndRespond:', error);
    throw error;
  }
}
