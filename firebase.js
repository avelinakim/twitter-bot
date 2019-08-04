import dotenv from 'dotenv';
import admin from 'firebase-admin';

dotenv.config();

const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG)
admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig)
});
let db = admin.firestore();

export async function saveTweet(tweetID, tweetText) {
  let tweetRef = db.collection('tweets').doc(tweetID);
  let tweetDoc = await tweetRef.get();
  if (tweetDoc.exists) return;
  return tweetRef.set({
    text: tweetText
  })
}

export async function getTweets() {
  let tweetsString = "";
  let tweetsArr = [];
  let tweetsRef = db.collection('tweets');
  let tweets = await tweetsRef.get();
  tweets.forEach(tweet => {
    tweetsArr.push(tweet.data());
  });
  return tweetsArr;
}
