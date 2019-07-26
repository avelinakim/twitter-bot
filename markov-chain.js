import text from "./text-data.js"

function prepareText(text) {
  let preparedText = text.replace(/\.\.\./g, " ...");
  preparedText = preparedText.replace(/([^\.])\. /g, '$1 . ');
  preparedText = preparedText.replace(/([\.\?\!\:\"])$/g, ' $1');
  preparedText = preparedText.replace(/([\,\.\?\!\:\"])(\s+)/g, ' $1$2');
  return preparedText;
}

export function generateMarkovChain(text) {
  let preppedText = prepareText(text);
  const textArr = preppedText.split(/\s+/g);
  const markovChain = {};

  for (let i = 0; i < textArr.length; i++) {
    let word = textArr[i];
    if (!markovChain[word]) markovChain[word] = [];
    if (i < textArr.length - 1) {
      let nextWord = textArr[i + 1].replace(/\s/, "");
      markovChain[word].push(nextWord);
    }
  }
  return markovChain;
}

export function generateText(markovChain, numberWords) {
  let newText = markovChain['.'][Math.floor(Math.random() * markovChain['.'].length)];
  let lastWord = newText;
  let i = 1;
  while (i < numberWords) {
    let lastWordArr = markovChain[lastWord];
    let nextWord = lastWordArr[Math.floor(Math.random() * lastWordArr.length)];
    let space = "";
    if ((nextWord) && ![".", ",", "!", "...", "?"].includes(nextWord[0])) space = " ";
    newText = newText.concat(space + nextWord);
    lastWord = nextWord;
    i++;
  }
  return newText;
}

//let myMarkovChain = generateMarkovChain(text);
//console.log("My Chain:", myMarkovChain);


//let generatedText = generateText(myMarkovChain, 30);
//console.log("Generated Text: " + generatedText);

