'use strict';

const uuid = require('uuid');
const sendMail = require('../../lib/send-mail');
const template = require('./template.marko');

function get(req, res) {
  template.render({}, res);
}

function post(req, res, next) {
  const link = uuid();
  const url = `${req.protocol}://${req.get('host')}/verify?link=${link}`;
  const email = req.body['email-address'];
  const whiteList = process.env.EMAIL_WHITE_LIST;

  if (whiteList.includes(email)) {
    req.session.link = link;
    sendMail({
      to: email,
      subject: req.t('email:subject'),
      text: req.t('email:body', {url})
    }).then(() => {
      return res.redirect('/check-your-email');
    }).catch(err => {
      next(err);
    });
  } else {
    res.redirect('/not-authorised');
  }
}

module.exports = {get, post};
