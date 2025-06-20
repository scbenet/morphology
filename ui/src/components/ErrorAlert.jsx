import { Alert } from "@mantine/core";

export const ErrorAlert = ({ error }) => {
  return (
    <Alert
      style={{ width: "25rem", margin: "auto" }}
      variant='light'
      color='red'
      radius='xl'
      title={error}
    ></Alert>
  );
};
