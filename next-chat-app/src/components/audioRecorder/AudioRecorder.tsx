// components/AudioRecorder.tsx

import React, { useState, useEffect, useRef } from "react";

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const audioChunks = useRef<Blob[]>([]);

  useEffect(() => {
    if (isRecording) {
      startRecording();
    } else if (mediaRecorder) {
      mediaRecorder.stop();
    }
  }, [isRecording, mediaRecorder]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    setMediaRecorder(recorder);

    recorder.ondataavailable = (event) => {
      audioChunks.current.push(event.data);
    };

    recorder.onstop = () => {
      const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioUrl(audioUrl);
      audioChunks.current = [];
    };

    recorder.start();
  };

  const handleStartRecording = () => {
    setIsRecording(true);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
  };

  const handleSendAudio = () => {
    if (audioUrl) {
      // Here you can send the audio to your server or another destination
      console.log("Audio URL:", audioUrl);
    }
  };

  return (
    <div>
      <button onClick={handleStartRecording} disabled={isRecording}>
        Start Recording
      </button>
      <button onClick={handleStopRecording} disabled={!isRecording}>
        Stop Recording
      </button>
      {audioUrl && (
        <div>
          <audio controls src={audioUrl}></audio>
          <button onClick={handleSendAudio}>Send Audio</button>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
