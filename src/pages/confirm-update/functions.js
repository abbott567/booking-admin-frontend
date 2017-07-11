'use strict';

const template = require('./template.marko');
const {getBooking, getRoom} = require('./../../lib/booking-api');

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

function post(req, res) {
  template.render({}, res);
}

module.exports = {get, post};
