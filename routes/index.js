/**
 * Memo with pager アプリのルーティング
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
exports.list = function(req, res) {
	// ページを取得する。
	var page = memo.getPage(req.query.page);

	// ページインデックスを取得する。
	var pageIndexes = memo.getPageIndexes(page, req.session.pageIndexes);

	memo.list(page, pageIndexes, function(err, body) {
		// 1ページに表示する行数 + 1個目のキーを次のページインデックスにセットする。
		// + 1個目の値は捨てる。
		if (body.rows.length > context.LINE_PER_PAGE) {
			var end = body.rows.pop();
			pageIndexes[parseInt(page) + 1] = end.key;
		}
		// ページインデックスをセッションにセットする。
		req.session.pageIndexes = pageIndexes;

		res.render('index', {
			"packageJson" : packageJson,
			"list" : body.rows,
			"pagerInfo" : memo.getPagerInfo(page, body.total_rows, pageIndexes)
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

/** メモをDBから削除して、現在のページのメモ一覧を表示する。 */
exports.remove = function(req, res) {
	memo.remove(req.params._id, req.params._rev, function() {
		res.redirect('/?page=' + req.body.page);
	});
};