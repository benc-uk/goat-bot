var express = require('express');
var router = express.Router();
var request = require('request');

// This loads the environment variables from the .env file
require('dotenv-extended').load();
var secret = process.env.BOT_WEBCHAT_SECRET;
var handle = process.env.BOT_HANDLE;

/* GET home page. */
router.get('/', function (req, res, next) {

  // Get a token for the webchat control
  var req = { url: 'https://webchat.botframework.com/api/tokens', headers: { 'Authorization': 'BotConnector ' + secret } };
  var tok = '';
  var err = '';
  // This voodoo gets a token, so we don't hardcode our secret into the HTML of the chat iframe
  request(req, function (error, response, body) {
    if (error) {
      console.log("!WEBCHAT TOKEN ERROR! " + error);
      err = error;
    } else {
      var resp = JSON.parse(body);
      if (resp.message) {
        console.log("!WEBCHAT TOKEN ERROR! " + resp.message);
        err = resp.message
      } else {
        tok = resp;
      }
    }
    // Render the page!
    res.render('index', { title: 'Goat Info Central', token: tok, error: err, handle: handle });
  });
});

module.exports = router;
