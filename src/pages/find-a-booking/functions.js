'use strict';

const apiUrl = (process.env.API_URL || 'http://localhost:3000') + '/api';
const got = require('got');
const template = require('./template.marko');

function get(req, res) {
  const search = req.query.search;
  if (search) {
    return got(`${apiUrl}/Bookings`, {
      json: true,
      query: {
        filter: JSON.stringify({
          where: {
            or: [
              {
                name: {
                  like: search,
                  options: 'i'
                }
              },
              {
                description: {
                  like: search,
                  options: 'i'
                }
              }
            ]
          },
          include: [
            {
              relation: 'room',
              scope: {
                include: 'location'
              }
            }
          ]
        })
      }
    }).then(response => {
      const results = response.body;
      console.log(results)
      const resultText = (results.length === 1 ? 'result' : 'results');
      return template.render({results, resultText}, res);
    }).catch(err => {
      console.log(err);
    });
  }
  template.render({}, res);
}

function post(req, res) {
  template.render({}, res);
}

module.exports = {get, post};
