import { loveMessages } from "./loveMessages.js";

const getMessage = () => {
  const randomIndex = Math.floor(loveMessages.length * Math.random());
  const randomMessage = loveMessages[randomIndex];
  return randomMessage;
};

const loveNotifier = async (WpClient) => {
  const message = getMessage();
  console.log("message", message);
  
  const response = await WpClient.sendMessage(`573136875700@c.us`, message);
  console.info(response);
};

export default loveNotifier;
