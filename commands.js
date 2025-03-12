import axios from 'axios';
import { FormData } from 'formdata-polyfill/esm.min.js'
import { Blob } from 'fetch-blob'
import { InteractionResponseType } from 'discord-interactions';
import {
  translateLatinToAbugida,
  translateLatinToSyllabary,
  translateLatinToLinks,
  DiscordRequest,
  KenningRequest,
} from './utils.js';

const FILENAME = 'syllabary.png';
const NO_EMBED_FLAG = 1 << 2;
const EPHEMERAL_FLAG = 1 << 6;

export const abugid = (response, value) => response.send({
  type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
  data: { content: translateLatinToAbugida(value) },
});

const postCreateDeferredResponse = async (id, token) => await DiscordRequest(
  `/interactions/${id}/${token}/callback?with_response=true`, {
  method: 'POST',
  data: { type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE }
});

const postFollowupSyllabaryResponse = async (token, value) => {
  const imageBuffer = translateLatinToSyllabary(value),
        form = new FormData();
  const imageBlob = new Blob([imageBuffer], { type: 'image/png' });
  form.append("files[0]", imageBlob, FILENAME);
  form.append("payload_json", JSON.stringify({
      content: value,
      embeds: [
        { image: { url: `attachment://${FILENAME}` } }
      ],
      attachments: [{ id: 0, name: FILENAME }]  
  }))
  return await DiscordRequest(
    `/webhooks/${process.env.APP_ID}/${token}`, {
      method: 'POST',
      data: form
  });
}

const postFollowupNotFoundResponse = async (token, value) => await DiscordRequest(
  `/webhooks/${process.env.APP_ID}/${token}`,
  { method: 'POST', data:
    { type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      content: `*Unable to find any kennings for '${value}'. Please consider adding one!*`,
      flags: EPHEMERAL_FLAG, } }
);

const getKenningAuthorReponse = async (id) => {
  const data = (await DiscordRequest(`/users/${id}`, { method: 'GET' })).data;
  return {
    name:     data.username, // {string} name of author
    url:	    `https://discordapp.com/users/${data.id}`, // {[string]}	url of author (only supports http(s))
    icon_url: `https://cdn.discordapp.com/${data.avatar}`, //	{[string]}	url of author icon (only supports http(s) and attachments)
  }
}

const postFollowupKenningResponse = async (token, concept, kennings) => {
  const data = {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    content: `# ${concept}\n*${kennings[0].definition}*`,
    embeds: kennings.filter(k => k.createdOn).length > 0
      ? await Promise.all(kennings.map(async k => ({
        type: 'rich',
        title: `Kenning #${k.id}`,
        description: k.latin,
        fields: k.votes?.map(v => ({ inline: true, name: v.emoji, value: v.total })),
        author: {...(await getKenningAuthorReponse(k.createdBy))},
      })))
      : [{ description: 'No kennings found for this concept' }],
    flags: EPHEMERAL_FLAG, }
  console.log(data);
  return await DiscordRequest(`/webhooks/${process.env.APP_ID}/${token}`, { method: 'POST', data });
}

const concatKenningWord = (accum, newWord) => {
  if (Object.keys(accum).length == 0) {
    delete newWord.kind
    return newWord
  } else {
    switch (newWord.kind) {
    case 'quot':
        if (accum.quote) {
          delete accum.quote
          accum.abugida   += newWord.abugida
          accum.latin     += newWord.latin
          accum.syllabary += newWord.syllabary
        } else {
          accum.quote = true
          accum.abugida   += ' ' + newWord.abugida
          accum.latin     += ' ' + newWord.latin
          accum.syllabary += ' ' + newWord.syllabary
        }
    case 'punct':
      accum.abugida   += newWord.abugida
      accum.latin     += newWord.latin
      accum.syllabary += newWord.syllabary
    default:
      accum.abugida   += ' ' + newWord.abugida
      accum.latin     += ' ' + newWord.latin
      accum.syllabary += ' ' + newWord.syllabary
    }
    return accum 
  }
}

export const jNgrljC = async (id, token, response, value) => {
  await postCreateDeferredResponse(id, token)
  
  const concepts = (await KenningRequest(
    `/search?raw=true&value=${value}`,
    { method: 'GET' }
  )).data.concepts
  console.log(concepts);
  if (Object.keys(concepts).length == 0) {
    await postFollowupNotFoundResponse(token, value)
  } else {
    for (let concept in concepts) {
      concepts[concept] = concepts[concept].map(kws =>
        kws[0].createdOn
        ? kws.reduce((acc, kw) => concatKenningWord(acc, kw), {})
        : kws[0])
      console.log(concepts[concept]);
      await postFollowupKenningResponse(token, concept, concepts[concept])
    }
  }
  
  return response.sendStatus(202);
}

export const siNtKm = async (id, token, response, username, concept, hisyeo) => {
  await postCreateDeferredResponse(id, token);
  
  const result = (await KenningRequest(
    `/add?raw=true`,
    { method: 'POST', data: { createdBy: username, concept, hisyeo } }
  )).data
  
  console.log(result);
  
  // if (!kennings.length) {
  //   await postFollowupNotFoundResponse(token, value)
  // } else {
  //   for (let concept in kennings) {
  //     kennings[concept] = kennings[concept].map(k =>
  //       k.reduce((acc, val) => concatKenningWord(acc, val), {}))
  //     await postFollowupKenningResponse(token, concept, kennings[concept])
  //   }
  // }
  
  return response.sendStatus(202);
}

export const frhs = async (id, token, response, value) => {
  await postCreateDeferredResponse(id, token)
  
  const result = (await KenningRequest(
    `/review?raw=true&kenning=${value}`,
    { method: 'POST', data: {
      
    } }
  )).data
  
  console.log(result);
  
  // if (!kennings.length) {
  //   await postFollowupNotFoundResponse(token, value)
  // } else {
  //   for (let concept in kennings) {
  //     kennings[concept] = kennings[concept].map(k =>
  //       k.reduce((acc, val) => concatKenningWord(acc, val), {}))
  //     await postFollowupKenningResponse(token, concept, kennings[concept])
  //   }
  // }
  
  return response.sendStatus(202);
}

export const ulNfu = async (id, token, response, value) => {
  
  await postCreateDeferredResponse(id, token)
  
  await postFollowupSyllabaryResponse(token, value)
  
  return response.sendStatus(202);
}

const postCreateLinkedResponse = async (id, token) => await DiscordRequest(
  `/interactions/${id}/${token}/callback?with_response=true`,
  { method: 'POST', data: { type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE } }
);

const postFollowupLinkedResponse = async (token, value) => await DiscordRequest(
  `/webhooks/${process.env.APP_ID}/${token}`,
  { method: 'POST', data:
    { type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      content: value,
      flags: NO_EMBED_FLAG, }
  }
);

export const unidu = async (id, token, response, value) => {

  await postCreateLinkedResponse(id, token)
  
  const linkedTexts = await translateLatinToLinks(value)
  
  if (linkedTexts.length > 5) {
    console.error('Received too many messages, only able to deliver five followups')
  } 
  for (let text of linkedTexts.slice(0,5)) await postFollowupLinkedResponse(token, text);
  
  return response.sendStatus(202);
}