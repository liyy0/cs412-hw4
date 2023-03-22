const express = require('express');
const router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.post("/http", function(req, res) {
  let zipcode = req.body.zipcode_a
  function httpRequest(params) {
    return new Promise(function(resolve, reject) {
      request(params, function (error, response, body){
        let temp_c = JSON.parse(body)
        // res.send(`${JSON.stringify(temp_c)}`)
        console.log(body)
        resolve(body);
      });

    });
  }

  httpRequest(`http://api.weatherapi.com/v1/current.json?key=29ea13322a4e4d73ae6194128232003&q=${zipcode}`).then(function(body) {
    // res.send(`${JSON.stringify(body)}`)
    res.render('index', { feedback_http: body });
  });

});

router.post("/await", function(req, res) {
  let zipcode = req.body.zipcode
  const getApiKey = async () => {
    const res = await fetch(`http://api.weatherapi.com/v1/current.json?key=29ea13322a4e4d73ae6194128232003&q=${zipcode}`, {
      method: "GET"//
    })

    const json = await res.json();
    return json
  };
  getApiKey().then((value)=> {
    let output = value
    // res.send(`${JSON.stringify(temp_c)}`)
    res.render('index', { feedback_http: output });
  })


  // res.send(` ${output}`);
});
module.exports = router;
