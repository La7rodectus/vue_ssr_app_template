const fs = require('fs');
const path = require('path');
const MFS = require('memory-fs');
const webpack = require('webpack');
const VUE_CLI_WEBPACK_CONFIG_PATH = '.\\node_modules\\@vue\\cli-service\\webpack.config.js';

/**
 * returns ssr or client webpack config
 * @param { boolean } SSR - is ssr config?
 * @returns { object }webpack config
 */
const getWebpackConfig = (SSR = false) => {
  if (SSR) process.env.SSR = 1;
  else delete process.env.SSR;
  delete require.cache[require.resolve(VUE_CLI_WEBPACK_CONFIG_PATH)];
  return require(VUE_CLI_WEBPACK_CONFIG_PATH);
};

const serverConfig = getWebpackConfig(true);
const clientConfig = getWebpackConfig();
serverConfig.output.path = path.join(serverConfig.output.path, 'server');
clientConfig.output.path = path.join(clientConfig.output.path, 'client');


const readFile = (fs, file, config) => {
  console.log(fs);
  try {
    return fs.readFileSync(path.join(config.output.path, file), 'utf-8');
  } catch (err) {
    console.log(err);
  }
};

const mfs = new MFS();

const clientCompiler = webpack(clientConfig);
clientCompiler.outputFileSystem = mfs;

const serverCompiler = webpack(serverConfig);
serverCompiler.outputFileSystem = mfs;

const setHooks = (options) => {
  const { templatePath } = options;

  // read template from disk and watch
  let template = fs.readFileSync(templatePath, 'utf-8');
  fs.watch(templatePath).on('change', () => {
    template = fs.readFileSync(templatePath, 'utf-8');
    mfs.writeFileSync(template, templatePath, 'utf-8');
    console.log('index.html template updated.');
  });


  clientCompiler.hooks.done.tap('BuildStatsPlugin', (stats) => {
    stats = stats.toJson();
    stats.errors.forEach((err) => console.error(err));
    stats.warnings.forEach((err) => console.warn(err));
    if (stats.errors.length) return;
  });

  // watch and update server renderer
  serverCompiler.watch({}, (err, stats) => {
    if (err) throw err;
    stats = stats.toJson();
    if (stats.errors.length) return;
  });

  return mfs;
};

const getMiddleware = () => {
  // dev middleware
  const devMiddleware = require('webpack-dev-middleware')(clientCompiler, {
    publicPath: clientConfig.output.publicPath,
    noInfo: true
  });
  // hot middleware
  const hotMiddleware = require('webpack-hot-middleware')(clientCompiler, { heartbeat: 5000 });
  return async (req, res, cb) => {
    await devMiddleware(req, res, async () => {
      await hotMiddleware(req, res, async () => {
        await cb(req, res);
      });
    });
  };
};


module.exports = {
  setHooks,
  getMiddleware,
};
