var path = require('path');
var Express = require('express');
var webpack = require('webpack');
var request = require('superagent');
var bodyParser = require('body-parser');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var proxy = require('http-proxy-middleware');
var config = require('./config.hot');

var app = new Express();
var port = process.env.PORT || 25565;
var compiler = webpack(config);

app.use(bodyParser.text({ type: '*/*' })); // for parsing application/json

app.use(proxy(`https://devx.anypoint.mulesoft.com/shared/`, { changeOrigin: true }));
app.use(proxy(`https://devx.anypoint.mulesoft.com/assets/`, { changeOrigin: true }));
app.use(proxy(`https://devx.anypoint.mulesoft.com/icons/`, { changeOrigin: true }));

app.use(
  webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: '',
    historyApiFallback: true,
    stats: 'errors-only'
  })
);

app.use(webpackHotMiddleware(compiler));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '..', '/static/index.html'));
});

app.get('/vs/*', function (req, res) {
  res.sendFile(require.resolve(`monaco-editor/min/${req.originalUrl}`));
});

app.get('/dw-parser.js', function (req, res) {
  res.sendFile(require.resolve('@mulesoft/dw-parser-js'));
});

app.get('/anypoint-styles.css', function (req, res) {
  res.sendFile(require.resolve('@mulesoft/anypoint-styles/lib/anypoint-styles.css'));
});

app.post('/transform', function (req, res) {
  const { accept, 'content-type': contentType } = req.headers;
  req.headers.origin = 'http://localhost:8081';
  request
    .post('http://localhost:8081/transform')
    .send(req.body)
    .set({ accept, 'Content-Type': contentType })
    .end(function (err, r) {
      const status = r ? r.status : 400;
      const body = r ? r.body : `Error ${err}`;
      res.status(status).json(body);
    });
});

app.listen(port, function (error) {
  if (error) {
    console.error(error);
  } else {
    console.info('==> Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.', port, port);
  }
});
