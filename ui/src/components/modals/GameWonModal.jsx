import { Modal, Group, Button } from "@mantine/core";

export const GameWonModal = ({ 
  opened, 
  handlers, 
  currentChain,
  clipboard,
  startWord,
  share,
  targetWord,
  resetGame,
}) => {
  return (
    <Modal
      className='game-won-modal'
      size='md'
      opened={opened}
      onClose={() => handlers.close()}
      centered
      transitionProps={{
        transition: "fade",
        duration: 600,
        timingFunction: "linear",
      }}
      style={{ maxWidth: "85%" }}
      withCloseButton={false}
    >
      <h2>You Win!</h2>
      <p>And you did it in only {currentChain.length - 1} moves!</p>
      <p>Play again or challenge a friend</p>

      <hr />
      <Group justify='center' style={{ marginTop: "1em" }}>
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
    </Modal>
  );
};
