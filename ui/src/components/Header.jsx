import {
  useMantineTheme,
  Box,
  Title,
  Button,
  Group,
  ActionIcon,
} from '@mantine/core'

import StatsIcon from '../assets/chart-bar.svg?react';
import SettingsIcon from '../assets/settings.svg?react';
import HelpIcon from '../assets/help.svg?react';


export const Header = ({ 
  user,
  statsHandlers,
  helpHandlers,
  settingsHandlers,
}) => {
  const theme = useMantineTheme();
  return (
    <Box
      style={{
        height: "60px",
        padding: "0 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#3B5BDB",
        //borderBottom: "3px solidrgb(27, 27, 27)", // Subtle border
        boxShadow: "0 4px 2px -2px #3B5BDB",
      }}
    >
      <Title order={1} style={{ margin: 0, color: "white" }}>
        Morphology
      </Title>
      {user ? (
        <Group>
          <ActionIcon onClick={() => statsHandlers.open()}>
            <StatsIcon />
          </ActionIcon>
          <ActionIcon onClick={() => helpHandlers.open()}>
            <HelpIcon />
          </ActionIcon>
          <ActionIcon onClick={() => settingsHandlers.open()}>
            <SettingsIcon />
          </ActionIcon>
          <Button
            color={theme.colors.indigo[[5]]}
            size="sm"
            onClick={() => (window.location.href = "http://localhost:3000/logout")}
          >
            Logout
          </Button>
        </Group>
      ) : (
        <Button
          color={theme.colors.indigo[5]}
          size="sm"
          onClick={() => (window.location.href = "http://localhost:3000/auth/google")}
        >
          Login
        </Button>
      )}
    </Box>
  );
};
