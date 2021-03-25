const commander = require('commander')
const path = require('path')
const fs = require('fs')
const run = require('./index.js');

commander
    .version('0.1')

commander.on('--help', function() {
    console.log('');
    console.log('  Basic Examples:');
    console.log('    Start a job using a config :');
    console.log('    $ cnd start ./config.json');
    console.log('');
});

commander.command('start [configPath]')
    .action(function(config) {
        const data = JSON.parse(fs.readFileSync(path.resolve(config), { encoding: 'utf-8' }))
        run(data)
    })

commander.command('*')
  .action(function() {
    console.log('\nCommand not found');
  });

console.log(process.argv)

commander.parse(process.argv);
