import qrcode from "qrcode-terminal";
import ww from "whatsapp-web.js";

import birthdayNotifier from "./churchManager/BirthdayNotification/birthdayNotifier.js";
import loveNotifier from "./personal/Love/loveNotifier.js";

const job = process.argv[2];
console.log({ job });

const { Client, LocalAuth } = ww;

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    args: ["--no-sandbox"],
  },
});

client.on("auth_failure", console.error);

client.on("qr", (qr) => {
  console.info("qr code launched");
  console.info({ info: Client.info, state: Client.getState });
  qrcode.generate(qr, { small: true });
});

client.on("change_state", (state) => {
  console.info("change_state");
  console.info({ newState: state, info: Client.info, state: Client.getState });
});

client.on("authenticated", (session) => {
  console.info("authenticated");
  console.info({ session, info: Client.info, state: Client.getState });
});

client.on("disconnected", (reason) => {
  console.info("disconnected");
  console.info({ reason, info: Client.info, state: Client.getState });
});

client.on("remote_session_saved", () => {
  console.info("remote_session_saved");
  console.info({ info: Client.info, state: Client.getState });
});

client.on("ready", async () => {
  console.info("Client is ready!");

  switch (job) {
    case "all":
      birthdayNotifier(client);
      loveNotifier(client);
      break;

    case "cm:birthdays":
      birthdayNotifier(client);
      break;

    case "personal:love":
      loveNotifier(client);
      break;

    default:
      break;
  }

  const fiveMinutesInMills = 60 * 5 * 1000;
  setTimeout(() => process.exit(0), fiveMinutesInMills);
});

client.initialize();
