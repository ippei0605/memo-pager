/**
 * @file Memo with pager アプリ
 * @author Ippei SUZUKI
 */

// モジュールを読込む。
var context = require('./utils/context');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var session = require('express-session');
var routes = require('./routes');

// アプリケーションを作成する。
var app = express();

// ミドルウェアを設定する。
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
	extended : true
}));
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(session({
	store : context.getCloudantStore(session),
	secret : 'Memo with pager',
	cookie : {
		maxAge : 24 * 60 * 60 * 1000
	}, // stay open for 1 day of inactivity
	resave : true,
	saveUninitialized : true
}));

// ルートを設定する。
app.get('/', routes.list);
app.post('/memos', routes.create);
app.post('/memos/:_id/:_rev', routes.update);
app.post('/memos/:_id/:_rev/delete', routes.remove);

// リクエストを受付ける。
app.listen(context.appEnv.port, function() {
	console.log('server starting on ' + context.appEnv.url);
});