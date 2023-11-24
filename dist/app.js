"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

var _express = _interopRequireDefault(require("express"));

var _cookieParser = _interopRequireDefault(require("cookie-parser"));

var _https = _interopRequireDefault(require("https"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _cors = _interopRequireDefault(require("cors"));

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _errors = _interopRequireDefault(require("./utils/errors"));

var _database = _interopRequireWildcard(require("./utils/database"));

var _misc = require("./utils/misc");

var _index = _interopRequireDefault(require("./routes/v1/index"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// Packages
var logger = require('morgan');

var app = (0, _express["default"])();
app.use(logger('dev'));
app.use(_express["default"].json());
app.use(_express["default"].urlencoded({
  extended: false
}));
app.use((0, _cookieParser["default"])());
var options = {};

if (process.env.NODE_ENV === 'prod' || process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'dev') {
  var sslPath = '/etc/ssl/resty-auto-ssl-fallback';
  options = {
    key: _fs["default"].readFileSync("".concat(sslPath, ".key")),
    cert: _fs["default"].readFileSync("".concat(sslPath, ".crt"))
  };
} else {
  options = {
    key: _fs["default"].readFileSync(_path["default"].join(__dirname, '../security/cert.key')),
    cert: _fs["default"].readFileSync(_path["default"].join(__dirname, '../security/cert.pem'))
  };
}

var httpsServer = _https["default"].createServer(options, app); // Enable All CORS Requests


app.use((0, _cors["default"])());
app.use(_bodyParser["default"].urlencoded({
  extended: true
}));
app.use(_bodyParser["default"].json());
var showLogs = process.env.LOGS === 'false' === false;

if (!showLogs) {
  console.log = function () {};
} // Connect to the DB


(0, _database["default"])().then(function () {
  return console.log('DB connected...');
}); //Register Route V1

app.use(process.env.API_URL || '/api', (0, _index["default"])(app, httpsServer)); //404 handler

app.use(function (req, res, next) {
  next((0, _misc.error)(_errors["default"].not_found));
}); //error handler

app.use(function (err, req, res, next) {
  var availableLang = ['pt', 'en'];
  var lang = availableLang.find(function (existLang) {
    return existLang === req.headers['accept-language'];
  }) || 'en';
  var message = JSON.parse(err.message);
  console.error('[ERROR]', err);
  (0, _misc.response)(req, res, err.status, err.code, message[lang] ? message[lang] : message['en'] ? message['en'] : err.message);
}); //https server

var port = process.env.API_PORT || 3013;
httpsServer.listen(port, function () {
  return console.log("Connected on port: ".concat(port));
});
process.on('SIGINT', function () {
  httpsServer.close(function (err) {
    // if error, log and exit with error (1 code)
    if (err) {
      console.error('Err on shutdown', err);
      process.exit(1);
    }

    try {
      _database.mongoose.disconnect();
    } catch (err) {
      console.error('error on close', err);
    }
  });
});
module.exports = app;