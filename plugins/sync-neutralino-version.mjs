import fs from 'fs';
import packages from '../package.json' with { type: 'json' };
import neutralinoConfigs from '../neutralino.config.json' with { type: 'json' };

neutralinoConfigs.version = packages.version;

fs.writeFileSync(
  '../neutralino.config.json',
  JSON.stringify(neutralinoConfigs, '', 2),
  'utf8',
);
