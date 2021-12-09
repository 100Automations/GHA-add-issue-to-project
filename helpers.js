// Imports
const fs = require('fs');
const repl = require('./repl')


function configTestBody(body, configs) {
    for (const config of configs) {
        if (repl.analyze(config.body, body)) {
            return config.column
        } else {
            return null
        }
    }
}

function parseConfig(path) {
    const file = fs.readFileSync(path, 'utf-8')
    return JSON.parse(file)
}


module.exports = { configTestBody, parseConfig }