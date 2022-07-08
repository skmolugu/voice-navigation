import React from "react";
import { getTokenOrRefresh } from "../../token_util";
import { ResultReason } from "microsoft-cognitiveservices-speech-sdk";
import EventEmitter from "../../EventEmitter";
import "./Voice.css";
const speechsdk = require("microsoft-cognitiveservices-speech-sdk");

export default function Voice() {
  async function sttFromMic() {
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
      if (result.reason === ResultReason.RecognizedSpeech) {
        displayText = `RECOGNIZED: Text=${result.text}`;
      } else {
        displayText =
          "ERROR: Speech was cancelled or could not be recognized. Ensure your microphone is working properly.";
      }
      micHolder.classList.remove("recording");
      console.log("-----------displayText", displayText);
      //after response from luis , emit event here EventEmitter.emit('intent_name', {}//payload)
      EventEmitter.emit('flight_search_page');
    });
  }

  return (
    <div id="mic-holder" className="bottom-right">
      <i className="fas fa-microphone fa-lg mr-2" onClick={sttFromMic}></i>
    </div>
  );
}
