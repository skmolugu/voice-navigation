import React, { useEffect, useState } from "react";
import "./App.css";
import { connect } from "react-redux";
import SearchForm from "./container/search-form/search-form";
import FlightsGrid from "./components/flights-grid/flights-grid";
import { getFlights } from "./actions";
import Voice from "./components/voice/Voice";
import SearchResults from "./container/search-results/searchResults";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App(props) {
  useEffect(() => {
    props.getFlights();
  }, [(props.flights || []).legnth]);

  const { origin, destination, departureDate, returnDate } =
    props.filters || {};
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h2>Flight Booking</h2>
          <span>Voice navigated*</span>
        </header>
        <Voice />
        <section className="Main-container">
          <aside className="Search-section">
            <SearchForm></SearchForm>
          </aside>
          <section className="Results-section">
            <Switch>
              <Route exact path="/">
                <p>Home</p>
              </Route>
              <Route path="/results">
                <SearchResults
                  routes={props.routes}
                  filters={props.filters || {}}
                />
              </Route>
              <Route path="/confirmation">
                <p>{props.flightDetails}</p>
              </Route>
            </Switch>
          </section>
        </section>
        <footer className="App-footer">
          <p>&copy; Cognizant Hackathon Demo Project</p>
        </footer>
      </div>
    </Router>
  );
}

const mapStateToProps = (state) => ({
  flights: state.flights,
  routes: state.routes,
  filters: state.filters,
});

const mapDispatchToProps = {
  getFlights,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
