import 'dotenv/config';

import { capitalize, InstallGlobalCommands } from './utils.js';

const DONUXIN_COMMAND = {
  name: 'dônûxin',
  description: 'Translate from the Latin script to the Abugida',
  options: [
    {
      type: 3, // string
      name: 'obûgîdo',
      description: 'kûu cukto tô tolîko Letin bînê mônîso tô tolîko Obûgîdo',
    },
    {
      type: 3, // string
      name: 'ûlonfû',
      description: 'kûu cukto tô tolîko Letin bînê mônîso tô tolîko Hîsyokûî',
    },
    {
      type: 3,
      name: 'ûnîdû',
      description: 'kûu cukto tô tolîko Letin bînê mônîso tô tolîko Hîsyokûî',
    }
  ],
  type: 1,
};

const KOS_COMMAND = {
  name: 'kôs',
  description: 'Create and review new kennings',
  options: [
    {
      type: 1,
      name: 'sîntokmo',
      description: 'kûu cukto sîntokmo yê hîskûnco Hîsyêô et xe betîdo lolû yodo sîntokmo tô hîskûnco Ingulic',
      options: [
        {
          type: 3, // string
          name: 'omûlto',
          description: 'kûu gôcîdon somo omûlto'
        },
        {
          type: 3, // string
          name: 'cukto',
          description: 'kûu cukto sîntokmo nêôs'
        },
      ],
    },
    {
      type: 1,
      name: 'fuhoso',
      description: 'kûu fuhoso sîntokmo nêôs oxon dûndon',
      options: [
        {
          type: 3, // string
          name: 'omûlto',
          description: 'kûu gôcîdon somo omûlto'
        },
        {
          type: 3, // string
          name: 'cukto',
          description: 'kûu cukto sîntokmo nêôs'
        },
      ],
    },
  ],
  type: 1,
}

const LIKIWIKI_COMMAND = {
  name: 'lîkîwîkî',
  description: 'umo kut onô xe cukto lolû mût tolîko kon cukto Letin, li bîlûs',
  options: [
    // {
    //   type: 4, // integer
    //   name: 'soto_kela',
    //   description: 'tu le ju te cakuwa in ikama ili non ikama',
    //   choices: [
    //     { name: 'wan ikama', value: 0 },
    //     { name: 'non ikama', value: 1 },
    //   ],
    // },
    {
      type: 4, // integer
      name: 'wokût',
      description: 'kûu gôcîdon mîto onô yê wokût et fos noyo ke motsi ilik xe hobîyô',
      min_value: 1,
      max_value: 10,
    }
  ],
  type: 1,
};

const HUSKU_COMMAND = {
  name: 'hûsku',
  description: 'umo kut onô xe cukto lolû onô dûndon oxon betîdo yê hîskûnco Ingulic, li bîlûs',
  options: [
    {
      type: 4, // integer
      name: 'wokût',
      description: 'kûu gôcîdon mîto onô yê wokût et fos noyo ke motsi ilik xe hobîyô',
      min_value: 1,
      max_value: 10,
    }
  ],
  type: 1,
};

const YOSTEN_COMMAND = {
  name: 'yosten',
  description: 'You can use this command to find information on Hîsyêô words or phrases',
  options: [
    {
      type: 3, // string
      name: 'hîsyêô',
      description: 'Enter the Hîsyêô word you would like to find information on',
    },
    {
      type: 3, // string
      name: 'ingulic',
      description: 'Enter the English word you would like to find Hîsyêô translations of',
    }
  ],
  type: 1,
}

const ALL_COMMANDS = [DONUXIN_COMMAND, KOS_COMMAND, LIKIWIKI_COMMAND, HUSKU_COMMAND, YOSTEN_COMMAND];

InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);