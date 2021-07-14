const path = require('path');
const express = require('express');
const fs = require('fs');
const { renderToString } = require('@vue/server-renderer');
const manifest = require('./dist/server/ssr-manifest.json');

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
  const { app, router, store } = await createApp({ context: req });

  //await router.push(req.url);
  //await router.isReady();

  const appContent = await renderToString(app);

  const renderState = `
    <script>
      window.__INITIAL_STATE__ = ${JSON.stringify(store.state)}
    </script>`;

  fs.readFile(path.join(__dirname, '/dist/client/index.html'), (err, template) => {
    if (err) {
      throw err;
    }


    const html = template
      .toString()
      .replace('<div id="app">', `${renderState}<div id="app">${appContent}`);
    console.log(html);
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  });
});

console.log('You can navigate to http://localhost:8080');

server.listen(8080);
