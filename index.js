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

client.on("qr", async (qr) => {
  console.info("qr code launched");
  console.info({ info: client.info, state: await client.getState() });
  qrcode.generate(qr, { small: true });
});

client.on("change_state", async (state) => {
  console.info("change_state");
  console.info({ newState: state, info: client.info, state: await client.getState() });
});

client.on("authenticated", async (session) => {
  console.info("authenticated");
  console.info({ session, info: client.info, state: await client.getState() });
});

client.on("disconnected", async (reason) => {
  console.info("disconnected");
  console.info({ reason, info: client.info, state: await client.getState() });
});

client.on("remote_session_saved", async () => {
  console.info("remote_session_saved");
  console.info({ info: client.info, state: await client.getState() });
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
