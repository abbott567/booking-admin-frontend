'use strict';

const template = require('./template.marko');
const {getBooking, getRoom, editBooking} = require('./../../lib/booking-api');

function get(req, res, next) {
  const updates = req.session.updates;
  const id = updates.id;

  getBooking(id)
  .then(response => {
    const booking = response.body;
    return Promise.all([booking, getRoom(updates.roomId)]);
  }).then(([booking, response]) => {
    const room = response.body;
    updates.room = room;
    template.render({booking, updates}, res);
  }).catch(next);
}

function post(req, res, next) {
  const booking = req.body;
  editBooking(booking.id, booking)
  .then(() => {
    res.redirect(`/booking-updated/${req.params.id}`);
  }).catch(err => {
    if (err.response.body.error.name === 'ValidationError') {
      return res.redirect(`/double-booked/${req.params.id}`);
    }
    next(err);
  });
}

module.exports = {get, post};
