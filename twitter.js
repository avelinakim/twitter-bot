require('dotenv').config();
const Twitter = require('twitter');

const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

const params = {
  q: 'from:BillNye',
};

let tweetText = "";

client.get('search/tweets', params, (error, tweetsObj, response) => {
  console.log("CLIENT STUFF");
  if (!error) {
    let tweetsArr = tweetsObj.statuses;
    for (let tweet of tweetsArr) {
      if (!tweet.retweeted_status) {
        console.log("USER: " + tweet.user.name + "TWEET ------------> " + tweet.text);
      }
    }
  }
});
