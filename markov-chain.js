import emojiRegex from 'emoji-regex'
const eRegex = emojiRegex();

function prepareText(text) {
  let preparedText = text.replace(/\.\.\./g, " ...");
  preparedText = preparedText.replace(/([^\.])\. /g, '$1 . ');
  preparedText = preparedText.replace(/([\.\?\!\:\"])$/g, ' $1');
  preparedText = preparedText.replace(/([\,\.\?\!\:\"])(\s+)/g, ' $1$2');
  preparedText = preparedText.replace(/[@"()]/g, '');
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

export function generateText(markovChain, numberWords) {
  let probability = [1, 2, 2, 2, 2, 3];
  let counter = probability[Math.floor(Math.random() * probability.length)];
  console.log(counter);
  let newText = markovChain.startWords[Math.floor(Math.random() * markovChain.startWords.length)];
  let lastWord = newText;
  let i = 1;
  while (i < numberWords) {
    if (/[\.\?\!\#]/.test(lastWord) || eRegex.test(lastWord)) {
      counter--;
      console.log("Counter: ", counter + " LastWord:", lastWord);
      if (counter <= 0) return newText;
    }
    let lastWordArr = markovChain[lastWord];
    let nextWord = lastWordArr[Math.floor(Math.random() * lastWordArr.length)];
    let space = "";
    if ((nextWord) && ![".", ",", "!", "...", "?", ":"].includes(nextWord[0])) space = " ";
    newText = newText.concat(space + nextWord);
    lastWord = nextWord;
    i++;
  }
  return newText;
}


