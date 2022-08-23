const serverUrl =
  process.env.NODE_ENV === "production"
    ? "wss://viking-ball.herokuapp.com"
    : "ws://localhost:8000";

export const environment = {
  serverUrl,
};
