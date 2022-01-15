// build word probabibility chart

const words = require("./words.json");
const util = require("util");
const cp = require("child_process");

const copyToClipboard = () => {
  cp.spawn("clip").stdin.end(util.inspect("content_for_the_clipboard"));
};

const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
rl.close();

// [{a: 10, b:3}, {}]

const letterPropabilityByIndex = words.reduce(
  (letterDict, word) => {
    [...word].forEach((letter, index) => {
      if (letter in letterDict[index]) {
        letterDict[index][letter] = letterDict[index][letter] + 1;
      } else {
        letterDict[index][letter] = 1;
      }
    });
    return letterDict;
  },
  [{}, {}, {}, {}, {}]
);
console.log({ letterPropabilityByIndex });

// {a: 10, b:3}
const letterPropability = words.reduce((letterDict, word) => {
  [...word].forEach((letter) => {
    if (letter in letterDict) {
      letterDict[letter] = letterDict[letter] + 1;
    } else {
      letterDict[letter] = 1;
    }
  });
  return letterDict;
}, {});
console.log({ letterPropability });

const wordsScoreSorted = [...words].sort((wordA, wordB) => {
  const scoreA = [...new Set([...wordA])].reduce(
    (total, letter) => letterPropability[letter] * total,
    1
  );
  const scoreB = [...new Set([...wordB])].reduce(
    (total, letter) => letterPropability[letter] * total,
    1
  );
  return scoreB - scoreA;
});

const getWordScore = (word, log = () => {}) => {
  const score = [...word].reduce(
    (total, letter, index) =>
      (log(letter, index, letterPropabilityByIndex[index][letter]),
      letterPropabilityByIndex[index][letter]) *
      (log(letter, letterPropability[letter]), letterPropability[letter]) *
      (log({ total }), total),
    1
  );
  // reduce score if duplicate letter in word
  if (isNaN(score)) {
    return 0;
  }
  if ([...new Set([...word])].length != word.length) {
    return Math.floor(score / 8);
  }
  return score;
};

const wordsIndexedScoreSorted = [...words].sort((wordA, wordB) => {
  return getWordScore(wordB) - getWordScore(wordA);
});

console.log(wordsIndexedScoreSorted);

const currentGuess = wordsIndexedScoreSorted[0];

const askUser = () => {
  rl.question(
    "word result (u = unused, w = wrong spot, c = correct). To select a word, use  'word _____'",
    (response) => {
      if (response.startsWith("word ")) {
        currentGuess = response.slice(5);
      }
      [...currentGuess].forEach((letter, index) => {
        if (response[index] === "u") {
          letterPropabilityByIndex[index][letter] = 0;
        }
        if (response[index] === "w") {
          letterPropability[letter] = letterPropability[letter] * 5;
        }
        if (response[index] === "c") {
          letterPropabilityByIndex[index] = { letter: 1 };
        }
      });
      askUser();
    }
  );
};
