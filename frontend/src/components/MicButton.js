import React from 'react';
import { STATES } from '../constants/uiStates';

function MicButton({ onClick, state, speaking }) {
    const isIdle = state === STATES.IDLE;
    const isRecording = state === STATES.RECORDING;
    const isTranscribing = state === STATES.TRANSCRIBING;
    const isThinking = state === STATES.THINKING;
    const isResponding = state === STATES.RESPONDING;

    let color = 'gray';
    let buttonText = 'Talk';

    if (isRecording) {
        color = speaking ? '#84cc16' : 'red';
        buttonText = 'Recording...';
    } else if (isThinking) {
        color = 'black';
        buttonText = 'Thinking...';
    } else if (isTranscribing) {
        color = 'blue';
        buttonText = 'Transcribing...';
    } else if (isResponding) {
        color = 'green';
        buttonText = 'Responding...';
    }

    return (
        <button
            className="mic-button"
            onClick={isIdle ? onClick : null}
            disabled={!isIdle}
            style={{
                backgroundColor: color,
                cursor: !isIdle ? 'not-allowed' : 'pointer',
            }}
        >
            {buttonText}
        </button>
    );
}

export default MicButton;
