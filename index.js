import Twitter from 'twitter';
import dotenv from 'dotenv';
import { generateMarkovChain, generateText } from "./markov-chain.js"
import * as fs from 'fs';

dotenv.config()

let twitterConfig = {
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
}

const client = new Twitter();

const params = {
  q: 'from:cigneutron',
  tweet_mode: 'extended'
};

client.get('search/tweets', params, (error, tweetsObj, response) => {
  if (!error) {
    console.log("Got the TWEETS")
    let tweetData = JSON.parse(fs.readFileSync('text-data.json', 'utf8'));
    let tweetsArr = tweetsObj.statuses;
    for (let tweet of tweetsArr) {
      if (!tweet.retweeted_status && !tweet.in_reply_to_status_id) {
        let tweetText = tweet.full_text + " ";
        let tweetID = tweet.id;
        let tweetNotInData = tweetData.every((tweetObj) => tweetObj.id !== tweetID);
        if (tweetNotInData) {
          let newTweetObj = { text: tweetText, id: tweetID };
          tweetData.push(newTweetObj);
        }
      }
    }
    fs.writeFileSync('text-data.json', JSON.stringify(tweetData, null, 2), 'utf8');
  } else {
    console.log('ERROR', error)
  }
});

let startWords = [];
function createTweet() {
  startWords = [];
  let tweetData = JSON.parse(fs.readFileSync('text-data.json', 'utf8'));
  let tweetText = tweetData.reduce((string, textObj) => {
    startWords.push((textObj.text).split(" ")[0]);
    return string + textObj.text + " ";
  }, "");
  let markovChain = generateMarkovChain(tweetText, startWords);
  let generatedTweet = generateText(markovChain);
  return generatedTweet;
}

function postTweet() {
  client.post('statuses/update', { status: createTweet() }, (error, tweet, response) => {
    if (error) throw error;
    console.log(tweet.text);
  });
}

console.log(createTweet());
postTweet();
