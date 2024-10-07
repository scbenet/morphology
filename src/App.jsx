// App.jsx
import { useState, useEffect } from "react";

import { wordList } from "./words/wordList";
import {
  generateGameWordList,
  generateWordPair,
} from "./words/wordListGenerator";

const wordSet = new Set(wordList);
const WORD_LENGTH = 5;

// Check if two words differ by exactly one letter
const isDifferentByOneLetter = (word1, word2) => {
  let differences = 0;
  for (let i = 0; i < word1.length; i++) {
    if (word1[i] !== word2[i]) differences++;
  }
  return differences === 1;
};



function App() {
  const [startWord, setStartWord] = useState("");
  const [targetWord, setTargetWord] = useState("");
  const [currentChain, setCurrentChain] = useState([]);
  const [inputWord, setInputWord] = useState("");
  const [gameWon, setGameWon] = useState(false);
  const [error, setError] = useState("");

  // initialize game with random start and target words
  useEffect(() => {
    // wordList only has 5 letter words for now so don't need this
    // const fourLetterWords = wordList.filter(word => word.length === WORD_LENGTH);
    const { words, graph } = generateGameWordList();
    const game = generateWordPair(words, graph, 4, 5);
    console.log(game);

    setStartWord(game.startWord);
    setTargetWord(game.targetWord);
    setCurrentChain([game.startWord]);
    setInputWord("");
  }, []);

  // Validate the next word in the chain
  const isValidNextWord = (word) => {
    if (!wordSet.has(word.toLowerCase())) {
      setError("Not a valid word");
      return false;
    }

    if (!isDifferentByOneLetter(word, currentChain[currentChain.length - 1])) {
      setError("Must change exactly one letter");
      return false;
    }

    return true;
  };

  // Handle word submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const word = inputWord.toLowerCase();

    if (isValidNextWord(word)) {
      const newChain = [...currentChain, word];
      setCurrentChain(newChain);
      setInputWord("");

      if (word === targetWord) {
        setGameWon(true);
      }
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Morphology</h1>

      <div className="mb-4">
        <p>
          Start Word: <span className="font-bold">{startWord}</span>
        </p>
        <p>
          Target Word: <span className="font-bold">{targetWord}</span>
        </p>
      </div>

      <div className="mb-4">
        <h2 className="text-xl mb-2">Your Chain:</h2>
        <div className="space-y-2">
          {currentChain.map((word, index) => (
            <div key={index} className="p-2 bg-gray-100 text-black rounded">
              {word}
            </div>
          ))}
        </div>
      </div>

      {!gameWon && (
        <>
          <form onSubmit={handleSubmit} className="space-y-2">
            <input
              type="text"
              value={inputWord}
              onChange={(e) => setInputWord(e.target.value)}
              maxLength={WORD_LENGTH}
              className="w-full p-2 border rounded"
              placeholder="Enter next word"
            />
            <button
              type="submit"
              className="w-full p-2 bg-blue-500 text-white rounded"
            >
              Submit
            </button>
          </form>
          <button
            className="w-full mt-2 p-2 bg-blue-500 text-white rounded"
            onClick={() => {
              if (currentChain.length > 1) {
                setCurrentChain(currentChain.slice(0, -1));
              }
            }}
          >
            Go back
          </button>
        </>
      )}

      {error && <div className="mt-2 text-red-500">{error}</div>}

      {gameWon && (
        <div className="mt-4 p-4 bg-green-100 text-black rounded">
          Congratulations! You won in {currentChain.length - 1} moves!
        </div>
      )}
    </div>
  );
}

export default App;
