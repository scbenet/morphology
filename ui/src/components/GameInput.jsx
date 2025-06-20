import {
  Container,
  TextInput,
  Button,
} from '@mantine/core'

export const GameInput = ({ 
  handleSubmit,
  inputWord,
  setInputWord,
  currentChain,
  setCurrentChain,
  WORD_LENGTH,
}) => {
  return (
    <Container
      style={{
        width: "75%",
        display: "flex",
        flexDirection: "column",
        margin: "auto",
      }}
    >
      <form onSubmit={handleSubmit} className=''>
        <TextInput
          style={{
            margin: "auto",
            marginTop: "1em",
            marginBottom: "1em",
            width: "15rem",
          }}
          type='text'
          value={inputWord}
          onChange={(e) => setInputWord(e.target.value)}
          maxLength={WORD_LENGTH}
          placeholder='Enter next word'
        />
        <Button
          color='indigo'
          size='md'
          type='submit'
          fullWidth
          style={{
            width: "15rem",
            margin: "auto",
            marginTop: "1em",
            marginBottom: "1em",
          }}
        >
          Submit
        </Button>
      </form>
      <Button
        size='md'
        color='indigo'
        style={{ width: "15rem", margin: "auto", marginBottom: "1em" }}
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
  );
};
