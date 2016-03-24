/**
 * Memo with pager アプリのコンテキスト
 *
 * @module utils/context
 * @author Ippei SUZUKI
 */

// Cloudantサービス名
var CLOUDANT_SERVICE_NAME = 'Cloudant NoSQL DB-cc';

// メモデータベース名
var MEMO_DB_NAME = 'memo';

// セッションデータベース名
var SESSION_DB_NAME = 'session';

// 1ページに表示する行数
var LINE_PER_PAGE = 10;

// 環境変数を取得する。
var appEnv = require('cfenv').getAppEnv();
var cloudantCreds = appEnv.getServiceCreds(CLOUDANT_SERVICE_NAME);

/** Cloudant セッションストアを取得する。 */
exports.getCloudantStore = function(session) {
	var CloudantStore = require('connect-cloudant')(session);
	var cloudantStore = new CloudantStore({
		url : cloudantCreds.url,
		databaseName : SESSION_DB_NAME,
		ttl : 86400,
		prefix : 'sess',
		operationTimeout : 2000,
		connectionTimeout : 2000
	});
	cloudantStore.on('connect', function() {
		console.log('Cloudant Session store is ready for use');
	});
	cloudantStore.on('disconnect', function() {
		console.log('An error occurred connecting to Cloudant Session Storage');
	});
	return cloudantStore;
};

/** 環境変数 */
exports.appEnv = appEnv;

/** メモデータベース名 */
exports.MEMO_DB_NAME = MEMO_DB_NAME;

/** セッションデータベース名 */
exports.SESSION_DB_NAME = SESSION_DB_NAME;

/** 1ページに表示する行数 */
exports.LINE_PER_PAGE = LINE_PER_PAGE;

/** データベース接続 */
exports.cloudant = require('cloudant')(cloudantCreds.url);