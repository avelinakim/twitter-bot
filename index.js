import Twitter from 'twitter';
import dotenv from 'dotenv';
import { generateMarkovChain, generateText } from "./markov-chain.js"

dotenv.config()

const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

const params = {
  q: 'from:realdonaldtrump',
  tweet_mode: 'extended'
};

let tweetText = "";

client.get('search/tweets', params, (error, tweetsObj, response) => {
  if (!error) {
    let tweetsArr = tweetsObj.statuses;
    for (let tweet of tweetsArr) {
      if (!tweet.retweeted_status) {
        tweetText += tweet.full_text + " ";
      }
    }
    console.log("IN GET" + tweetText);
  } else {
    console.log('ERROR', error)
  }
});

// console.log("TWEET TEXT" + tweetText);
// let markovChain = generateMarkovChain(tweetText);
// let generatedText = generateText(markovChain, 20);

// console.log("TEXT: " + generatedText); 
