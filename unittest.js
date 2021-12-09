const repl = require('./repl');
const helpers = require('./helpers');

function replTests() {
    testEqual(repl.analyze("'### Dependency'", "### Dependency /n - [ ] #34"), true)
    testEqual(repl.analyze("'### Dependency'", "## Dependency /n - [ ] #34"), false)
    testEqual(repl.analyze("'### Dependency'/'### Dependencies'", "### Dependency /n - [ ] #34"), true)
    testEqual(repl.analyze("'### Dependency'/'## Dependencies'", "### Dependencies /n - [ ] #34"), true)
}

function helpersTests() {
    testEqual(helpers.parseConfig("unittest.json").length, 2)
    testEqual(helpers.parseConfig("unittest.json")[0].name, 'Aveline-art')
    testEqual(helpers.parseConfig("unittest.json")[1].number === "1234", false)
}

function testEqual(result, expected) {
    if (result == expected) {
        console.log('Test Passed')
    } else {
        console.log(`Got ${result}, expected, ${expected}`)
    }

    return
}

replTests()
helpersTests()