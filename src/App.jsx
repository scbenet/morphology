// App.jsx
import { useState, useEffect } from "react";

import {
  createTheme,
  MantineProvider,
  useMantineColorScheme,
  useComputedColorScheme,
  Button,
  TextInput,
  Modal,
  Group,
  Container,
  Center,
  Title,
  Timeline,
  Text,
  rem,
  Stack,
  Alert,
} from "@mantine/core";

import { useDisclosure, useClipboard } from "@mantine/hooks";

import { wordList } from "./words/wordList";
import {
  generateGameWordList,
  generateWordPair,
} from "./words/wordListGenerator";

import "@mantine/core/styles.css";

const theme = createTheme({
  headings: {
    fontWeight: "400",
    sizes: {
      h1: {
        fontWeight: "300",
        fontSize: rem(50),
      },
    },
  },
});

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
  const [startWord, setStartWord] = useState("");
  const [targetWord, setTargetWord] = useState("");
  const [currentChain, setCurrentChain] = useState([]);
  const [inputWord, setInputWord] = useState("");
  const [gameWon, setGameWon] = useState(false);
  const [error, setError] = useState("");
  const [opened, { open, close }] = useDisclosure(false);
  const clipboard = useClipboard({ timeout: 500 });
  //const theme = useMantineTheme();

  function resetGame() {
    const game = generateWordPair(words, graph, 4, 5);
    console.log(game);

    setStartWord(game.startWord);
    setTargetWord(game.targetWord);
    setCurrentChain([game.startWord]);
    setGameWon(false);
    setInputWord("");
    setError('');
    close()
  }

  // initialize game with random start and target words
  useEffect(() => {
    // wordList only has 5 letter words for now so don't need this
    // const fourLetterWords = wordList.filter(word => word.length === WORD_LENGTH);

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
        open();
      }
    }
  };

  const share = async (clipboard, start, end, length) => {
    const text = `${start} -> ${end}\n${length} moves`

    if (navigator.canShare) {
      await navigator.share({
        text: text,
        url: 'https://playmorphology.com'
      })
    }
    else {
      clipboard.copy(text)
    }
  }

  return (
    <MantineProvider defaultColorScheme='auto' theme={theme}>
      <div style={{ width: "100vw", height: "100vh" }}>
        <Container>
          <Title
            order={1}
            my="lg"
            align="center"
          >
            Morphology
          </Title>
        </Container>

        <Center component="container">
          <Stack>
            <Title order={3}>Your Chain:</Title>
            <Timeline 
              active={currentChain.length} 
              radius='sm' 
              bulletSize={20}
              color='indigo'
            >
              {currentChain.map((word, index) => (
                <Timeline.Item key={index} className="">
                  <Text>{word}</Text>
                </Timeline.Item>
              ))}
            </Timeline>
          </Stack>
        </Center>
        <br />
        <Center className="">
          <Stack>
            <Text>
              Start word:{" "}
              <span className="">
                <b>{startWord}</b>
              </span>
            </Text>
            <Text>
              Target word:{" "}
              <span className="">
                <b>{targetWord}</b>
              </span>
            </Text>
          </Stack>
        </Center>
        
        {!gameWon && (
          <Container style={{width: '75%', display: 'flex', flexDirection: 'column', margin: 'auto'}}>
            <form onSubmit={handleSubmit} className="">
              <TextInput
                style={{  margin: 'auto', marginTop: '1em', marginBottom: '1em', width: '15rem'}}
                type="text"
                value={inputWord}
                onChange={(e) => setInputWord(e.target.value)}
                maxLength={WORD_LENGTH}
                placeholder="Enter next word"
              />
              <Button color='indigo' size="md" type="submit" fullWidth style={{width: '15rem', margin: 'auto', marginTop: '1em', marginBottom: '1em'}}>
                Submit
              </Button>
            </form>
            <Button
              size="md"
              color='indigo'
              style={{width: '15rem', margin: 'auto', marginBottom: '1em'}}
              fullWidth
              onClick={() => {
                if (currentChain.length > 1) {
                  setCurrentChain(currentChain.slice(0, -1));
                }
              }}
            >
              Go back
            </Button>
          </Container>
        )}

        {error && <Alert
          style={{width: '25rem', margin: 'auto'}} 
          variant='light' 
          color='red' 
          radius='xl' 
          title={error}
        ></Alert>}

        {gameWon && (
          <Alert 
            style={{width: '25rem', maxWidth: '85%', margin: 'auto', marginTop: '1rem'}} 
            variant='light' 
            color='green' 
            radius='xl' 
          >
            Congratulations! You won in {currentChain.length - 1} moves!
          </Alert>
        )}
      </div>
      <Modal 
        size="auto" 
        opened={opened} 
        onClose={close} 
        centered
        title='You win!'
        transitionProps={{ transition: 'fade', duration: 600, timingFunction: 'linear'}}
        style={{maxWidth: '85%'}}
        >
        <p>And you did it in only {currentChain.length - 1} moves!</p>
        <p>Play again or challenge a friend</p>
        
        <Group>
          <Button
            color={clipboard.copied ? 'green' : ''}
            onClick={() => share(clipboard, startWord, targetWord, currentChain.length - 1)}
          >
            {clipboard.copied ? 'Copied' : 'Share'}
          </Button>
          <Button
            onClick={() => {
              resetGame();
              close();
            }}
          >
            Play again
          </Button>
        </Group>
      </Modal>
    </MantineProvider>
  );
}

export default App;
