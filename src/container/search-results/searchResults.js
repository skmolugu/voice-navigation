import React from "react";
import FlightsGrid from "../../components/flights-grid/flights-grid";

const SearchResults = (props) => {
  const { origin, destination, departureDate, returnDate } =
    props.filters || {};

  return (
    <>
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
    </>
  );
};

export default SearchResults;
