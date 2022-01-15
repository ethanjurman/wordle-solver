let words = require("./words.json");
const popularWords = require("./popularWords");

const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

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

const getWordScore = (word, log = () => {}) => {
  const score = [...word].reduce(
    (total, letter, index) =>
      (log(letter, index, letterPropabilityByIndex[index][letter]),
      letterPropabilityByIndex[index][letter]) *
      (log(letter, letterPropability[letter]), letterPropability[letter]) *
      (log({ total }), total),
    1
  );
  if (isNaN(score)) {
    return 0;
  }
  // reduce score if duplicate letter in word
  if ([...new Set([...word])].length != word.length) {
    return Math.floor(score / 10000);
  }
  return score;
};

let wordsIndexedScoreSorted = [];

let popularScope = 8; // we check popular words out of high scored words

const scoreWords = (scope) => {
  wordsIndexedScoreSorted = [...words].sort((wordA, wordB) => {
    return getWordScore(wordB) - getWordScore(wordA);
  });
  const topOfTop = wordsIndexedScoreSorted
    .slice(0, scope)
    .sort((wordA, wordB) => {
      const indexA = popularWords.indexOf(wordA);
      const indexB = popularWords.indexOf(wordB);
      if (indexA === -1) {
        return Infinity;
      }
      if (indexB === -1) {
        return -Infinity;
      }
      return indexA - indexB;
    });
  console.log("top 20 words", topOfTop);
  return topOfTop[0];
};
const firstWordGuess = scoreWords(popularScope);

const askUser = (currentGuess = firstWordGuess) => {
  rl.question(
    `word result (u = unused, w = wrong spot, c = correct).\nTo use a different guess word, type 'word _____' or 'skip'\ncurrent Guess: \n${currentGuess}\n`,
    (response) => {
      const isNewWord = response.startsWith("word ");
      if (isNewWord) {
        const newGuess = response.slice(5);
        askUser(newGuess);
        return;
      }
      const isSkip = response.startsWith("skip");
      if (isSkip) {
        words = words.filter((word) => word != currentGuess);
        const newGuess = scoreWords(popularScope);
        askUser(newGuess);
        return;
      }
      const isReset = response.startsWith("reset");
      if (isReset) {
        words = require("./words.json");
        popularScope = 8;
        const newGuess = scoreWords(popularScope);
        askUser(newGuess);
        return;
      }

      // doing word logic
      [...currentGuess].forEach((letter, index) => {
        if (response[index] === "u") {
          const onlyInstance =
            currentGuess.indexOf(letter) === currentGuess.lastIndexOf(letter);
          // if only instance, remove all usages, otherwise only remove this instance
          if (onlyInstance) {
            words = words.filter((word) => !word.includes(letter));
          }
          if (!onlyInstance) {
            words = words.filter((word) => {
              return word[index] != letter;
            });
          }
        }
        if (response[index] === "w") {
          words = words.filter(
            (word) => word[index] != letter && word.includes(letter)
          );
        }
        if (response[index] === "c") {
          words = words.filter((word) => word[index] === letter);
        }
      });
      popularScope = popularScope * 2;
      const newGuess = scoreWords(popularScope);
      askUser(newGuess);
      return;
    }
  );
};

askUser();
