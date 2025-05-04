/** Credit: https://gist.github.com/Daninet/22edc59cf2aee0b9a90c18e553e49297 */

/** @param sampleRate {number} */
/** @param channelBuffers {Float32Array[]} */
export function audioBufferToWavMono(sampleRate, channelBuffers) {
    const totalSamples = channelBuffers[0].length; // Total number of samples is simply the length of one channel

    const buffer = new ArrayBuffer(44 + totalSamples * 2); // 44-byte WAV header + audio data
    const view = new DataView(buffer);

    const writeString = (view, offset, string) => {
        for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    };

    /* RIFF identifier */
    writeString(view, 0, "RIFF");
    /* RIFF chunk length */
    view.setUint32(4, 36 + totalSamples * 2, true);
    /* RIFF type */
    writeString(view, 8, "WAVE");
    /* format chunk identifier */
    writeString(view, 12, "fmt ");
    /* format chunk length */
    view.setUint32(16, 16, true);
    /* sample format (raw) */
    view.setUint16(20, 1, true); // PCM format
    /* channel count */
    view.setUint16(22, 1, true); // Mono audio (1 channel)
    /* sample rate */
    view.setUint32(24, sampleRate, true);
    /* byte rate (sample rate * block align) */
    view.setUint32(28, sampleRate * 2, true); // Mono, 16-bit = 2 bytes per sample
    /* block align (channel count * bytes per sample) */
    view.setUint16(32, 2, true); // 2 bytes per sample for mono (16-bit)
    /* bits per sample */
    view.setUint16(34, 16, true);
    /* data chunk identifier */
    writeString(view, 36, "data");
    /* data chunk length */
    view.setUint32(40, totalSamples * 2, true); // 2 bytes per sample

    // floatTo16BitPCM (for mono)
    let offset = 44;
    for (let i = 0; i < totalSamples; i++) {
        const s = Math.max(-1, Math.min(1, channelBuffers[0][i])); // Only process the first (and only) channel
        view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
        offset += 2;
    }

    return buffer;
}

/** @param sampleRate {number} */
/** @param channelBuffers {Float32Array[]} */
export function audioBufferToWavMulti(sampleRate, channelBuffers) {
    const totalSamples = channelBuffers[0].length * channelBuffers.length;

    const buffer = new ArrayBuffer(44 + totalSamples * 2);
    const view = new DataView(buffer);

    const writeString = (view, offset, string) => {
        for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
        }
    };

    /* RIFF identifier */
    writeString(view, 0, "RIFF");
    /* RIFF chunk length */
    view.setUint32(4, 36 + totalSamples * 2, true);
    /* RIFF type */
    writeString(view, 8, "WAVE");
    /* format chunk identifier */
    writeString(view, 12, "fmt ");
    /* format chunk length */
    view.setUint32(16, 16, true);
    /* sample format (raw) */
    view.setUint16(20, 1, true);
    /* channel count */
    view.setUint16(22, channelBuffers.length, true);
    /* sample rate */
    view.setUint32(24, sampleRate, true);
    /* byte rate (sample rate * block align) */
    view.setUint32(28, sampleRate * 4, true);
    /* block align (channel count * bytes per sample) */
    view.setUint16(32, channelBuffers.length * 2, true);
    /* bits per sample */
    view.setUint16(34, 16, true);
    /* data chunk identifier */
    writeString(view, 36, "data");
    /* data chunk length */
    view.setUint32(40, totalSamples * 2, true);

    // floatTo16BitPCM
    let offset = 44;
    for (let i = 0; i < channelBuffers[0].length; i++) 
    {
        for (let channel = 0; channel < channelBuffers.length; channel++) 
        {
            const s = Math.max(-1, Math.min(1, channelBuffers[channel][i]));
            view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
            offset += 2;
        }
    }

    return buffer;
}

export function saveToFile(buffer) {
    const blob = new Blob([buffer], { type: 'audio/wav' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'audio.wav';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
