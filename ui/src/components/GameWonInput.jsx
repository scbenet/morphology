import {
  Container,
  Group,
  Button
} from '@mantine/core'

export const GameWonInput = ({ 
  handlers,
  clipboard,
  share,
  startWord,
  targetWord,
  currentChain,
  resetGame,
}) => {
  return (
    <Container
      style={{
        width: "75%",
        display: "flex",
        flexDirection: "column",
        margin: "auto",
        marginTop: "2em",
      }}
    >
      <Group justify='center'>
        <Button
          color={clipboard.copied ? "green" : ""}
          onClick={() =>
            share(clipboard, startWord, targetWord, currentChain.length - 1)
          }
        >
          {clipboard.copied ? "Copied" : "Share"}
        </Button>
        <Button
          onClick={() => {
            resetGame();
            handlers.close();
          }}
        >
          Play again
        </Button>
      </Group>
    </Container>
  );
};
