import React, {useState} from "react";
import { getTokenOrRefresh } from "../../token_util";
import { ResultReason } from "microsoft-cognitiveservices-speech-sdk";
import EventEmitter from "../../EventEmitter";
import "./Voice.css";
const speechsdk = require("microsoft-cognitiveservices-speech-sdk");

export default function Voice() {
  const [voice,setVoice] = useState("Voice Searching...")
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
          "Speech was cancelled or could not be recognized. Ensure your microphone is working properly.";
      }
      micHolder.classList.remove("recording");
      try {
        fetch('/api/get-flights-speech', { 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            text: result.text
            })
        }
        ).then(response => {
          setVoice(displayText)
          EventEmitter.emit("flight_search_page");
        });
      } catch (e) {
        console.log('error', e);
        
      }
      console.log("-----------displayText", displayText);
      //after response from luis , emit event here EventEmitter.emit('intent_name', {}//payload)
    });
  }

  return (
    <>
      <div className="voice-over">{voice}</div>
      <div id="mic-holder" className="bottom-right">
        <i className="fas fa-microphone fa-lg mr-2" onClick={sttFromMic}></i>
      </div>
    </>
  );
}
