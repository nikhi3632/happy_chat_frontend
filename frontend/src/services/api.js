export async function transcribeAudio(audioBlob) {
  try {const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.wav');
    const res = await fetch('http://127.0.0.1:8000/transcribe', {
      method: 'POST',
      body: formData
    });
    return res.json();
    }
    catch (error) {
      console.error('Error during transcribeAudio:', error);
      throw error;
    }
  }
  
export async function thinkAndRespond(text, conversationId) {
  try {
    const res = await fetch('http://127.0.0.1:8000/think-and-respond', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        user_input: text, 
        conversation_id: conversationId,
        model: ''
      })
    });

    if (!res.ok) {
      throw new Error('Failed to fetch response');
    }

    const result = await res.json();

    const replyText = result.text;
    const audioBase64 = result.audio_base64;

    const audioBuffer = new Uint8Array(atob(audioBase64).split('').map(char => char.charCodeAt(0)));
    const audioBlob = new Blob([audioBuffer], { type: 'audio/wav' });

    return { replyText, audioBlob };

  } catch (error) {
    console.error('Error during thinkAndRespond:', error);
    throw error;
  }
}
