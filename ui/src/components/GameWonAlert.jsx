import { Alert } from "@mantine/core";

export const GameWonAlert = ({ currentChain }) => {
  return (
    <Alert
      style={{
        width: "25rem",
        maxWidth: "85%",
        margin: "auto",
        marginTop: "1rem",
      }}
      variant='light'
      color='green'
      radius='xl'
    >
      Congratulations! You won in {currentChain.length - 1} moves!
    </Alert>
  );
};
