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

    
    var data = {
        body: "### Dependency /n - [ ] #34",
        labels: ['Good first issue', 'dependency']
    }

    var configs = [
        {
            body: "'### Dependency'/'### Dependencies'",
            labels: 'dependency and not documentation',
            column: 12345
        }
    ]
    testEqual(helpers.configTestAll(data, configs), 12345)

    data = {
        body: "",
        labels: []
    }

    configs = [
        {
            body: "'### Dependency'/'### Dependencies'",
            labels: 'dependency and not documentation',
            column: 12345
        }
    ]
    testEqual(helpers.configTestAll(data, configs), null)

    data = {
        body: "### Dependency",
        labels: []
    }

    configs = [
        {
            body: "'### Dependency'/'### Dependencies'",
            labels: 'dependency and not documentation',
            column: 12345
        }
    ]
    testEqual(helpers.configTestAll(data, configs), null)

    data = {
        body: "randomwords",
        labels: ['dependency']
    }

    configs = [
        {
            body: "'### Dependency'/'### Dependencies'",
            labels: 'dependency and not documentation',
            column: 12345
        }
    ]
    testEqual(helpers.configTestAll(data, configs), null)
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