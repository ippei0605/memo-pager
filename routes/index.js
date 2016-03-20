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
exports.list = function(req, res) {
	// http://docs.couchdb.org/en/1.6.1/couchapp/views/pagination.html
	var page = req.query.page;

	// ビューのパラメータを設定する。
	var viewParams = {
		descending : true,
		limit : context.LINE_PER_PAGE + 1
	};

	// URLパラメータによりビューの設定を追加する。
	var pageIndexs = req.query.pageIndexs;
	if (typeof pageIndexs === 'undefined') {
		// 最初のページ (初回の検索)
		// ページインデックスを初期化する。(0, 1ページは未使用)
		pageIndexs = [ undefined, undefined ];
		page = 1;
	} else {
		pageIndexs = pageIndexs.split(',');
		// ページインデックスから startkey を設定する。値が無い場合は
		if (typeof pageIndexs[page] === 'undefined') {
			page = 1;
		} else {
			viewParams.startkey = pageIndexs[page] !== '' ? pageIndexs[page]
					: undefined;
		}
	}

	console.log(pageIndexs);

	console.log(viewParams.startkey);

	memo.list(viewParams, function(err, body) {
		if (body.rows.length > context.LINE_PER_PAGE) {
			var end = body.rows.pop();
			pageIndexs[parseInt(page) + 1] = end.key;
		}
/*


		page == 1 : 前なし

		page => Math.floor(body.total_rows / context.LINE_PER_PAGE) + 1 : 次無し


		previous =

		next =

*/
		res.render('index', {
			"packageJson" : packageJson,
			"list" : body.rows,
			"page" : page,
			"pageIndexs" : pageIndexs,
		});
	});
};

/*var previous = function(page){
	if(page<=1){

	}else{

	}



};


pagingInfo= {
	"page"
	"previous":{
		"visible": true,
		"page": ""
	},
	"next":{
		"visible": true,
		page: ""
	}
};

*/

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
