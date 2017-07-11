'use strict';

const template = require('./template.marko');
const {getBooking, deleteBooking} = require('./../../lib/booking-api');

function get(req, res, next) {
  const id = req.params.id;

  getBooking(id)
  .then(response => {
    const booking = response.body;
    template.render({booking}, res);
  }).catch(next);
}

function post(req, res, next) {
  if (req.body.delete === 'yes') {
    deleteBooking(req.params.id)
    .then(() => {
      return res.redirect('/booking-deleted');
    }).catch(next);
  } else {
    res.redirect(`/booking/${req.params.id}`);
  }
}

module.exports = {get, post};
