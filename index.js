require("dotenv").config();

const axios = require("axios");
const { App } = require("@slack/bolt");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true
});

app.command("/summertime-ping", async ({ command, ack, respond }) => {
  const start = Date.now();
  await ack();
  const latency = Date.now() - start;
  await respond({ text: `Pong!\nLatency: ${latency}ms` });
});

(async () => {
  await app.start();
  console.log("bot is running!");
})();

app.command("/summertime-help", async ({ ack, respond }) => {
  await ack();
  await respond({
    text:
`Available Commands:
/summertime-ping - Check bot latency
/summertime-catfact - Get a cat fact
/summertime-joke - Get a joke
/summertime-magic - Get a list of Harry Potter spells and uses`
  });
});

app.command("/summertime-catfact", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://catfact.ninja/fact");
    await respond({ text: `Cat Fact:\n${response.data.fact}` });
  } catch (err) {
    await respond({ text: "Failed to fetch a cat fact." });
  }
});

app.command("/summertime-joke", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://official-joke-api.appspot.com/random_joke");
    await respond({
      text:
    `${response.data.setup}

    ${response.data.punchline}`
        });
  } catch (err) {
    await respond({ text: "Failed to fetch a joke." });
  }
});

app.command("/summertime-magic", async ({ ack, respond}) => {
    await ack();

    try {
        const res = await axios.get('https://potterapi-fedeperin.vercel.app/en/spells')
        const spells = res.data

        await respond({
          text: spells.map(s => `${s.spell}: ${s.use}\n` ).join('')
        });
    } catch (err) {
      await respond({ text: `Failed to fetch spells. Error: ${err.message}` });
    }
})