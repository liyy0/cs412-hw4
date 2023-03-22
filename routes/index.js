const express = require('express');
const router = express.Router();
const http = require('http');
require('dotenv').config();
const apiKey = process.env.API_KEY;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Submit to get weather report!' ,output: ""});
});


router.post("/http", function(req, res) {
  let zipcode = req.body.zipcode

  function httpRequest(params, postData) {
    return new Promise(function(resolve, reject) {
      let req = http.request(params, function(res) {
        // reject on bad status
        if (res.statusCode < 200 || res.statusCode >= 300) {
          return reject(new Error('statusCode=' + res.statusCode));
        }
        // cumulate data
        var body = [];
        res.on('data', function(chunk) {
          body.push(chunk);
        });
        // resolve on end
        res.on('end', function() {
          try {
            body = JSON.parse(Buffer.concat(body).toString());
          } catch(e) {
            reject(e);
          }
          resolve(body);
        });
      });
      // reject on request error
      req.on('error', function(err) {
        // This is not a "Second reject", just a different sort of failure
        reject(err);
      });
      if (postData) {
        req.write(postData);
      }
      // IMPORTANT
      req.end();
    });
  }


  httpRequest(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${zipcode}`).then(function(body) {
    // res.send(`${JSON.stringify(body)}`)
    res.render('index', { title: 'We got a http request!' , output: JSON.stringify(body) });
  });


});


router.post("/await", function(req, res) {
  let zipcode = req.body.zipcode
  const fetchData = async () => {
    const res = await fetch(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${zipcode}`, {
      method: "GET"
    })
    const json = await res.json();
    return json
  };
  fetchData().then((value)=> {
    res.render('index', { title: 'We got a fetch await ' , output: JSON.stringify(value) });

  })
});

router.post("/callback", function(req, res) {
  let zipcode = req.body.zipcode
  function makeRequest( params, callback) {

    const req = http.request(params, (res) => {
      let responseString = '';

      res.on('data', (data) => {
        responseString += data;
      });

      res.on('end', () => {
        callback(null, responseString);
      });
    });

    req.on('error', (error) => {
      callback(error, null);
    });

    req.write(params);
    req.end();
  }
  let params = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${zipcode}`
  makeRequest(params, (error, response) => {
    if(error)  res.send(error);
    res.render('index', { title: 'We got a callback ' , output: JSON.stringify(response) });
    });


});
module.exports = router;

