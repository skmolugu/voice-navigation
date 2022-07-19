import React, { useEffect, useState } from "react";
import "./flight-grid.css";
import "../flight-info/flight-info.css";
import { FlightSearchInfo } from "./../flight-search-info/flight-search-info";
import { FlightInfo } from "./../flight-info/flight-info";
import { MultiFlightInfo } from "./../multi-flight-info/multi-flight-info";
import { getTimeDifferece } from "../../lib/utils";
import EventEmitter from "../../EventEmitter";

const FlightsGrid = (props) => {
  const flights = props.flights || {};
  const [sortedData, setSortedData] = useState([]);

  useEffect(() => {
    setSortedData([...flights.nonStopFlights, ...flights.multiStopFlights]);
    const listener = EventEmitter.addListener("Sort_Flights", (data) => {
      if (data.field === "price") {
        flightSortByPrice(data.sort === "asc" ? true : false);
      } else {
        flightSortByDuration(data.sort === "asc" ? true : false);
      }
    });
    const bookListener = EventEmitter.addListener("select_flights_book", (data) => {
      console.log(data)      
      console.log(sortedData[data.index])
    });
    return () => {
      listener.remove();
      bookListener.remove();
    };
  }, [flights]);
  const flightsCount =
    (flights.nonStopFlights && flights.nonStopFlights.length) +
    (flights.multiStopFlights && flights.multiStopFlights.length);

  const flightSortByPrice = (isSortorderAsc) => {
    let data = [...flights.nonStopFlights, ...flights.multiStopFlights];
    let a_price = 0,
      b_price = 0;
    data.sort((a, b) => {
      if (a.hasOwnProperty("id")) {
        a_price = a.price;
      } else {
        a_price = a.cumulativeFlight.totalFare;
      }
      if (b.hasOwnProperty("id")) {
        b_price = b.price;
      } else {
        b_price = b.cumulativeFlight.totalFare;
      }
      if (isSortorderAsc) {
        console.log(a_price, b_price);
        return a_price > b_price ? 1 : -1;
      } else {
        return a_price < b_price ? 1 : -1;
      }
    });
    setSortedData(data);
  };

  const flightSortByDuration = (isSortorderAsc) => {
    let data = [...flights.nonStopFlights, ...flights.multiStopFlights];
    let a_time = 0,
      b_time = 0;
    data.sort((a, b) => {
      if (a.hasOwnProperty("id")) {
        a_time = getTimeDifferece(
          new Date(`${a.date} ${a.arrivalTime}`) -
            new Date(`${a.date} ${a.departureTime}`)
        );
      } else {
        a_time = a.cumulativeFlight.totalDuration;
      }
      if (b.hasOwnProperty("id")) {
        b_time = getTimeDifferece(
          new Date(`${b.date} ${b.arrivalTime}`) -
            new Date(`${b.date} ${b.departureTime}`)
        );
      } else {
        b_time = b.cumulativeFlight.totalDuration;
      }
      if (isSortorderAsc) {
        return a_time > b_time ? 1 : -1;
      } else {
        return a_time < b_time ? 1 : -1;
      }
    });
    setSortedData(data);
  };

  const showNonstopFlightBookingConfirmation = (details) => {
    const displayDetails = `Congratulations! Your flight has been booked successfully.
    
    ${details.origin.toUpperCase()} - ${details.destination.toUpperCase()}
    ${details.flightNo} ${details.name}

    Departure Date : ${details.date}
    Departure Time : ${details.departureTime}
    Arrival Time   : ${details.arrivalTime}

    Flight Fare    : ${details.price}
    Taxes          : ${(details.price * 0.08).toFixed(2)}
    Convenience Fee: 350
    -------------------------
    Total Fare     : ${(details.price * 1.08 + 350).toFixed(2)}`;
    alert(displayDetails);
  };

  const showMultistopFlightBookingConfirmation = (details) => {
    let displayDetails = `Congratulations! Your flight has been booked successfully.
    `;
    details.flights.forEach(
      (flight) =>
        (displayDetails += `${flight.origin.toUpperCase()} - ${flight.destination.toUpperCase()}
    ${flight.flightNo} ${flight.name}           Date : ${flight.date}
    Departure Time : ${flight.departureTime}    Arrival Time   : ${
          flight.arrivalTime
        }
    
    `)
    );
    displayDetails += `Total Duration : ${
      details.cumulativeFlight.totalDuration
    }
    Flight Fare    : ${details.cumulativeFlight.totalFare}
    Taxes          : ${(details.cumulativeFlight.totalFare * 0.08).toFixed(2)}
    Convenience Fee: 350
    -------------------------
    Total Fare     : ${(
      details.cumulativeFlight.totalFare * 1.08 +
      350
    ).toFixed(2)}`;

    alert(displayDetails);
  };

  return (
    <div className="flights-info-container">
      {props.criteria && (
        <FlightSearchInfo criteria={props.criteria} count={flightsCount || 0} />
      )}
      <div className="card">
        <section className="Flight-info ">
          <img
            style={{ visibility: "hidden" }}
            src="/static/media/nonstop.4edbe6dd4c40148091d6.png"
            alt="direct flight logo"
            width="32"
            height="32"
          />
          <div className="detail-label">
            <h4>Airlines</h4>
          </div>
          <div className="detail-label">
            <h4>Departure Time</h4>
          </div>
          <div className="detail-label">
            <h4>Arrival Time</h4>
          </div>
          <div className="detail-label duration-header">
            <h4>
              Duration
              <span className="sort-icon">
                <a
                  href="#"
                  onClick={(event) => {
                    event.preventDefault();
                    flightSortByDuration(true);
                  }}
                >
                  <i className="fa fa-fw fa-sort-asc"></i>
                </a>
                <a
                  href="#"
                  onClick={(event) => {
                    event.preventDefault();
                    flightSortByDuration(false);
                  }}
                >
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
                  flightSortByPrice(true);
                }}
              >
                <i className="fa fa-fw fa-sort-asc"></i>
              </a>
              <a
                href="#"
                onClick={(event) => {
                  event.preventDefault();
                  flightSortByPrice(false);
                }}
              >
                <i className="fa fa-fw fa-sort-desc"></i>
              </a>{" "}
            </span>
          </p>
          <button
            type="button"
            style={{ visibility: "hidden" }}
            className="btn btn-primary"
          >
            Select
          </button>
        </section>
      </div>
      {sortedData.map((flight, index) =>
        flight.hasOwnProperty("id") ? (
          <FlightInfo
            data={flight}
            index={index}
            showBookingConfirmation={showNonstopFlightBookingConfirmation}
          />
        ) : (
          <MultiFlightInfo
            data={flight}
            index={index}
            showBookingConfirmation={showMultistopFlightBookingConfirmation}
          />
        )
      )}
    </div>
  );
};

export default FlightsGrid;
