'use strict';

const formatBookingDateTime = require('../../utils/format-booking-date-time');
const template = require('./template.marko');
const {getBooking, getLocationsAndRooms, editBooking} = require('./../../lib/booking-api');

function get(req, res, next) {
  const id = req.params.id;
  Promise.all([getBooking(id), getLocationsAndRooms()])
  .then(([bookingResponse, roomsResponse]) => {
    const booking = bookingResponse.body;
    req.session.currentBooking = booking;
    template.render({booking, allRooms: roomsResponse.body}, res);
  }).catch(err => {
    next(err);
  });
}

function post(req, res) {
  const bookingDate = new Date(req.body['date-year'] + '-' + req.body['date-month'] + '-' + req.body['date-day'])
  const fromHours = req.body.fromHours;
  const fromMinutes = req.body.fromMinutes;
  const untilHours = req.body.untilHours;
  const untilMinutes = req.body.untilMinutes;
  const start = formatBookingDateTime(bookingDate, fromHours, fromMinutes);
  const end = formatBookingDateTime(bookingDate, untilHours, untilMinutes);
  const roomId = req.body['room-select'];
  const id = req.params.id;

  const updates = {
    id,
    start,
    end,
    description: req.body.description,
    name: req.body.name,
    roomId
  };

  req.session.updates = updates;
  res.redirect(`/confirm-update/${id}`);
}

module.exports = {get, post};
