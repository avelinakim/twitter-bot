import emojiRegex from 'emoji-regex'
const eRegex = emojiRegex();

// Helper Functions
function prepareText(text) {
  let preparedText = text.replace(/(\.\.\.|\.|\,|[\?\!]+|\:|\")($|\s+)/g, " $1$2");
  preparedText = preparedText.replace(/[@"()]/g, '');
  preparedText = preparedText.replace(/&amp;/g, ' & ');
  return preparedText;
}

function randomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Generate Markov Chain
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
    ...(markovChain.startWords || []),
    ...(markovChain['.'] || []),
    ...(markovChain['!'] || []),
    ...(markovChain['?'] || []),
  ]
  return markovChain;
}

// Generate Tweet
export function generateText(markovChain) {
  let probability = [1, 1, 2, 2, 2, 3];
  let ideaCounter = randomElement(probability);

  let startWords = markovChain.startWords;
  let firstWord = randomElement(startWords);
  let lastWord = firstWord;
  let tweet = "";
  let idea = firstWord;

  while (ideaCounter > 0) {

    // Check for end of idea, concat, then start new idea or return tweet
    if (/[\.\?\!\#]/.test(lastWord) || eRegex.test(lastWord)) {
      if ((idea.length + tweet.length) < 280) {
        tweet = tweet.concat(idea);
        ideaCounter--;
      }
      lastWord = randomElement(startWords);
      idea = " " + lastWord;

      if (tweet.length >= 200) {
        return tweet;
      }
    }

    // Determine and add new word to idea
    if (!markovChain[lastWord] || !markovChain[lastWord].length) {
      lastWord = randomElement(startWords);
      idea = lastWord;
    }
    let lastWordArr = markovChain[lastWord];
    let nextWord = randomElement(lastWordArr);
    let space = "";
    if ((nextWord) && ![".", ",", "!", "...", "?", ":"].includes(nextWord[0])) space = " ";

    idea = idea.concat(space + nextWord);
    lastWord = nextWord;
  }
  return tweet;
}


