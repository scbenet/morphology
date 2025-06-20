// React imports
import { useState, useEffect } from "react";

// Mantine imports
// import { useMantineTheme } from "@mantine/core";
import { useDisclosure, useClipboard, useLocalStorage } from "@mantine/hooks";

// Local imports
import {
  generateGameWordList,
  generateWordPair,
} from "./words/wordListGenerator";

import { Header } from "./components/Header";
import { WordChain } from "./components/WordChain";
import { wordList } from "./words/wordList";
import { GameInput } from "./components/GameInput";

import { GameWonAlert } from "./components/GameWonAlert";
import { ErrorAlert } from "./components/ErrorAlert";

import { HelpModal } from "./components/modals/HelpModal";
import { StatsModal } from "./components/modals/StatsModal";
import { GameWonModal } from "./components/modals/GameWonModal";
// import { SettingsModal } from "./components/modals/SettingsModal";

// Styles import
import "@mantine/core/styles.css";
import { GameWonInput } from "./components/GameWonInput";

const wordSet = new Set(wordList);
const { words, graph } = generateGameWordList();
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
  // const theme = useMantineTheme();
  const [user, setUser] = useState(null);
  const [firstVisit, setFirstVisit] = useLocalStorage({
    key: "first_visit",
    defaultValue: true,
  });
  const [startWord, setStartWord] = useState("");
  const [targetWord, setTargetWord] = useState("");
  const [currentChain, setCurrentChain] = useState([]);
  const [inputWord, setInputWord] = useState("");
  const [gameWon, setGameWon] = useState(false);
  const [error, setError] = useState("");
  const [gameWonOpened, gameWonHandlers] = useDisclosure(false);
  const [helpOpened, helpHandlers] = useDisclosure(firstVisit);
  const [statsOpened, statsHandlers] = useDisclosure(false);
  const [, settingsHandlers] = useDisclosure(false);
  const clipboard = useClipboard({ timeout: 500 });

  const [stats, setStats] = useState({
    gamesPlayed: 0,
    currentStreak: 0,
    longestStreak: 0,
  });

  // get user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/user", {
          credentials: "include", // Include cookies for session-based auth
        });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };

    fetchUser();
    setFirstVisit(false);
  }, [setFirstVisit]);

  // get game stats
  useEffect(() => {
    const fetchStats = async () => {
      if (user) {
        try {
          const response = await fetch("http://localhost:3000/api/stats", {
            credentials: "include",
          });
          if (response.ok) {
            const statsData = await response.json();
            setStats({
              gamesPlayed: statsData.games_played,
              currentStreak: statsData.current_streak,
              longestStreak: statsData.longest_streak,
            });
            console.log(statsData);
          }
        } catch (err) {
          console.error("Failed to fetch stats:", err);
        }
      }
    };

    fetchStats();
  }, [user]);

  async function resetGame() {
    const game = generateWordPair(words, graph, 2, 3);

    setStartWord(game.startWord);
    setTargetWord(game.targetWord);
    setCurrentChain([game.startWord]);
    setGameWon(false);
    setInputWord("");
    setError("");
    gameWonHandlers.close();

    if (gameWon && user) {
      try {
        const response = await fetch(
          "http://localhost:3000/api/game-complete",
          {
            method: "POST",
            credentials: "include",
          }
        );
        if (response.ok) {
          const updatedStats = await response.json();
          setStats({
            gamesPlayed: updatedStats.games_played,
            currentStreak: updatedStats.current_streak,
            longestStreak: updatedStats.longest_streak,
          });
        }
      } catch (err) {
        console.error("Failed to update stats:", err);
      }
    }
  }

  // initialize game with random start and target words
  useEffect(() => {
    resetGame();
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
        gameWonHandlers.open();
      }
    }
  };

  const share = async (clipboard, start, end, length) => {
    const text = `${start} -> ${end}\n${length} moves`;

    if (navigator.canShare) {
      await navigator.share({
        text: text,
        url: "https://playmorphology.com",
      });
    } else {
      clipboard.copy(text);
    }
  };

  return (
    <>
      <Header
        user={user}
        stats={stats}
        statsHandlers={statsHandlers}
        helpHandlers={helpHandlers}
        settingsHandlers={settingsHandlers}
      />
      <div style={{ width: "100vw", height: "calc(100vh - 60px)" }}>
        <WordChain
          currentChain={currentChain}
          startWord={startWord}
          targetWord={targetWord}
        />

        {!gameWon ? (
          <GameInput
            handleSubmit={handleSubmit}
            inputWord={inputWord}
            setInputWord={setInputWord}
            currentChain={currentChain}
            setCurrentChain={setCurrentChain}
            WORD_LENGTH={WORD_LENGTH}
          />
        ) : (
          <GameWonInput
            handlers={gameWonHandlers}
            clipboard={clipboard}
            share={share}
            startWord={startWord}
            targetWord={targetWord}
            currentChain={currentChain}
            resetGame={resetGame}
          />
        )}

        {error && <ErrorAlert error={error} />}
        {gameWon && <GameWonAlert currentChain={currentChain} />}
      </div>
      <GameWonModal
        opened={gameWonOpened}
        handlers={gameWonHandlers}
        currentChain={currentChain}
        clipboard={clipboard}
        startWord={startWord}
        targetWord={targetWord}
        share={share}
        resetGame={resetGame}
      />
      <StatsModal opened={statsOpened} stats={stats} handlers={statsHandlers} />
      <HelpModal opened={helpOpened} handlers={helpHandlers} />
      {/*<SettingsModal opened={settingsOpened} handlers={settingsHandlers} /> */}
    </>
  );
}

export default App;
