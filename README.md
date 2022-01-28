# Miniature Octo Sniffle action

Often times, when an issue is created, it should move into the project board, where it can be organized. If an issue is not moved into the project board, or worse, moved into the wrong project board or wrong column, development and work on a project is stalled. By automatically placing newly created issues into an appropriate place, errors are lessened, and project workflow can be focused less on organizing the project, and more on delivering a product.

This workflow, when triggered, is designed to move issues to a specific column based on certain set of criteria such as a specific label, or specific phrase in the issue's body. This will prove helpful for members of a team who manages a project, such as project managers. By design, it abstracts a lot of the configuration into one file, making customization simple for team members who are not adept to coding syntax.

## Quickstart

### Automation triggers

Any [GHA trigger](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows) can technically trigger it, but most would result in an error. The triggers that work best are:


- issue comment created
- issue comment edited
- issue comment deleted
- issue opened
- issue edited
- issue deleted
- issue transferred
- issue pinned
- issue unpinned
- issue closed
- issue reopened
- issue assigned
- issue unassigned
- issue labeled
- issue unlabeled
- issue locked
- issue unlocked
- issue milestoned
- issue demilestoned

### Inputs

#### `config-file`

**Required** A path to a JSON file containing an Array of configurations. Example: '.github/workflows/folders/config.json'

#### `myToken`

**Required** A valid API token scoped to post comments on the repo.

#### `default-column`

**Optional** The column ID where every issue will go. Leave blank to have an issue not be moved if none of the configurations are met. Example: '123456'. To locate the ID for a specific column, refer to [this section](https://github.com/100Automations/GHA-add-issue-to-project/blob/master/README.md#how-do-i-find-a-column-id).

### Outputs

The GHA does not output any data. If it works as expected, it will simply return 0, otherwise it will return an error. A quick way to verify it would be to open a test issue.

## Example usage

```yml
- name: Checking out repo
  uses: actions/checkout@v2
- name: Move Issue
  id: api-json
  uses: 100Automations/miniature-octo-sniffle@master
  with:
    config-file: './.github/workflows/moveIssues/config.json'
    myToken: ${{ secrets.GITHUB_TOKEN }}
```

## Anatomy of the JSON configuration file

```JSON
[
  {
    "body": "'### Dependency'/'### Dependencies'",
    "labels": "'enhancement', !'documentation'",
    "column": 11223344
  },
  {
    "body": "'Research and Development'",
    "labels": "('Known Bug', dependency) or (enhancement and invalid)",
    "column": 55667788
  },
]
```
*<p style="text-align: center;">An example of a configuration JSON file with 2 configurations. The key-value pairs within each configuration represents a criteria that must be fulfilled before the issue can be moved to the specified column.</p>*

The key to using this GHA is through the configuration file, which is an `Array` of key-value `Objects`, which we will call *configuration*. Each *configuration* consists of a `column` key, and various other keys we will call *criteria*. These *criteria* are a set of conditions that must be fulfilled in order for the issue that triggered this GHA to move to the column specified by the `column` key. To understand more about how to understand each *criteria*, please read the [Criteria Wording](#criteria-wording) section.

Outlined here are the possible *criteria*.

| Criteria Keys    | Description |
| ---------------- | ----------- |
| body             | Criteria for the body of the issue |
| labels           | Criteria for the labels of the issue |


## Criteria Wording

*Criteria* are defined by string that contains a bit of logic. This *logic string*, if you will, uses `and`, `or`, and `not` key words to convey user intent. For example, the *criteria*, `body: "dependency or dependencies"`, means that the *criteria* is met if the issue contains the strings 'dependenecy' or 'dependencies' anywhere in its body. Likewise the *criteria*, `labels: "'enhancement' and not 'documentation'"`, means that the *criteria* is met if the issue contains an 'enhancement' label but not a 'documentation' label.

In addition to `and`, `or`, and `not`, the *logic string* interpreter will also accept `,`, `/`, and `!`, respectively, as shorthand. Also, for more complex criteria matching, the interpreter will accept `(), [] or {}` to control the order of interpretation.

When wording a *criteria*, it is very important to get the syntax correctly. Here are some tips to make sure that you are getting the exact wording you want.

- *Criterias* are case-sensitive. For instance, if it checks for 'dependency' in the body, only 'dependency' and not 'Dependency' in the body will pass the *criteria*
- Whitespaces is significant in separating syntax from strings. If a string you want to match contain spaces, such as 'Known Bug', it is recommended to wrap it in quotes within the *logic string*. For example, the *criteria* `body: "Known Bug and Dependency"` will cause an error, but `body: "'Known Bug' and 'Dependency'"` will not.
- *Configurations* are verified in order. This means that if an issue passes two configurations, the column this issue will ultimately go to is the one that comes first in the `config-file`.

## Why do we use a logic interpreter?

The interpreter is created as an easy and simple way for team members who have little to no coding knowledge to configure the GitHub Action to meet their project needs. In future iterations, the `config-file` will accept regex matching.


## How do I find a column ID?

The easiest way would be to check the column link. This link can be found under `Copy column link` by clicking the `...` button on a column.

<image src='./assets/column-link-example.png' width="600" height="400" />

This will give you a link like so:

`https://github.com/octocat/miniature-octo-sniffle/projects/1#column-11223344`

In this example, the digits after `column-` (11223344) is the column ID.
