import { Modal, Button } from "@mantine/core";

export const StatsModal = ({ opened, stats, handlers }) => {
  return (
    <Modal
      className='stats-modal'
      size='md'
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
        <h1>User Statistics</h1>
        <p>Games Played: {stats.gamesPlayed}</p>
        <p>Current Daily Streak: {stats.currentStreak}</p>
        <p>Longest Daily Streak: {stats.longestStreak}</p>
        <p style={{ fontSize: ".9rem" }}>
          Come back and play tomorrow to keep your streak going!
        </p>
        <Button onClick={() => handlers.close()}>Close</Button>
      </div>
    </Modal>
  );
};
