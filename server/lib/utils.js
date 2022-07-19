const _ = require('lodash');
const words = require('words-to-numbers');

module.exports = {
  formatReponse: function(data) {
    const today = new Date();
    const todayDate = today.getFullYear() + "/" + (today.getMonth() + 1) + "/" + today.getDate();
    const result = {
      payload: {
        from: 'london',
        people: 1,
        date: todayDate
      }
    };

    result.intent = _.get(data, "prediction.topIntent");
    switch(result.intent) {
      case 'BookFlight':
        result.payload.people = _.get(data, 'prediction.entities.number[0]', 1);
        result.payload.date = _.get(data, 'prediction.entities.datetimeV2[0].values[0].resolution[1].value', todayDate);
        result.payload.date = result.payload.date.replaceAll('-', '/');
        const locations = _.get(data, 'prediction.entities.Location');
        const fromObj = _.find(locations, 'from');
        const toObj = _.find(locations, 'to');
        result.payload.from = _.get(fromObj, 'from[0]');
        result.payload.from = result.payload.from.toLocaleLowerCase();
        result.payload.to = _.get(toObj, 'to[0]');
        result.payload.to = result.payload.to.toLocaleLowerCase();
        break;
      case 'Sort_Flights':
        result.payload = {};
        let sortBy = _.get(data, 'prediction.entities.sortBy[0].type[0]', { "asc": ["low"] });
        let field = _.get(data, 'prediction.entities.sortBy[1].field[0]', { "price": ["fare"] });
        result.payload.sort = sortBy.hasOwnProperty("asc") ? "asc" : "desc";
        result.payload.field = field.hasOwnProperty("price") ? "price" : "distance";
        break;
      case 'select_flights_book':
        result.payload = {};
        result.payload.index = _.get(data, 'prediction.entities.flight_index[0]', 'first');
        result.payload.index = words.wordsToNumbers(result.payload.index);
        console.log(result.payload)
        break;
    }
    return result;
  }
}