export const getAppBaseUrl = () => {
  if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  } else return "https://chat-vibe-two.vercel.app";
};
