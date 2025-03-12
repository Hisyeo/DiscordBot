import "dotenv/config";
import express from "express";
import {
  InteractionType,
  InteractionResponseType,
  InteractionResponseFlags,
  MessageComponentTypes,
  ButtonStyleTypes,
  
} from "discord-interactions";
import {
  requestLogger
} from './middleware.js';
import {
  abugid,
  ulNfu,
  unidu,
  jNgrljC,
  siNtKm,
  frhs,
} from './commands.js';
import {
  identifyWinner,
  unicodeToChar,
  numberWord,
  getWords,
  pickRandomWord,
  VerifyDiscordRequest,
  DiscordRequest,
} from "./utils.js";

const likiwikiBtnPrefix = 'likiwiki_game_word_';

const app = express();

const PORT = process.env.PORT || 3000;

app.use(
  requestLogger({ logger: console.log }),
  express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) })
);

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 */
app.post("/interactions", async function (req, res) {
  
  // Interaction type and data
  const { type, id, token, data } = req.body;
  // console.log(req.body);

  /**
   * Handle verification requests
   */
  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
    
  }
  
  /**
   * Handle button interaction requests
   */
  if (type === InteractionType.MESSAGE_COMPONENT) {
    const componentId = data.custom_id;
    
    if (componentId.startsWith(likiwikiBtnPrefix)) {
      // const gameId = componentId.replace(likiwikiBtnPrefix, '')
      return res.send({ type: InteractionResponseType.DEFERRED_UPDATE_MESSAGE });
    }
  }

  
  /**
   * Handle slash command requests
   * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
   */
  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name, options } = data;

    if (name === "dônûxin") {
      switch(options[0].name) {
        case 'obûgîdo': return abugid(res, options[0].value)
        case 'ûlonfû': return await ulNfu(id, token, res, options[0].value)
        case 'ûnîdû': return unidu(id, token, res, options[0].value)
      } 
    } // end if (name === "dônûxin")
    
    if (name === 'kôs') {
      const { name: subcommand, options: suboptions } = options[0];
      switch(subcommand) {
        case 'sîntokmo':
          const { value: concept } = suboptions[suboptions.map(o => o.name).indexOf('omûlto')],
                { value: text    } = suboptions[suboptions.map(o => o.name).indexOf('cukto') ],
                username           = req.body.member.user.id;
          return siNtKm(id, token, res, username, concept, text)
        case 'fuhoso': return frhs(id, token, res, options[0].value)
      }
    } // end if (name === "kôs")
    
    if (name === "yosten") {
      
      if (options[0].name == 'ingulic') {
        
        return jNgrljC(id, token, res, options[0].value)
        
      } else if (options[0].name == 'hîsyêô') {

        const value = options[0].value;
        const word = (await getWords())[value]

        if (word) {
          return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              embeds: [
                {
                  type: "link",
                  author: {name: `Type: ${word.type}`, url: `https://hisyeo.github.io/docs/tags/${word.type}`},
                  title: `${value}\u2003${word.actual_ipa}`,
                  description: `${word.meaning}`,
                  url: `https://hisyeo.github.io/docs/words/${value[0]}/${value}`,
                  fields: [
                    {name: 'Verb',     value: word.verb,     inline: true },
                    {name: 'Noun',     value: word.noun,     inline: true }, 
                    {name: 'Modifier', value: word.modifier, inline: true },
                    // {name: '\u200b',   value: '\u200b',      inline: false},
                    {name: 'Origin', value: `${word.origin}\u2003${word.origin_ipa}`, inline: true },
                  ],
                  footer: {
                    text: `${word.family} Language Family`
                  },
                },
              ],

              /*
                content: `*${value}* ${unicodeToChar(data.abugida)} (${data.type})\n**Meaning:** ${data.meaning}\n> **Noun:** ${data.noun ?? ''}\n> **Verb:** ${data.verb ?? ''}\n> **Modifier:** ${data.modifier ?? ''}`,
                components: [
                   {
                     type: 1,
                     components: [
                       {
                         type: 2,
                         label: "More Info",
                         style: 5,
                         url: `https://hisyeo.github.io/docs/words/${value[0]}/${value}`
                       }
                     ]
                   }
                 ]
              */
            },
          });
        } else {
          return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: `Hîsyêô yûnyoû yôk lolû onô "${value}"`,
            },
          });
        }
      } else { // not 'ıngulıc' or 'hisyëö'
        
          return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: `ulyô li yôk gôcîdon în wofok`,
            },
          });
        
      }
      
    } // end if (name === "yosten")
    
    if (name === "lîkîwîkî" && id) {
      
      const userId = req.body.member.user.id,
            gameWord = (await pickRandomWord()).word;
      let waitTime = req.body.data.options
        ? req.body.data.options[0]?.value ?? 3
        : 3;
      const endpoint = `webhooks/${process.env.APP_ID}/${req.body.token}`;
      const rules = `<@${userId}> socok kelo. umo kut xe hêfîn tô tolîko kon cukto Obûgîdo cukto tô toîko kon cûkto Letin, li bîlûs.`;
      let reply = res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: rules,
          }
      });
      let countdown = '';
      const interval = setInterval(async () => {
        if (waitTime > 0) {
          countdown = `${countdown}${numberWord(waitTime--)}...`
          DiscordRequest(`${endpoint}/messages/@original`, {
            method: 'PATCH',
            data: { content: `${rules}\n\n${countdown}`, }
          });
        } else {
          clearInterval(interval);
          let gameMessageResponse = await DiscordRequest(`${endpoint}/messages/@original`, {
            method: 'PATCH',
            data: {
              content: `${rules}`,
              components: [
                {
                  type: 1,
                  components: [
                    {
                      type: MessageComponentTypes.BUTTON,
                      label: unicodeToChar((await import("ikama").then(({word}) => word(gameWord))).likanu),
                      style: ButtonStyleTypes.PRIMARY,
                      custom_id: `${likiwikiBtnPrefix}${id}`,
                    }
                  ]
                }
              ]
            },
            wait: true,
          });
          let gameMessageJSON = await gameMessageResponse.json();
          let winner = await identifyWinner(gameMessageJSON, gameWord);
          if (winner) {
            DiscordRequest(endpoint, {
              method: 'POST',
              data: { content: `<@${winner.id}> li bîlûs.`, },
            });
          } else {
            DiscordRequest(endpoint, {
              method: 'POST',
              data: { content: `xûnyu umo li bîlûs. lolû li "${gameWord}".`, },
            });
          }

        }
      }, 1000);
      
    } // end if (name === "likiwiki" && id)
    
    if (name === "hûsku" && id) {
      console.log('playing husku...');
      const userId = req.body.member.user.id,
            gameWord = await pickRandomWord();
      let waitTime = req.body.data.options
        ? req.body.data.options[0]?.value ?? 3
        : 3;
      const endpoint = `webhooks/${process.env.APP_ID}/${req.body.token}`;
      const rules = `<@${userId}> socok kelo. umo kut onô xe cukto lolû dûndon, li bîlûs.`;
      let reply = res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: rules,
          }
      });
      let countdown = '';
      const interval = setInterval(async () => {
        if (waitTime > 0) {
          countdown = `${countdown}${numberWord(waitTime--)}...`
          DiscordRequest(`${endpoint}/messages/@original`, {
            method: 'PATCH',
            data: { content: `${rules}\n\n${countdown}`, }
          });
        } else {
          clearInterval(interval);
          let gameMessageResponse = await DiscordRequest(`${endpoint}/messages/@original`, {
            method: 'PATCH',
            data: {
              content: `${rules}`,
              components: [
                {
                  type: 1,
                  components: [
                    {
                      type: MessageComponentTypes.BUTTON,
                      label: gameWord.latin,
                      style: ButtonStyleTypes.PRIMARY,
                      custom_id: `${likiwikiBtnPrefix}${id}`,
                    }
                  ]
                }
              ]
            },
            wait: true,
          });
          let gameMessageJSON = await gameMessageResponse.json();
          let winner = await identifyWinner(gameMessageJSON, gameWord);
          if (winner) {
            DiscordRequest(endpoint, {
              method: 'POST',
              data: { content: `<@${winner.id}> li bîlûs!`, },
            });
          } else {
            DiscordRequest(endpoint, {
              method: 'POST',
              data: { content: `xûnyu umo li bîlûs. lolû li "${gameWord}".`, },
            });
          }

        }
      }, 1000);
      
    } // end if (name === "hüsku" && id) 
    
  } // end if (type === InteractionType.APPLICATION_COMMAND)
  
});

app.listen(PORT, () => {
  console.log("Listening on port", PORT);
});
