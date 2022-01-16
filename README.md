# wordle-solver

Using letter frequency and word popularity, create a simple  wordle solver!
Used https://foldr.moe/hello-wordl for extensive manual testing, and used https://en.lexipedia.org/ to build the popular words list.

It will give you a current guess word, and you need to input which letters were correct, unused, or just in the wrong spot.
This will look like `uuucw`, if the first three letters are unused, forth letter correct spot, and 5th letter in the wrong spot.
If you want to reset, simply type `reset`.
If you want to use a different word, just type `word _____` where instead of ______ you type your new word.
If you want to skip a word (it's possible the word doesn't exist) just type `skip`.

```bash
$ node wordle-solver.js 
top 8 words [
  'tales', 'cares',
  'lares', 'dares',
  'pares', 'rales',
  'tares', 'tores'
]
word result (u = unused, w = wrong spot, c = correct).
To use a different guess word, type 'word _____' or 'skip'
current Guess:
tales
uucuc
top 16 words [
  'holds', 'golds', 'folds',
  'polis', 'milos', 'molds',
  'bolus', 'kilos', 'pulis',
  'colds', 'pilus', 'holms',
  'bolds', 'filos', 'gilds',
  'milds'
]
word result (u = unused, w = wrong spot, c = correct).
To use a different guess word, type 'word _____' or 'skip'
current Guess:
holds
uucuc
```
