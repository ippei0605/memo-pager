/**
 * ページャー付きMemoアプリのモデル
 *
 * @module models/memo
 * @author Ippei SUZUKI
 */

// モジュールを読込む。
var context = require('../utils/context');

// データベース「memo」を使用する。
var cloudant = context.cloudant;
var db = cloudant.db.use(context.MEMO_DB_NAME);

/**
 * メモの一覧を取得する。
 *
 * @see db.view 関数
 *      {@link https://github.com/apache/couchdb-nano#dbviewdesignname-viewname-params-callback}
 */
exports.list = function(viewParams, callback) {
	db.view('memos', 'list', viewParams, callback);
};

/**
 * メモを取得する。
 *
 * @see db.get 関数
 *      {@link https://github.com/apache/couchdb-nano#dbgetdocname-params-callback}
 */
exports.get = function(_id, callback) {
	db.get(_id, callback);
};

/**
 * メモを保存する。
 *
 * @see db.insert 関数
 *      {@link https://github.com/apache/couchdb-nano#dbinsertdoc-params-callback}
 */
exports.save = function(doc, callback) {
	db.insert(doc, callback);
};

/**
 * メモを削除する。
 *
 * @see db.destroy 関数
 *      {@link https://github.com/apache/couchdb-nano#dbdestroydocname-rev-callback}
 */
exports.remove = function(_id, _rev, callback) {
	db.destroy(_id, _rev, callback);
};