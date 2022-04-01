// Imports
const fs = require("fs");
const repl = require("./repl");

/**
 * A function that assesses whether the data represents any of the configurations in the Array of configurations
 * @param {Obj} data Represents the data of the newly made issue
 * @param {Arr[Obj]} configs Represents the configuration from the passed in config-file
 * @returns Either a string of the column for a passed test or null if no tests passed
 */
function configTestAll(data, configs) {
  for (const config of configs) {
    if (configTest(data, config)) {
      return config.column;
    }
  }
  return null;
}

/**
 * A function that assesses whether the data represents one specific configuration
 * @param {Obj} data Represents the data of the newly made issue
 * @param {Arr[Obj]} config Represents one config containing a set of criteria
 * @returns A boolean representing if the data matched the criteria in the specific config
 */
function configTest(data, config) {
  const keyceptions = ["column"];

  const keys = Object.keys(config);
  // each key is a different criteria
  for (const key of keys) {
    // Skips the column key, because that is not needed
    if (keyceptions.includes(key)) {
      continue;
    }

    if (!data[key]) {
      return false;
    }

    if (repl.analyze(config[key], data[key])) {
      continue;
    } else {
      return false;
    }
  }
  return true;
}

function parseConfig(path) {
  const file = fs.readFileSync(path, "utf-8");
  return JSON.parse(file);
}

module.exports = { configTestAll, parseConfig };
