const https = require('https');
const path = require('path');
const fs = require('fs');
const { renderToString } = require('@vue/server-renderer');

const webpackManifest = require('./dist/server/ssr-manifest.json');
const insertInitialState = require('./src/utils/insertInitialState.js').insertInitialState;


const options = {
  key: fs.readFileSync(path.join(__dirname, 'key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'cert.pem')),
};

https.createServer(options, (req, res) => {
  console.log(req.url);
  res.writeHead(200);
  res.end('hello world\n');
}).listen(8080);

console.log('You can navigate to https://localhost:8080');
