# Miniature Octo Sniffle action

This action moves issues to a specific column based on set criteria.

## Quickstart

### Inputs

#### `config-file`

**Required** A JSON file containing an Array of configurations.

#### `myToken`

**Required** A valid API token scoped to post comments on the repo.

#### `default-column`

**Optional** The column where every issue will go. Leave blank to have an issue not be moved if none of the configurations are met.

## Example usage

```yml
- name: checking out repo
  uses: actions/checkout@v2
- name: Move Issue
  id: api-json
  uses: Aveline-art/miniature-octo-sniffle@master

  with:
    config-file: './.github/workflows/moveIssues/config.json'
    myToken: ${{ secrets.GITHUB_TOKEN }}
```

## config-file format