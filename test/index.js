const run = require('../src/index.js');
const config = require('../config.json');

if (Array.isArray(config)) {
    config.reduce(function(promise, item) {
      return promise.then(function() {
          return run(item)
      }).catch(function() {
          return run(item)
      })
    }, Promise.resolve()).then(function() {
      console.log('finish queue')
      process.exit(0)
    }).catch(function(err) {
        console.log('err:', err)
    })
  } else {
    run(config).then(function() {
      process.exit(0)
    })
  }