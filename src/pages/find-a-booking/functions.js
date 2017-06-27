'use strict';

const template = require('./template.marko');
const {searchBookings} = require('./../../lib/booking-api');

function get(req, res) {
  const search = req.query.search;
  if (search) {
    searchBookings(search)
    .then(response => {
      const results = response.body;
      const resultText = (results.length === 1 ? 'result' : 'results');
      return template.render({results, resultText, search: req.query.search}, res);
    }).catch(err => {
      console.log(err);
    });
  } else {
    template.render({}, res);
  }
}

function post(req, res) {
  template.render({}, res);
}

module.exports = {get, post};
