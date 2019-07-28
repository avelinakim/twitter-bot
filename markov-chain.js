import emojiRegex from 'emoji-regex'
const eRegex = emojiRegex();

function prepareText(text) {
  let preparedText = text.replace(/\.\.\./g, " ...");
  preparedText = preparedText.replace(/([^\.])\. /g, '$1 . ');
  preparedText = preparedText.replace(/([\.\?\!\:\"])$/g, ' $1');
  preparedText = preparedText.replace(/([\,\.\?\!\:\"])(\s+)/g, ' $1$2');
  preparedText = preparedText.replace(/[@"()]/g, '');
  preparedText = preparedText.replace(/&amp;/g, ' & ');
  return preparedText;
}

export function generateMarkovChain(text, startWordsArr) {
  let preppedText = prepareText(text);
  const markovChain = { startWords: [] };
  let textArr = preppedText.split(/\s+/g);
  textArr = textArr.filter((word) => word !== '');

  for (let i = 0; i < textArr.length; i++) {
    let word = textArr[i];
    if (!markovChain[word]) markovChain[word] = [];
    if (i < textArr.length - 1) {
      let nextWord = textArr[i + 1].replace(/\s/, "");
      markovChain[word].push(nextWord);
    }
  }
  markovChain.startWords = [
    ...markovChain.startWords,
    ...markovChain['.'],
    ...markovChain['!'],
    ...markovChain['?'],
  ]
  console.log("MarkovChain:", markovChain);
  return markovChain;
}

export function generateText(markovChain) {
  let probability = [1, 1, 2, 2, 2, 3];
  let ideaCounter = probability[Math.floor(Math.random() * probability.length)];
  console.log(ideaCounter);

  let firstWord = markovChain.startWords[Math.floor(Math.random() * markovChain.startWords.length)];
  console.log("First Word: " + firstWord);
  let lastWord = firstWord;
  let tweet = "";
  let idea = firstWord;

  while (ideaCounter > 0) {

    // check for end of idea
    if (/[\.\?\!\#]/.test(lastWord) || eRegex.test(lastWord)) {
      if ((idea.length + tweet.length) < 280) {
        tweet = tweet.concat(idea);
        ideaCounter--;
        console.log("Counter: ", ideaCounter + " LastWord:", lastWord);
      }
      lastWord = markovChain.startWords[Math.floor(Math.random() * markovChain.startWords.length)];
      console.log("New idea, first word: " + lastWord);
      idea = " " + lastWord;

      if (tweet.length >= 200) {
        console.log("getting too long, RETURN");
        return tweet;
      }
    }

    // pick and add new word to idea
    let lastWordArr = markovChain[lastWord];
    let nextWord = lastWordArr[Math.floor(Math.random() * lastWordArr.length)];
    let space = "";
    if ((nextWord) && ![".", ",", "!", "...", "?", ":"].includes(nextWord[0])) space = " ";

    idea = idea.concat(space + nextWord);
    lastWord = nextWord;
  }
  return tweet;
}


