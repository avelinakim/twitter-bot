import Twitter from 'twitter';
import dotenv from 'dotenv';
import { generateMarkovChain, generateText } from "./markov-chain.js"
import * as fs from 'fs';
import { saveTweet, getTweets } from "./firebase.js"

dotenv.config();

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
    // let tweetData = JSON.parse(fs.readFileSync('text-data.json', 'utf8'));
    let tweetsArr = tweetsObj.statuses;
    for (let tweet of tweetsArr) {
      if (!tweet.retweeted_status && !tweet.in_reply_to_status_id) {
        let tweetText = tweet.full_text + " ";
        let tweetID = tweet.id;
        saveTweet(tweetID.toString(), tweetText);

        // For text-data.json
        // let tweetNotInData = tweetData.every((tweetObj) => tweetObj.id !== tweetID);
        // if (tweetNotInData) {
        //   let newTweetObj = { text: tweetText, id: tweetID };
        //   tweetData.push(newTweetObj);
        // }
      }
    }
    // fs.writeFileSync('text-data.json', JSON.stringify(tweetData, null, 2), 'utf8');
  } else {
    console.log('ERROR', error)
  }
});

async function createTweet() {
  let startWords = [];
  let tweetData = await getTweets();
  let tweetText = tweetData.reduce((string, textObj) => {
    startWords.push((textObj.text).split(" ")[0]);
    return string + textObj.text + " ";
  }, "");

  let markovChain = generateMarkovChain(tweetText, startWords);
  let generatedTweet = generateText(markovChain);
  return generatedTweet;
}

async function postTweet(tweet) {
  client.post('statuses/update', { status: tweet }, (error, tweet, response) => {
    if (error) throw error;
    console.log(tweet.text);
  });
}

async function main() {
  let tweet = await createTweet();
  console.log(tweet);
  postTweet(tweet);
}

main();
//postTweet();
