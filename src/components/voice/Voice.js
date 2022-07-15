import React, { useState } from "react";
import { getTokenOrRefresh } from "../../token_util";
import { ResultReason } from "microsoft-cognitiveservices-speech-sdk";
import EventEmitter from "../../EventEmitter";
import "./Voice.css";
const speechsdk = require("microsoft-cognitiveservices-speech-sdk");

export default function Voice() {
  const [voice, setVoice] = useState(
    "Click on Microphone icon to start voice search..."
  );
  const [loader, setLoader] = useState(false);
  async function sttFromMic() {
    setLoader(true);
    const micHolder = document.getElementById("mic-holder");
    micHolder.classList.add("recording");
    const tokenObj = await getTokenOrRefresh();
    const speechConfig = speechsdk.SpeechConfig.fromAuthorizationToken(
      tokenObj.authToken,
      tokenObj.region
    );
    speechConfig.speechRecognitionLanguage = "en-US";

    const audioConfig = speechsdk.AudioConfig.fromDefaultMicrophoneInput();
    const recognizer = new speechsdk.SpeechRecognizer(
      speechConfig,
      audioConfig
    );

    recognizer.recognizeOnceAsync((result) => {
      let displayText;
      let text = result.text;
      if (result.reason === ResultReason.RecognizedSpeech) {
        displayText = `RECOGNIZED: Text=${result.text}`;
      } else {
        displayText =
          "Speech was cancelled or could not be recognized. Ensure your microphone is working properly.";
      }
      micHolder.classList.remove("recording");
      setVoice(displayText);
      try {
        fetch("/api/get-flights-speech?text=" + text, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })
          .then((response) => {
            setLoader(false);
            return response.json();
          })
          .then((data) => {
            console.log(data.payload);
            EventEmitter.emit(data.intent, data.payload);
          });
      } catch (e) {
        setLoader(false);
        console.log("error", e);
      }
    });
  }

  return (
    <>
      <div className="voice-over">{voice}</div>
      {loader && <img src="/loader.gif" style={{ position: "fixed" }} />}
      <div id="mic-holder" className="bottom-right">
        <i className="fas fa-microphone fa-lg mr-2" onClick={sttFromMic}></i>
      </div>
    </>
  );
}
