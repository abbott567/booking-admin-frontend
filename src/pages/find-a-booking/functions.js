'use strict';

const template = require('./template.marko');

function get(req, res) {
  const userSignedIn = req.session.userSignedIn;
  if (userSignedIn) {
    return template.render({}, res);
  }
  return res.redirect('/sign-in');
}

function post(req, res) {
  template.render({}, res);
}

module.exports = {get, post};
