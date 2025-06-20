import { Modal, Button } from "@mantine/core";

export const HelpModal = ({ opened, handlers }) => {
  return (
    <Modal
      className="help-modal"
      size="md"
      opened={opened}
      onClose={() => handlers.close()}
      centered
      transitionProps={{
        transition: "fade",
        duration: 150,
        timingFunction: "linear",
      }}
      style={{ maxWidth: "85%" }}
      withCloseButton={false}
    >
      <div style={{ textAlign: "center" }}>
        <h1>Welcome to Morphology!</h1>
      </div>
      <p>
        <b>How to play: </b>The goal of the game is to transform the starting
        word into the target word, changing only one letter at a time.
      </p>
      <p>
        <b>Tip: </b>A valid move must replace an existing letter of the current
        word with a new letter. You may not add additional letters or remove
        them.
      </p>
      <div style={{textAlign: 'center'}}>
        <Button onClick={() => handlers.close()}>Close</Button>
      </div>
    </Modal>
  );
};
