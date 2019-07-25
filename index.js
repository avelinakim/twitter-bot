function prepareText(text) {
  let preparedText = text.replace(/\.\.\./g, " ...");
  preparedText = preparedText.replace(/([^\.])\. /g, '$1 . ');
  preparedText = preparedText.replace(/\.$/g, ' .');
  preparedText = preparedText.replace(/\, /g, ' , ');
  preparedText = preparedText.replace(/\? /g, ' ? ');
  preparedText = preparedText.replace(/\! /g, ' ! ');
  return preparedText;
}

function generateMarkovChain(text) {
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

function generateText(markovChain, numberWords) {
  let newText = markovChain['.'][Math.floor(Math.random() * markovChain['.'].length)];
  let lastWord = newText;
  let i = 1;
  while (i < numberWords) {
    let lastWordArr = markovChain[lastWord];
    let nextWord = lastWordArr[Math.floor(Math.random() * lastWordArr.length)];
    let space = "";
    if (![".", ",", "!", "...", "?"].includes(nextWord[0])) space = " ";
    newText = newText.concat(space + nextWord);
    lastWord = nextWord;
    i++;
  }
  return newText;
}

let myMarkovChain = generateMarkovChain(`The house stood on a slight rise just on the edge of the village...

It stood on its own and looked out over a broad spread of West Country farmland... Not a remarkable house by any means— it was about thirty years old, squattish, squarish, made of brick, and had four windows set in the front of a size and proportion which more or less exactly failed to please the eye. The only person for whom the house was in any way special was Arthur Dent, and that was only because it happened to be the one he lived in. He had lived in it for about three years, ever since he had moved out of London because it made him nervous and irritable. He was about thirty as well, tall, dark-haired and never quite at ease with himself. The thing that used to worry him most was the fact that people always used to ask him what he was looking so worried about. He worked in local radio which he always used to tell his friends was a lot more interesting than they probably thought. It was, too— most of his friends worked in advertising. 

On Wednesday night it had rained very heavily, the lane was wet and muddy, but the Thursday morning sun was bright and clear as it shone on Arthur Dent’s house for what was to be the last time! 
It hadn’t properly registered yet with Arthur that the council wanted to knock it down and build a bypass instead.`);
console.log("My Chain:", myMarkovChain);


let myText = generateText(myMarkovChain, 30);
console.log("Generated Text: " + myText);

