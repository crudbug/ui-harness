/* eslint max-len:0 */

import R from 'ramda';
import Promise from 'bluebird';
import chalk from 'chalk';
import express from 'express';
import fs from 'fs-extra';
import fsPath from 'path';
import shell from 'shelljs';
import semver from 'semver';
import webpackConfig from './webpack-config';
import webpackBuilder from './webpack-builder';
import webpackDevServer from './webpack-dev-server';
import { formatSpecPaths, formatEntryPaths } from './paths';
import log from '../shared/log';

const REQUIRED_NODE_VERSION = '>=5.5.0';
const NODE_MODULES = fsPath.resolve('./node_modules');



/**
 * Starts the UIHarness development server.
 *
 * @param {Object} options:
 *
 *           --entry:   Required. Path to the specs files (comma seperated if more than one).
 *
 *           --port:    Optional. The port to start the server on.
 *                      Default: 3030
 *
 *           -- proxy:  Optional. An object containing { path, host } mappings
 *                      to proxy server requests to.
 *                      (https://webpack.github.io/docs/webpack-dev-server.html#proxy)
 *
 * @return {Promise}.
 */
export const start = (options = {}) => new Promise((resolve, reject) => {
  // Setup initial conditions.
  if (R.isNil(options.entry)) { throw new Error(`Entry path(s) must be specified.`); }

  // Extract options  default values.
  const ENV = process.env.NODE_ENV || 'development';
  const PORT = options.port || 3030;

  // Ensure the minimum version of node is supported.
  const nodeVersion = semver.clean(shell.exec('node -v', { silent: true }).output);
  if (!semver.satisfies(nodeVersion, REQUIRED_NODE_VERSION)) {
    return reject(new Error(`The UIHarness requires node version ${ REQUIRED_NODE_VERSION }.`));
  }

  // Ensure ES6+ within the specs can be imported.
  require('babel-register');

  // Prepare the Webpack configuration.
  const specs = formatSpecPaths(options.entry);
  const config = webpackConfig({ entry: specs, outputFile: 'specs.js' });

  // Create the development server.
  const app = webpackDevServer(config, { proxy: options.proxy });
  app.use('/', express.static(fsPath.resolve(__dirname, '../../public')));

  // Start the server.
  log.info('\n');
  log.info(chalk.grey(`Starting (${ ENV })...`));
  app.listen(PORT, () => {
    // Server details.
    const packageJson = require(fsPath.resolve('./package.json'));
    const reactJson = require(fsPath.join(NODE_MODULES, 'react/package.json'));
    log.info('');
    log.info(chalk.green('UIHarness:'));
    log.info(chalk.grey(' - module:   '), packageJson.name, chalk.grey(`(v${ packageJson.version || '0.0.0' })`));
    log.info(chalk.grey(' - port:     '), PORT);
    log.info(chalk.grey(' - react:    '), `v${ reactJson.version }`);

    // Specs.
    log.info(chalk.grey(' - specs:    '), specs[0] || chalk.magenta('None.'));
    R.takeLast(specs.length - 1, specs).forEach(path => {
      log.info(chalk.grey('             '), path);
    });

    // Finish up.
    log.info('');
    resolve({});
  });
});




/**
 * Bundles the UIHarness itself and saves it to the [/public/js] folder.
 *
 * @param {Object} options:
 *
 *           --entry:         Required. Path(s) to the files to build.
 *
 *           --output:        Optional. Path to save the output to.
 *
 *           --isProduction:  Optional. Flag indicating if the JS should be build in production mode
 *                            meaning optimizations (like minification) are employed.
 *                            Default: false
 *
 *           --silent:        Optional. Flag indicating if results should be logged.
 *                            Default: false
 *
 * @return {Promise}.
 */
export const bundle = (options = {}) => new Promise((resolve, reject) => {
  // Setup initial conditions.
  const { silent } = options;
  let { entry, output, isProduction } = options;
  if (!entry) { throw new Error(`Entry path(s) must be specified.`); }
  if (!R.is(Array, entry)) { entry = [entry]; }
  isProduction = isProduction || false;
  output = R.is(String, output) && fsPath.resolve(output);
  log.silent = silent || false;

  // Prepare the webpack configuration.
  const config = webpackConfig({
    isProduction,
    entry: formatEntryPaths(entry),
  });

  const logStats = (stats) => {
    log.info(chalk.green('Bundle:'));
    log.info(chalk.grey(' - production: '), isProduction);
    log.info(chalk.grey(' - minified:   '), isProduction);
    log.info(chalk.grey(' - time:       '), stats.buildTime.secs, 'secs');
    log.info(chalk.grey(' - size:       '), stats.size.display, chalk.grey('=>'), stats.zipped.display, chalk.grey('zipped'));
    log.info(chalk.grey(' - saved to:   '), output || false);
    log.info('');
    return stats;
  };

  const save = (stats) => {
    if (output) { fs.outputFileSync(output, stats.js); }
    return stats;
  };

  log.info(chalk.grey(`Building '${ entry }'...`));
  webpackBuilder(config)
    .then(result => save(result))
    .then(result => logStats(result))
    .then(result => resolve(result))
    .catch(err => {
      log.error('Failed to bundle the UIHarness:', err);
      reject(err);
    });
});
