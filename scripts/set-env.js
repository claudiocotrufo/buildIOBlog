const fs = require('fs');
const path = require('path');

const envFile = path.resolve(__dirname, '..', '.env');
const envVars = {};

if (fs.existsSync(envFile)) {
  fs.readFileSync(envFile, 'utf8')
    .split('\n')
    .filter(line => line && !line.startsWith('#'))
    .forEach(line => {
      const [key, ...val] = line.split('=');
      if (key) envVars[key.trim()] = val.join('=').trim();
    });
}

const builderKey = envVars['BUILDER_API_KEY'] ?? '';

const output = `export const environment = {
  builderApiKey: '${builderKey}'
};
`;

const dest = path.resolve(__dirname, '..', 'src', 'environments', 'environment.ts');
fs.writeFileSync(dest, output);
console.log('environment.ts generato', builderKey ? '(key trovata)' : '(key mancante — aggiungi BUILDER_API_KEY a .env)');
