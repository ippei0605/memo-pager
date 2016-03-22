/**
 * @file ページャー付きMemoアプリ
 * @author Ippei SUZUKI
 */

// モジュールを読込む。
var context = require('./utils/context');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var routes = require('./routes');

// アプリケーションを作成する。
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
	extended : true
}));
app.use(favicon(__dirname + '/public/favicon.ico'));

// ルートを設定する。
app.get('/', routes.list);
app.get('/memos', routes.createDialog);
app.get('/memos/:_id/:_rev', routes.updateDialog);
app.post('/memos', routes.create);
app.post('/memos/:_id/:_rev', routes.update);
app.post('/memos/:_id/:_rev/delete', routes.remove);

// リクエストを受付ける。
app.listen(context.appEnv.port, function() {
	console.log("server starting on " + context.appEnv.url);
});