'use strict';

function get(req, res) {
  const sessionLink = req.session.link;
  const magicLink = req.query.link;

  if ((magicLink && sessionLink) && (magicLink === sessionLink)) {
    req.session.userSignedIn = true;
    return res.redirect('/find-a-booking');
  }
  return res.redirect('/not-authorised');
}

module.exports = {get};
