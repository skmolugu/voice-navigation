import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { Typeahead } from "react-bootstrap-typeahead";
import { connect } from "react-redux";
import "./search-form.css";
import "react-bootstrap-typeahead/css/Typeahead.css";
import { findFlights } from "./../../actions";
// import EventEmitter from "../../EventEmitter";
import { Link } from "react-router-dom";

const airports = [
  "Pune (PNQ)",
  "Delhi (DEL)",
  "Bengaluru (BLR)",
  "Mumbai (BOM)",
];

const isDate = (date) => {
  return new Date(date) !== "Invalid Date" && !isNaN(new Date(date));
};

const ErrorLabel = (props) => {
  return <label style={{ color: "red" }}>{props.message}</label>;
};

export const SearchForm = (props) => {
  let origin, destination;

  const [noOfPassengers, setNoOfPassengers] = useState(0);
  const [isReturn, setFlightType] = useState(false);
  const [status, setFormValid] = useState({ isValid: false });

  let invalidFields = {};
  const handleSubmit = (event) => {
    event.preventDefault();
    const { flights } = props;
    invalidFields = {};
    const criteria = {
      origin: origin.state.text,
      destination: destination.state.text,
      departureDate: event.target.dateOfDep.value,
      numOfPassengers: noOfPassengers,
    };

    if (event.target.flightType[1].checked) {
      criteria.returnDate = event.target.dateOfReturn.value;
      if (!isDate(event.target.dateOfReturn.value)) {
        invalidFields.returnDate = true;
      }
    }

    if (!airports.includes(criteria.origin)) {
      invalidFields.origin = true;
    }
    if (
      !airports.includes(criteria.destination) ||
      criteria.origin === criteria.destination
    ) {
      invalidFields.destination = true;
    }
    if (!isDate(criteria.departureDate)) {
      invalidFields.departureDate = true;
    }
    if (criteria.numOfPassengers === 0) {
      invalidFields.numOfPassengers = true;
    }
    if (Object.keys(invalidFields).length > 0) {
      setFormValid({ isValid: false, ...invalidFields });
      return;
    }

    setFormValid({ isValid: true });
    props.findFlights({ flights, criteria });
  };

  // useEffect(() => {
  //   const listener = EventEmitter.addListener("flight_search_page", (data) => {
  //     let criteria = {
  //       departureDate: "2022-11-01",
  //       destination: "Mumbai (BOM)",
  //       numOfPassengers: 1,
  //       origin: "Pune (PNQ)",
  //     };

  //     let flights = props.flights;
  //     props.findFlights({ flights, criteria });
  //   });
  //   return () => {
  //     listener.remove();
  //   };
  // }, []);

  return (
    <Card>
      <Card.Body>
        <Form className="search-form-container" onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Check
              inline
              checked={!isReturn}
              type="radio"
              label="One way"
              name="flightType"
              id="formHorizontalRadios1"
              onChange={(e) => setFlightType(false)}
            />
            <Form.Check
              inline
              checked={isReturn}
              type="radio"
              label="Return"
              name="flightType"
              id="formHorizontalRadios2"
              onChange={(e) => setFlightType(true)}
            />
          </Form.Group>
          <br />

          <Form.Group controlId="formGridOrigin">
            <Form.Label>Enter Origin</Form.Label>
            <Typeahead
              labelKey="origin"
              options={airports}
              placeholder="Enter Origin"
              ref={(ref) => (origin = ref)}
            />
            {status.origin && (
              <ErrorLabel message="Please enter a valid airport"></ErrorLabel>
            )}
          </Form.Group>
          <br />

          <Form.Group controlId="formGridDestination">
            <Form.Label>Enter Destination</Form.Label>
            <Typeahead
              labelKey="destination"
              options={airports}
              placeholder="Enter Destination"
              ref={(ref) => (destination = ref)}
            />
            {status.destination && (
              <ErrorLabel message="Please enter a valid airport but not same as origin"></ErrorLabel>
            )}
          </Form.Group>
          <br />

          <Form.Group controlId="formGridDateOfDep">
            <Form.Label>Departure Date</Form.Label>
            <Form.Control
              type="date"
              name="dateOfDep"
              placeholder="yyyy-mm-dd"
              required
            />
            {status.departureDate && (
              <ErrorLabel message="Please enter a valid departure date"></ErrorLabel>
            )}
          </Form.Group>
          <br />

          {isReturn && (
            <Form.Group controlId="formGridDateOfReturn">
              <Form.Label>Return Date</Form.Label>
              <Form.Control
                type="date"
                name="dateOfReturn"
                placeholder="yyyy-mm-dd"
                required
              />
              {status.returnDate && (
                <ErrorLabel message="Please enter a valid return date"></ErrorLabel>
              )}
            </Form.Group>
          )}

          <Form.Group controlId="exampleForm.ControlSelect1">
            <Form.Label>Select Passenger</Form.Label>
            <Form.Control
              as="select"
              name="numOfPassengers"
              placeholder="Number of Passengers"
              value={noOfPassengers}
              onChange={(e) => setNoOfPassengers(parseInt(e.target.value))}
              required
            >
              <option>Number of Passengers</option>
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
            </Form.Control>
          </Form.Group>
          <br />
          {status.numOfPassengers && (
            <ErrorLabel message="Please enter the number of passengers."></ErrorLabel>
          )}

          <Link to="/results">
            <Button variant="primary" className="btn-block" type="submit">
              Search
            </Button>
          </Link>
        </Form>
      </Card.Body>
    </Card>
  );
};

const mapStateToProps = (state) => ({
  flights: state.flights,
});

const mapDispatchToProps = {
  findFlights,
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchForm);
