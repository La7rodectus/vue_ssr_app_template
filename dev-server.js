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
//console.log(serverConfig, clientConfig);

const readFile = (fs, file, config) => {
  console.log(fs);
  try {
    return fs.readFileSync(path.join(config.output.path, file), 'utf-8');
  } catch (err) {
    console.log(err);
  }
};

const mfs = new MFS();

module.exports = (options) => new Promise((resolve, reject) => {
  const { templatePath } = options;
  let manifest;
  let ready;
  const readyPromise = new Promise((r) => { ready = r; });

  // read template from disk and watch
  let template = fs.readFileSync(templatePath, 'utf-8');
  fs.watch(templatePath).on('change', () => {
    template = fs.readFileSync(templatePath, 'utf-8');
    console.log('index.html template updated.');
    resolve(mfs, template);
  });



  // dev middleware
  const clientCompiler = webpack(clientConfig);
  clientCompiler.outputFileSystem = mfs;
  require('webpack-dev-middleware')(clientCompiler, {
    publicPath: clientConfig.output.publicPath,
    noInfo: true
  });

  clientCompiler.hooks.done.tap('BuildStatsPlugin', (stats) => {
    stats = stats.toJson();
    stats.errors.forEach((err) => console.error(err));
    stats.warnings.forEach((err) => console.warn(err));
    if (stats.errors.length) return;
    resolve(mfs, template);
  });


  require('webpack-hot-middleware')(clientCompiler, { heartbeat: 5000 });

  // watch and update server renderer

  const serverCompiler = webpack(serverConfig);
  serverCompiler.outputFileSystem = mfs;
  serverCompiler.watch({}, (err, stats) => {
    if (err) throw err;
    stats = stats.toJson();
    if (stats.errors.length) return;
    let file;
    try {
      file = readFile(mfs, 'ssr-manifest.json', serverConfig);
    } catch (err) {
      console.log(err);
    }
    if (file) manifest = JSON.parse(file) || manifest;

    resolve(mfs, template, manifest);
  });
}).catch((err) => console.log(err));

