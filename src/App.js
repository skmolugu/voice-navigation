import React, { useState, useEffect } from "react";
import { Container } from "reactstrap";
import { getTokenOrRefresh } from "./token_util";
import "./App.css";
import { ResultReason } from "microsoft-cognitiveservices-speech-sdk";
import { connect } from "react-redux";
import SearchForm from "./container/search-form/search-form";
import FlightsGrid from "./components/flights-grid/flights-grid";
import { getFlights } from "./actions";

const speechsdk = require("microsoft-cognitiveservices-speech-sdk");

const App = (props) => {
  const [displayText, setDisplayText] = useState(
    "INITIALIZED: ready to test speech..."
  );
  const { origin, destination, departureDate, returnDate } =
    props.filters || {};

  useEffect(() => {
    getFlights();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      // check for valid speech key/region
      const tokenRes = await getTokenOrRefresh();
      if (tokenRes.authToken === null) {
        setDisplayText("FATAL_ERROR: " + tokenRes.error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    console.log(displayText);
  }, [displayText]);

  const sttFromMic = async () => {
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

    setDisplayText("speak into your microphone...");

    recognizer.recognizeOnceAsync((result) => {
      let displayText;
      if (result.reason === ResultReason.RecognizedSpeech) {
        displayText = `RECOGNIZED: Text=${result.text}`;
      } else {
        displayText =
          "ERROR: Speech was cancelled or could not be recognized. Ensure your microphone is working properly.";
      }
      setDisplayText(displayText);
    });
  };

  const fileChange = async (event) => {
    const audioFile = event.target.files[0];
    console.log(audioFile);
    const fileInfo = audioFile.name + ` size=${audioFile.size} bytes `;

    setDisplayText(fileInfo);

    const tokenObj = await getTokenOrRefresh();
    const speechConfig = speechsdk.SpeechConfig.fromAuthorizationToken(
      tokenObj.authToken,
      tokenObj.region
    );
    speechConfig.speechRecognitionLanguage = "en-US";

    const audioConfig = speechsdk.AudioConfig.fromWavFileInput(audioFile);
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

      setDisplayText(fileInfo + displayText);
    });
  };

  return (
    <Container className="App app-container">
      <header className="App-header">
        <h2>Flight Search App</h2>
      </header>
      <section className="Main-container">
        <aside className="Search-section">
          <SearchForm></SearchForm>
          <section className="col-6">
            <i
              className="fas fa-microphone fa-lg mr-2"
              onClick={() => sttFromMic()}
            ></i>
            Convert speech to text from your mic.
            <div className="mt-2">
              <label htmlFor="audio-file">
                <i className="fas fa-file-audio fa-lg mr-2"></i>
              </label>
              <input
                type="file"
                id="audio-file"
                onChange={(e) => fileChange(e)}
                style={{ display: "none" }}
              />
              Convert speech to text from an audio file.
            </div>
          </section>
        </aside>
        <section className="Results-section">
          {props.routes && props.routes.onwards && (
            <FlightsGrid
              flights={props.routes.onwards}
              criteria={{ origin, destination, date: departureDate }}
            ></FlightsGrid>
          )}
          {props.routes && props.routes.return && (
            <FlightsGrid
              flights={props.routes.return}
              criteria={{
                origin: destination,
                destination: origin,
                date: returnDate,
              }}
            ></FlightsGrid>
          )}
        </section>
      </section>
    </Container>
  );
};

const mapStateToProps = (state) => ({
  flights: state.flights,
  routes: state.routes,
  filters: state.filters,
});

const mapDispatchToProps = {
  getFlights,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
