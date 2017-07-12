'use strict';

const isNotAny = require('../../utils/is-not-any');
const formatBookingDateTime = require('../../utils/format-booking-date-time');
const {validHours, validMinutes} = require('../../utils/consts');
const getDateAndErrors = require('../../lib/get-date-and-errors');
const padZero = require('../../utils/pad-zero');
const template = require('./template.marko');
const {getBooking, getLocationsAndRooms} = require('./../../lib/booking-api');

function get(req, res, next) {
  const id = req.params.id;

  Promise.all([getBooking(id), getLocationsAndRooms()])
  .then(([bookingResponse, roomsResponse]) => {
    const booking = bookingResponse.body;
    const date = new Date(booking.start);
    const endDate = new Date(booking.end);

    booking.day = date.getDate();
    booking.month = date.getMonth() + 1;
    booking.year = date.getFullYear();
    booking.fromHours = padZero(date.getHours());
    booking.fromMinutes = padZero(date.getMinutes());
    booking.untilHours = padZero(endDate.getHours());
    booking.untilMinutes = padZero(endDate.getMinutes());

    req.session.currentBooking = booking;
    template.render({booking, allRooms: roomsResponse.body}, res);
  }).catch(err => {
    next(err);
  });
}

function post(req, res, next) {
  const {errors} = getDateAndErrors(req);
  const {description = '', name = '', fromHours = '', fromMinutes = '',
    untilHours = '', untilMinutes = ''} = req.body;

  if (name === '') {
    errors.name = req.t('booking:errors.name');
  }

  if (description === '') {
    errors.description = req.t('booking:errors.description');
  }

  if (isNotAny(fromHours, validHours)) {
    errors.from = req.t('booking:errors.time.time.invalidHours');
  } else if (isNotAny(fromMinutes, validMinutes)) {
    errors.from = req.t('booking:errors.time.time.invalidMinutes');
  }

  if (isNotAny(untilHours, validHours)) {
    errors.from = req.t('booking:errors.time.invalidHours');
  } else if (isNotAny(untilMinutes, validMinutes)) {
    errors.from = req.t('booking:errors.time.invalidMinutes');
  }

  if (fromHours > untilHours) {
    errors.from = req.t('booking:errors.time.from.backwards');
    errors.until = req.t('booking:errors.time.from.backwards');
  } else if (fromHours === untilHours && fromMinutes === untilMinutes) {
    errors.from = req.t('booking:errors.time.from.same');
    errors.until = req.t('booking:errors.time.until.same');
  }

  if (Object.keys(errors).length > 0) {
    return getLocationsAndRooms()
    .then(roomsResponse => {
      const booking = {
        day: req.body['date-day'],
        month: req.body['date-month'],
        year: req.body['date-year'],
        fromHours: req.body.fromHours,
        fromMinutes: req.body.fromMinutes,
        untilHours: req.body.untilHours,
        untilMinutes: req.body.untilMinutes,
        description: req.body.description,
        name: req.body.name,
        roomId: req.body['room-select']
      };
      req.session.currentBooking = booking;
      return template.render({booking, allRooms: roomsResponse.body, errors}, res);
    }).catch(next);
  }
  const bookingDate = new Date(req.body['date-year'] + '-' + req.body['date-month'] + '-' + req.body['date-day'])
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
  return res.redirect(`/confirm-update/${id}`);
}

module.exports = {get, post};
