import 'dotenv/config';
import {Readable} from "stream"
import axios from 'axios';
import FormData from 'form-data';
import text2png from 'text2png';
import { verifyKey } from 'discord-interactions';

export async function KenningRequest(endpoint, options) {
  const url = 'https://hisyeo-kennings.glitch.me/' + endpoint;
  // if (options.data && !(options.data instanceof FormData)) options.data = JSON.stringify(options.data);
  try {
    const res = await axios({
      url,
      headers: {
        Authorization: `Bot ${process.env.KENNING_TOKEN}`,
        // do not set content-type because this seems to break the detection of it later in the fetch
        'User-Agent': 'DiscordBot (https://github.com/discord/discord-example-app, 1.0.0)',
      },
      formSerializer: { indexes: true },
      ...options
    });
    if (!res.statusText == 'OK') {
      console.log(res.status);
      throw new Error(JSON.stringify(res.data));
    }
    return res;
  } catch (error) {
    console.error(error.status ?? error, " - ", error.response?.data ?? error.response)
    for (let e of error.response?.data?.errors?.content?._errors) console.error(e)
  }
}

export function VerifyDiscordRequest(clientKey) {
  return function (req, res, buf, encoding) {
    const signature = req.get('X-Signature-Ed25519');
    const timestamp = req.get('X-Signature-Timestamp');

    const isValidRequest = verifyKey(buf, signature, timestamp, clientKey);
    if (!isValidRequest) {
      res.status(401).send('Bad request signature');
      throw new Error('Bad request signature');
    }
  };
}

export async function DiscordRequest(endpoint, options) {
  const url = 'https://discord.com/api/v10/' + endpoint;
  if (options.data && !(options.data instanceof FormData)) options.body = JSON.stringify(options.body);

  try {
    const res = await axios({
      url,
      headers: {
        Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
        // do not set content-type because this seems to break the detection of it later in the fetch
        'User-Agent': 'DiscordBot (https://github.com/discord/discord-example-app, 1.0.0)',
      },
      formSerializer: { indexes: true },
      ...options
    });
    if (!res.statusText == 'OK') {
      console.log(res.status);
      throw new Error(JSON.stringify(res.data));
    }
    return res;
  } catch (error) {
    console.error(error.status ?? error, " - ", JSON.stringify(error.response?.data) ?? error.response.errors)
    for (let e of error.response?.data?.errors?.content?._errors ?? []) console.error(e)
  }


}

export async function InstallGlobalCommands(appId, commands) {
  // API endpoint to overwrite global commands
  const endpoint = `applications/${appId}/commands`;

  try {
    // This is calling the bulk overwrite endpoint: https://discord.com/developers/docs/interactions/application-commands#bulk-overwrite-global-application-commands
    await DiscordRequest(endpoint, { method: 'PUT', data: commands });
  } catch (err) {
    console.error(err);
  }
}

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function translateLatinToAbugida(str) {
  const quotation = ['\u25D6', '\u25D7'];
  const diacritic = '\u0304';
  const lCons =  ' hkgtcsxdzbfmnwly', kCons = 'ɽɂɔꜿcꞇɐɋʌⱴʋɤƶƨʒʓɀ';
  const lVowels = 'ôuûiîeê', kVowels = 'ıʃʄȷɟɿʇ';
  const lDiacritics = 'ktlnsc', kDiacritics = '\u0306\u0311\u0301\u0304\u0303\u034a';
  let index = (loc, val) => loc.indexOf(val.toLowerCase())
  // Pre-process quotation marks, replacing with [ and ] as placeholder quotation marks
  return str
    .split('"').reduce((acc, v, i) => acc + (i % 2 ? '[' : ']') + v)
    // Pre-process proper nouns, adding { and } as placeholder transliteration marks
    .replace(/\b[A-ZÔÊÎÛ][A-ZÔÊÎÛa-zôêîûꞌ']*(?: [A-ZÔÊÎÛ][A-ZÔÊÎÛa-zôêîûꞌ']*)*/g, '{$&}')
    // Replace abugida characters
    .replace(
        /([hkgtcsxdzbfmnwly])?([oôuûiîeê])([ktlnsc](?![oôuûiîeê]))?|([hkgtcsxdzbfmnwly])(?![oôuûiîeê])/gi, // RegEx: cons?+vowel+n? | const
        (_, p1, p2, p3, p4) =>
            p4 // If no vowel found
                ? kCons[index(lCons, p4)] // Null consonant
                : kCons[(p1 ? index(lCons, p1) : 0)]  + // Leading consonant
                  (p3 ? kDiacritics[index(lDiacritics, p3)] : '') +
                  (kVowels[index(lVowels, p2)] || '')

    )
    // Replace punctuation
    .replace(/,/g, '､')
    .replace(/:/g, '–')
    .replace(/\./g, ':')
    .replace(/\[/g, quotation[0])
    .replace(/]/g, quotation[1])
    .replace(/\{/g, '‹')
    .replace(/\}/g, '›')
}

export function translateLatinToSyllabary(str) {
  const quotation = ['\u25D6', '\u25D7'],
        diacritic = '\u0304',
        lCons =  ' hkgtcsxdzbfmnwly', sCons = ' hkgtcsxdzbfmnwly',
        lVowels = 'ôuûiîeê', sVowels = 'orujiqe',
        lDiacritics = 'ktlnsc', sDiacritics = 'KTLNSC';
  let index = (loc, val) => loc.indexOf(val.toLowerCase())
  // Pre-process quotation marks, replacing with [ and ] as placeholder quotation marks
  try {
    return text2png(str
      .split('"').reduce((acc, v, i) => acc + (i % 2 ? '[' : ']') + v)
      // Pre-process proper nouns, adding { and } as placeholder transliteration marks
      .replace(/\b[A-ZÔÊÎÛ][A-ZÔÊÎÛa-zôêîûꞌ']*(?: [A-ZÔÊÎÛ][A-ZÔÊÎÛa-zôêîûꞌ']*)*/g, '{$&}')
      // Replace abugida characters
      .replace(
          /([hkgtcsxdzbfmnwly])o(?=[oôuûiîeê])|([hkgtcsxdzbfmnwly])?([oôuûiîeê])([ktlnsc](?![oôuûiîeê]))?|([hkgtcsxdzbfmnwly])(?![oôuûiîeê])/gi, // RegEx: cons?+vowel+n? | const
          (_, p0, p1, p2, p3, p4) => {
              // console.log(`p0: ${p0}\tp1: ${p1}\tp2: ${p2}\tp3: ${p3}\tp4: ${p4}`)
              return p0 ? sCons[index(lCons, p0)] + 'A' :             // default vowel saver
                p4 ? sCons[index(lCons, p4)] :                        // null onset
                  (sCons[(p1 ? index(lCons, p1) : -1)] ?? '') +       // onset
                  (sVowels[index(lVowels, p2)] ?? (!p1 ? 'a' : '')) + // vowel
                  (p3 ? sDiacritics[index(lDiacritics, p3)] : '')     // coda
          }

      )
      .replace(/\[/g, quotation[0])
      .replace(/]/g, quotation[1])
      .replace(/\{/g, '‹')
      .replace(/\}/g, '›'), {
      font: '30px Hisyakui Sans',
      textAlign: 'left',
      color: 'white',
      backgroundColor: 'transparent',
      lineSpacing: 0,
      strokeWidth: 0,
      strokeColor: 'white',
      padding: 0,
      borderWidth: 0,
      localFontPath: 'assets/HisyakuiSans.ttf',
      localFontName: 'Hisyakui Sans',
      output: 'buffer',
    })
  } catch (error) {
    console.error(error);
  }
}

const MAX_MESSAGE_SIZE = 2000;

export async function translateLatinToLinks(str, replace) {
  const hsyWords = await getWords()
  const Link = (word) => hsyWords[word] ? `[${word}](https://hisyeo.github.io/docs/words/${word[0]}/${word} '${hsyWords[word].meaning}')` : undefined
  const [_, firstPunct, rest] = str.match(/^([\s\-\.\,\'\":;!?~`@#\$%\^&\*\(\)\[\]\{\}\|\\<>\+=_]+)?(.*)/)
  const strWords = rest.split(/[\s\-\.\,\'\":;!?~`@#\$%\^&\*\(\)\[\]\{\}\|\\<>\+=_]+/)
  const strPunct = rest.split(/[^\s\-\.\,\'\":;!?~`@#\$%\^&\*\(\)\[\]\{\}\|\\<>\+=_]+/)
  const results = ['']
  let result = firstPunct ?? ''
  for (let i = 0; i < strWords.length; i++) {
    result = `${strPunct[i]}${Link(strWords[i]) ?? strWords[i]}` 
    if (results.at(-1).length + result.length > MAX_MESSAGE_SIZE) { results.push(result) }
    else { results[results.length - 1] = `${results.at(-1)}${result}` }
  }
  return results
}

export async function pickRandomWord() {
  const words = await getWords();
  const keys = Object.keys(words)
  return words[keys[Math.floor(Math.random() * keys.length)]];
}

export function numberWord(n) {
  switch (n) {
    case 0: return 'xûnyu';
    case 1: return 'kut';
    case 2: return 'dûî';
    case 3: return 'niswî';
    case 4: return 'nonkû';
    case 5: return 'tîû';
    case 6: return 'toü';
    case 7: return 'xêtî';
    case 8: return 'tukwos';
    case 9: return 'eson';
    case 10: return 'dus';
    default: throw new Error("not a number from 1 to 10");
  }
}

export async function identifyWinner(lastMessage, gameWord) {
  const endpoint = `channels/${lastMessage.channel_id}/messages?after=${lastMessage.id}`;
  let gameTime = 120000;
  return new Promise((resolve, reject) => {
    let interval = setInterval(async function () {
      if (gameTime <= 0) { resolve(); return; };
      const result = await (await DiscordRequest(endpoint, { method: 'GET' })).json();
      for (let message of result) {
        if (message.content.toLowerCase() == gameWord) {
          clearInterval(interval);
          resolve(message.author);
        }
      }
      gameTime = gameTime - 1000;
    }, 1000);    
  });
}

export function unicodeToChar(text) {
   return text.replace(/\\u[\dA-F]{4}/gi, (match) => String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16)));
}

export async function getWords() {
  try {
    const response = await axios(process.env.WORDS_JSON_URL);
    if (!response.statusText == 'OK') {
      throw new Error(`Response status: ${response.status}`);
    }
    return response.data;
  } catch (error) {
    console.error(error.message);
  }
}