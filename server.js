const fs = require('fs');
const path = require('path');
const express = require('express');
const { renderToString } = require('@vue/server-renderer');
const manifest = require('./dist/server/ssr-manifest.json');
const insertInitialState = require('./src/utils/insertInitialState.js').insertInitialState;

const server = express();

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

  try {
    Object.assign(appParts, await createApp(req));
  } catch (err) {
    console.log(err);
    return;
  }

  const { app, router, store } = appParts;
  const appContent = await renderToString(app);

  fs.readFile(path.join(__dirname, '/dist/client/index.html'), (err, template) => {
    if (err) {
      throw err;
    }

    const templateWithState = insertInitialState(store.state, template);
    const html = templateWithState
      .toString()
      .replace('<div id="app">', `<div id="app">${appContent}`);
    console.log(html);
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  });
});

console.log('You can navigate to http://localhost:8080');

server.listen(8080);
