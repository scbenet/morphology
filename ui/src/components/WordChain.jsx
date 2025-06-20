import {
  useMantineTheme,
  Center,
  Stack,
  Title,
  Text,
  Timeline,
} from "@mantine/core";

export const WordChain = ({ currentChain, startWord, targetWord }) => {
  const theme = useMantineTheme();

  return (
    <>
      <Center component='div' style={{ marginTop: "50px" }}>
        <Stack>
          <Title order={3}>Your Chain:</Title>
          <Timeline
            active={currentChain.length}
            radius='sm'
            bulletSize={20}
            color={theme.colors.indigo[6]}
          >
            {currentChain.map((word, index) => (
              <Timeline.Item key={index} className=''>
                <Text>{word}</Text>
              </Timeline.Item>
            ))}
          </Timeline>
        </Stack>
      </Center>
      <br />
      <Center className=''>
        <Stack>
          <Text>
            Start word:{" "}
            <span className=''>
              <b>{startWord}</b>
            </span>
          </Text>
          <Text>
            Target word:{" "}
            <span className=''>
              <b>{targetWord}</b>
            </span>
          </Text>
        </Stack>
      </Center>
    </>
  );
};
