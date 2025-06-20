import { Modal } from "@mantine/core";

export const SettingsModal = ({ opened, handlers }) => {
  return (
    <Modal
      className="settings-modal"
      size="md"
      opened={opened}
      onClose={() => handlers.close()}
      centered
      transitionProps={{
        transition: "fade",
        duration: 150,
        timingFunction: "linear",
      }}
    >
      <p>Settings</p>
    </Modal>
  );
};
