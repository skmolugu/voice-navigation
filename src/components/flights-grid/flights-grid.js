import React, { useState } from "react";
import "./flight-grid.css";
import "../flight-info/flight-info.css";
import { FlightSearchInfo } from "./../flight-search-info/flight-search-info";
import { FlightInfo } from "./../flight-info/flight-info";
import { MultiFlightInfo } from "./../multi-flight-info/multi-flight-info";
import { Card } from "react-bootstrap";
import { DetailLabel } from "../detail-label/detail-label";

const FlightsGrid = (props) => {
  const flights = props.flights || {};
  const [sortedData, setSortedData] = useState({
    nonStopFlights: [...flights.nonStopFlights],
    multiStopFlights: [...flights.multiStopFlights],
  });
  const flightsCount =
    (flights.nonStopFlights && flights.nonStopFlights.length) +
    (flights.multiStopFlights && flights.multiStopFlights.length);

  const flightSort = (sortCriteria, isSortorderAsc) => {
    let data = [...flights.nonStopFlights];
    data.sort((a, b) => {
      if (isSortorderAsc) {
        return a[sortCriteria] > b[sortCriteria] ? 1 : -1;
      } else {
        return a[sortCriteria] < b[sortCriteria] ? 1 : -1;
      }
    });
    let sortedData_ = [];
    sortedData_ = { ...sortedData, nonStopFlights: [...data] };
    setSortedData(sortedData_);
  };
  console.log(sortedData);
  return (
    <div className="flights-info-container">
      {props.criteria && (
        <FlightSearchInfo criteria={props.criteria} count={flightsCount || 0} />
      )}
      <Card>
        <section className="Flight-info">
          <DetailLabel mainText={""} subText={""}></DetailLabel>
          <DetailLabel mainText={""} subText={"Airlines"}></DetailLabel>
          <DetailLabel mainText={""} subText={"Departure"}></DetailLabel>
          <DetailLabel mainText={""} subText={"Arrival"}></DetailLabel>
          <DetailLabel mainText={""} subText={"Duration"}></DetailLabel>
          <DetailLabel mainText={""} subText={"Price"}></DetailLabel>
          <button
            onClick={() => {
              flightSort("price", true);
            }}
          >
            Up
          </button>
          <button
            onClick={() => {
              flightSort("price", false);
            }}
          >
            Down
          </button>
          <DetailLabel mainText={""} subText={""}></DetailLabel>
        </section>
      </Card>
      {sortedData.nonStopFlights &&
        sortedData.nonStopFlights.map((flight) => <FlightInfo data={flight} />)}
      {sortedData.multiStopFlights &&
        sortedData.multiStopFlights.map((flight) => (
          <MultiFlightInfo data={flight} />
        ))}
    </div>
  );
};

export default FlightsGrid;
