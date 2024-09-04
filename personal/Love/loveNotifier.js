import { loveMessages } from "./loveMessages.js";

const getMessage = () => {
  const randomIndex = Math.floor(loveMessages.length * Math.random());
  const randomMessage = loveMessages[randomIndex];
  return randomMessage;
};

const loveNotifier = (WpClient) => {
  const message = getMessage();
  WpClient.sendMessage(`573136875700@c.us`, message);
};

export default loveNotifier;
