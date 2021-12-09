// Imports
const core = require('@actions/core');
const github = require('@actions/github');
const helpers = require('./helpers');

// Globals
const inputs = {
    // Required
    configFile: helpers.parseConfig(core.getInput('config-file')), // a json configuration
    defaultColumn: core.getInput('default-column'), // a string of a default column id
    myToken: core.getInput('myToken'), // a string containing the token, used only to verify octokit
}

console.log(inputs)

const octokit = github.getOctokit(inputs.myToken)
const payload = github.context.payload
const owner = payload.repository.owner.login
const repo = payload.repository.name

// main call
function main() {
    const issueId = payload.issue.number
    const body = payload.issue.body
    const result = helpers.configTestBody(body, inputs.configFile)

    if (result) {
        createCard(issueId, result)
    } else {
        if (inputs.defaultColumn) {
            createCard(issueId)
        }
    }
}


/////////////////
/// API Calls ///
/////////////////

// Create a project card
function createCard(issueId, columnId = inputs.defaultColumn) {
    try {
        octokit.rest.projects.createCard({
            column_id: columnId,
            content_id: issueId,
            content_type: 'Issue',
        });
    } catch (error) {
        core.setFailed(error.message);
        core.setFailed(`Could not move issue #${issueId} to ${columnId}`)
    }
}

main()