'use strict';

const template = require('./template.marko');
const {getBooking} = require('./../../lib/booking-api');

function get(req, res, next) {
  const id = req.params.id;

  getBooking(id)
  .then(response => {
    const booking = response.body;
    template.render({booking}, res);
  }).catch(next);
}

module.exports = {get};
