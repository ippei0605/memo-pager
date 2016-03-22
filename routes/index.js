/**
 * ページャー付きMemoアプリのルーティング
 *
 * @module routes/index
 * @author Ippei SUZUKI
 */

// モジュールを読込む。
var context = require('../utils/context');
var memo = require('../models/memo');

// package.json を読込む。(version、description の値をメモ一覧で使用するため)
var packageJson = require('../package.json');

/** メモ一覧を表示する。 */
// http://docs.couchdb.org/en/1.6.1/couchapp/views/pagination.html
exports.list = function(req, res) {
	// ページを設定する。
	var page = (typeof req.query.page !== 'undefined') ? req.query.page : 1;

	// ページインデックスを設定する。
	var pageIndexes = memo.getPageIndexes(page, req.query.pageIndexes);

	memo.list(page, pageIndexes, function(err, body) {
		if (body.rows.length > context.LINE_PER_PAGE) {
			var end = body.rows.pop();
			pageIndexes[parseInt(page) + 1] = end.key;
		}

		res.render('index', {
			"packageJson" : packageJson,
			"list" : body.rows,
			"pagerInfo" : memo.getPagerInfo(page, body.total_rows, pageIndexes)
		});
	});
};

/** メモの新規作成ダイアログを表示する。 */
exports.createDialog = function(req, res) {
	res.render('dialog', {
		"doc" : null
	});
};

/** メモの更新ダイアログを表示する。 */
exports.updateDialog = function(req, res) {
	var _id = req.params._id;
	memo.get(_id, function(err, doc) {
		res.render('dialog', {
			"doc" : doc
		});
	});
};

/** メモをDBに新規作成して、メモ一覧を表示する。 */
exports.create = function(req, res) {
	var doc = {
		"content" : req.body.content,
		"updatedAt" : req.body.updatedAt
	};
	memo.save(doc, function() {
		res.redirect('/');
	});
};

/** メモをDBに更新して、メモ一覧を表示する。 */
exports.update = function(req, res) {
	var doc = {
		"_id" : req.params._id,
		"_rev" : req.params._rev,
		"content" : req.body.content,
		"updatedAt" : req.body.updatedAt
	};
	memo.save(doc, function() {
		res.redirect('/');
	});
};

/** メモをDBから削除して、メモ一覧を表示する。 */
exports.remove = function(req, res) {
	memo.remove(req.params._id, req.params._rev, function() {
		res.redirect('/');
	});
};
