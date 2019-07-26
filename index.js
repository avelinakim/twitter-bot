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
  q: 'from:realdonaldtrump',
  tweet_mode: 'extended'
};

client.get('search/tweets', params, (error, tweetsObj, response) => {
  if (!error) {
    let tweetData = fs.readFileSync('text-data.json', 'utf8');
    tweetData = JSON.parse(tweetData)
    console.log("STARTING DATA: ", tweetData);
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
    fs.writeFileSync('text-data.json', JSON.stringify(tweetData), 'utf8');
    console.log("UPDATED DATA:", tweetData);
  } else {
    console.log('ERROR', error)
  }
});


// let markovChain = generateMarkovChain(tweetText);
// let generatedText = generateText(markovChain, 20);
// console.log("TEXT: " + generatedText); 
