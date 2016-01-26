'use strict'
var R = require('ramda');
var minimist = require('minimist');
var chalk = require('chalk');
var server = require('./lib/server').default;
var log = require('./lib/shared/log').default;


// Read-in command-line arguments.
var args = process.argv.slice(2);
args = args.length > 0 ? args = minimist(args) : {};


/**
 * Look for arguments passed in at the command-line,
 * and starts the server if required.
 *
 * Command-line arguments:
 *
 *           --entry: Required. Path to the specs files (comma seperated if more than one).
 *                    If not present the server is not started.
 *                    Example: --entry ./src/specs
 *
 *           --port:  Optional. The port to start the server on.
 *                    Default: 3030
 *
 */
if (R.is(String, args.entry)) {
  server.start({
    entry: args.entry.split(','),
    port: args.port
  })
  .catch(err => {
    log.error(chalk.red('Failed to start.'));
    log.error(chalk.red(err.message));
    log.error()
  });
} else {
  log.error(chalk.red('No entry path was specified, for example: `--entry ./src/specs`\n'));
}
