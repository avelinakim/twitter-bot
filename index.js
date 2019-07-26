import Twitter from 'twitter';
import dotenv from 'dotenv';
import { generateMarkovChain, generateText } from "./markov-chain.js"
import * as fs from 'fs';

dotenv.config()

const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

const params = {
  q: 'from:cigneutron',
  tweet_mode: 'extended'
};

client.get('search/tweets', params, (error, tweetsObj, response) => {
  if (!error) {
    let tweetData = JSON.parse(fs.readFileSync('text-data.json', 'utf8'));
    let tweetsArr = tweetsObj.statuses;
    for (let tweet of tweetsArr) {
      if (!tweet.retweeted_status) {
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

function createTweet() {
  let tweetData = JSON.parse(fs.readFileSync('text-data.json', 'utf8'));
  let tweetText = tweetData.reduce((string, textObj) => {
    string += textObj.text + " ";
    return string;
  }, "");
  let markovChain = generateMarkovChain(tweetText);
  let generatedTweet = generateText(markovChain, 10);
  return generatedTweet;
}

function postTweet() {
  client.post('statuses/update', { status: createTweet() }, (error, tweet, response) => {
    if (error) throw error;
    console.log(tweet);
  });
}

//console.log(createTweet()); 
postTweet();  