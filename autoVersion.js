const { execSync } = require('child_process');

execSync('npm version patch');
execSync('git pull');
execSync('git push');

const { version } = require('./package.json');

execSync('git config --global user.email "yanhoup@4px.com"');
execSync('git config --global user.name "yanhoup"');

execSync(`git tag ${version}`);
execSync(`git push origin ${version}`);
