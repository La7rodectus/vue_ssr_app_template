const fs = require('fs');
const path = require('path');
const express = require('express');
const { renderToString } = require('@vue/server-renderer');
const manifest = require('./dist/server/ssr-manifest.json');
const insertInitialState = require('./src/utils/insertInitialState.js').insertInitialState;

const server = express();

const template = fs.readFileSync(path.join(__dirname, '/dist/client/index.html'), 'utf-8')
  .toString();

const appPath = path.join(__dirname, './dist', 'server', manifest['app.js']);

const createApp = require(appPath).default;

server.use('/img', express.static(path.join(__dirname, './dist/client', 'img')));
server.use('/js', express.static(path.join(__dirname, './dist/client', 'js')));
server.use('/css', express.static(path.join(__dirname, './dist/client', 'css')));
server.use(
  '/favicon.ico',
  express.static(path.join(__dirname, './dist/client', 'favicon.ico')),
);

server.get('*', async (req, res) => {
  const appParts = Object.create(null); // app parts: { app, router, store }
  let appContent = new String();

  try {
    Object.assign(appParts, await createApp(req));
  } catch (err) {
    console.log(err);
    res.setHeader('Content-Type', 'text/html');
    res.send('server error 500');
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
  console.log(html);

  res.setHeader('Content-Type', 'text/html');
  res.send(html);

});

console.log('You can navigate to http://localhost:8080');

server.listen(8080);
