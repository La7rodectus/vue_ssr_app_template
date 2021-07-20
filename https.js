const https = require('https');
const path = require('path');
const fs = require('fs');
const { renderToString } = require('@vue/server-renderer');
const ServeStatic = require('./src/utils/serveStatic.js');
const insertInitialState = require('./src/utils/insertInitialState.js').insertInitialState;

const webpackManifest = require('./dist/server/ssr-manifest.json');
const appPath = path.join(__dirname, './dist', 'server', webpackManifest['app.js']);
const template = fs.readFileSync(path.join(__dirname, '/dist/client/index.html'), 'utf-8')
  .toString();

const createApp = require(appPath).default;

const options = {
  key: fs.readFileSync(path.join(__dirname, 'key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'cert.pem')),
};


const STATIC = ['/img', '/js', '/css', '/favicon.ico'];
const staticConfig = ServeStatic.genConfigForAll(STATIC, './dist/client', __dirname);
const handleStatic = ServeStatic.create(staticConfig, __dirname);

const serve = async (req, res) => {
  console.log('req.url:', req.url);

  if (handleStatic(req, res)) return;
  const appParts = Object.create(null); // app parts: { app, router, store }
  let appContent = new String();

  try {
    Object.assign(appParts, await createApp(req));
  } catch (err) {
    console.log(err);
    res.setHeader('Content-Type', 'text/html');
    res.end('server error 500');
    return;
  }

  const { app, router, store } = appParts;

  let templateWithState;
  try {
    appContent = await renderToString(app);
    templateWithState = insertInitialState(store.state, template);
  } catch (err) {
    console.log(err);
    return;
  }

  const html = templateWithState.replace('<div id="app">', `<div id="app">${appContent}`);

  res.setHeader('Content-Type', 'text/html');
  res.end(html);
};

https.createServer(options, async (req, res) => {
  serve(req, res);
}).listen(8080);

console.log('You can navigate to https://localhost:8080');
