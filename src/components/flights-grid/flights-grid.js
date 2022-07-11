import React, { useState } from "react";
import "./flight-grid.css";
import "../flight-info/flight-info.css";
import { FlightSearchInfo } from "./../flight-search-info/flight-search-info";
import { FlightInfo } from "./../flight-info/flight-info";
import { MultiFlightInfo } from "./../multi-flight-info/multi-flight-info";

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
      <div class="card">
        <section class="Flight-info ">
          <img
            style={{ visibility: "hidden" }}
            src="/static/media/nonstop.4edbe6dd4c40148091d6.png"
            alt="direct flight logo"
            width="32"
            height="32"
          />
          <div class="detail-label">
            <h4>Airlines</h4>
          </div>
          <div class="detail-label">
            <h4>Departure Time</h4>
          </div>
          <div class="detail-label">
            <h4>Arrival Time</h4>
          </div>
          <div class="detail-label duration-header">
            <h4>
              Duration
              <span className="sort-icon">
                <a
                  href="#"
                  onClick={(event) => {
                    event.preventDefault();
                    flightSort("price", true);
                  }}>
                  <i className="fa fa-fw fa-sort-asc"></i>
                </a>
                <a
                  href="#"
                  onClick={(event) => {
                    event.preventDefault();
                    flightSort("price", false);
                  }}>
                  <i className="fa fa-fw fa-sort-desc"></i>
                </a>
              </span>
            </h4>
          </div>
          <p className="price-header">
            Price{" "}
            <span className="sort-icon">
              <a
                href="#"
                onClick={(event) => {
                  event.preventDefault();
                  flightSort("price", true);
                }}>
                <i className="fa fa-fw fa-sort-asc"></i>
              </a>
              <a
                href="#"
                onClick={(event) => {
                  event.preventDefault();
                  flightSort("price", false);
                }}>
                <i className="fa fa-fw fa-sort-desc"></i>
              </a>{" "}
            </span>
          </p>
          <button
            type="button"
            style={{ visibility: "hidden" }}
            class="btn btn-primary">
            Select
          </button>
        </section>
      </div>
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
