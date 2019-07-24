
function markovChainGenerator(text) {
  const textArr = text.split(' ');
  const markovChain = {};

  for (let i = 0; i < textArr.length; i++) {
    let word = textArr[i].toLowerCase().replace(/[\W_]/, "");

    if (!markovChain[word]) markovChain[word] = [];
    if (i < textArr.length - 1) {
      let nextWord = textArr[i + 1].toLowerCase().replace(/[\W_]/, "");
      markovChain[word].push(nextWord);
    }
  }
  return markovChain;
}

function textGenerator(markovChain, numberWords) {
  let markovArr = Object.keys(markovChain);
  // console.log(Object.keys(markovChain));
  // console.log(Math.random() * Object.keys(markovChain).length);
  let newText = Object.keys(markovChain)[Math.floor(Math.random() * Object.keys(markovChain).length)];
  //console.log("First Word: " + newText);
  let lastWord = newText;
  let i = 1;
  while (i < numberWords) {
    let lastWordArr = markovChain[lastWord];
    //console.log("Last Word: " + lastWord + " Arr: " + lastWordArr);
    let nextWord = lastWordArr[Math.floor(Math.random() * lastWordArr.length)];
    console.log("Next word: " + nextWord);
    newText = newText.concat(" " + nextWord);
    lastWord = nextWord;
    i++;
  }
  return newText;
}

let myMarkovChain = markovChainGenerator(` The house stood on a slight rise just on the edge of the village. It stood on its own and looked out over a broad spread of West Country farmland. Not a remarkable house by any means— it was about thirty years old, squattish, squarish, made of brick, and had four windows set in the front of a size and proportion which more or less exactly failed to please the eye. The only person for whom the house was in any way special was Arthur Dent, and that was only because it happened to be the one he lived in. He had lived in it for about three years, ever since he had moved out of London because it made him nervous and irritable. He was about thirty as well, tall, dark-haired and never quite at ease with himself. The thing that used to worry him most was the fact that people always used to ask him what he was looking so worried about. He worked in local radio which he always used to tell his friends was a lot more interesting than they probably thought. It was, too— most of his friends worked in advertising. On Wednesday night it had rained very heavily, the lane was wet and muddy, but the Thursday morning sun was bright and clear as it shone on Arthur Dent’s house for what was to be the last time. It hadn’t properly registered yet with Arthur that the council wanted to knock it down and build a bypass instead.
`);
//console.log(myMarkovChain);

let myText = textGenerator(myMarkovChain, 12);
console.log("Generated Text: " + myText);

