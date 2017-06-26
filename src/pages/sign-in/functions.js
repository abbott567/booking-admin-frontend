'use strict';
const sendMail = require('../../lib/send-mail');
const template = require('./template.marko');

function get(req, res) {
  template.render({}, res);
}

function post(req, res) {
  const url = `${req.protocol}://${req.get('host')}/cancel/`;
  const email = req.body['email-address'];

  sendMail({
    to: email,
    subject: req.t('email:subject'),
    text: req.t('email:body', {url})
  }).then(() => {
    template.render({}, res);
  }).catch(err => {
    console.log(err);
  });
}

module.exports = {get, post};
