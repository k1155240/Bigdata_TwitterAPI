const twitter = require('twitter');
const port = 3000;
const request = require('request');
require('dotenv').config();

var consumer_key = process.env.CONSUMER_KEY;
var consumer_secret = process.env.CONSUMER_SECRET;
var encode_secret = new Buffer(consumer_key + ':' + consumer_secret).toString('base64');
var bearer;

var express = require('express')
var app = express()


const requestHandler = (request, response) => {
    console.log(request.url)

    var client = new twitter({
        consumer_key: consumer_key,
        consumer_secret: consumer_secret,
        bearer_token: bearer
    });

    client.get("search/tweets.json", {q:request.query.query, result_type:"popular", lang:"en"}, function(error, tweets, twitter_response) {
        if(error) {console.log(error); throw error};
        console.log(tweets); 
        //console.log(twitter_response);  // Raw response object.

        //responseJson = JSON.parse(tweets)

        var tweetsHtml = "";
        console.log(typeof tweets); 
        tweets.statuses.forEach(element => {
            tweetsHtml += "<p>" + element.text + "</p>";
        });

        response.send('<html><head></head><body>' + tweetsHtml + '</body></html>')
    });
}

var options = {
    url: 'https://api.twitter.com/oauth2/token',
    headers: {
        'Authorization': 'Basic ' + encode_secret,
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
    body: 'grant_type=client_credentials'
};

request.post(options, function(error, response, body) {
    bearer = JSON.parse(body).access_token;
    //console.log(bearer)
    app.get('/twitter', requestHandler);

    app.use(express.static('public'));

    app.listen(port, () => console.log('Example app listening on port ' + port + '!'))
});


  
