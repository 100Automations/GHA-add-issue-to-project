# Miniature Octo Sniffle action

This action moves issues to a specific column based on set criteria.

## Quickstart

### Inputs

#### `config-file`

**Required** A path to a JSON file containing an Array of configurations. Example: '.github/workflows/folders/config.json'

#### `myToken`

**Required** A valid API token scoped to post comments on the repo.

#### `default-column`

**Optional** The column ID where every issue will go. Leave blank to have an issue not be moved if none of the configurations are met. Example: '123456'

## Example usage

```yml
- name: Checking out repo
  uses: actions/checkout@v2
- name: Move Issue
  id: api-json
  uses: Aveline-art/miniature-octo-sniffle@master

  with:
    config-file: './.github/workflows/moveIssues/config.json'
    myToken: ${{ secrets.GITHUB_TOKEN }}
```

## Configuration JSON file format

The configuration file which is fed into `config-file` must be in the format of an Array of key-value Objects. For the GitHub Action to function, the only key the Object truly needs is a `column` key, representing the column to move an issue to. The other keys, we will call criteria keys, since they represent certain criteria that must be met by an issue for it to be moved to the specified `column`.

Outlined here are the possible criteria keys at this time. Further below are tips of wording each criteria to best fit your needs.

| Criteria Keys    | Description |
| ---------------- | ----------- |
| body             | Criteria for the body of the issue |
| labels           | Criteria for the labels of the issue |


### Criteria Wording

Criteria are analyzed through a custom logic interpreter, which uses `and`, `or` and `not` as part of its key syntax. To demonstrate through an example, the criteria `body: "dependency or dependencies"` means that the body of the issue being analyzed needs to contain the string `dependency` **or** `dependencies` in other to pass the criteria. If the other criteria are also met, then issue will be moved to the column specified in the `column` key.

Do note that the criteria are not case-sensitive. For the above criteria, an issue's body containing "dependency" or "Dependency" would both pass the criteria.

In addition to `and`, `or`, and `not`, the interpreter will also accept `,`, `/`, and `!` respectively in its place. For more complex criteria matching, one can also used `(), [] or {}` to block off code. An example of a complex query could be:

`"('buggy code', dependency) or (enhancement and invalid)"`

For the interpreter, since it uses white space to recognize key syntax, it is also recommended to use quotation marks to differentiate between strings. In the above, 'buggy code' is wrapped with quotation marks for the interpreter to understand it as one single phrase, rather than two separate ones. Without the quotations, there would be an error.

## Sample configuration JSON

```JSON
[
  {
    "body": "'### Dependency'/'### Dependencies'",
    "labels": "'enhancement', !'documentation'",
    "column": 11223344
  },
  {
    "body": "'Research and Development'",
    "labels": "('buggy code', dependency) or (enhancement and invalid)",
    "column": 55667788
  },
]
```

## How do I find a column ID?

The easiest way would be to check the column link. This link can be found under `Copy column link` by clicking the `...` button on a column.

<image src='./assets/column-link-example.png' width="600" height="400" />

This will give you a link like so:

`https://github.com/octocat/miniature-octo-sniffle/projects/1#column-11223344`

In this example, the digits after `column-` (11223344) is the column ID.
