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

/** ビューのパラメータを返す。 */
var getViewParams = function(startkey) {
	var viewParams = {
		descending : true,
		limit : context.LINE_PER_PAGE + 1
	};
	if (typeof startkey !== 'undefined') {
		viewParams.startkey = startkey;
	}
	return viewParams;
}

/**
 * メモの一覧を取得する。
 *
 * @see db.view 関数
 *      {@link https://github.com/apache/couchdb-nano#dbviewdesignname-viewname-params-callback}
 */
exports.list = function(page, pageIndexes, callback) {
	db.view('memos', 'list', getViewParams(pageIndexes[page]), callback);
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

/** 前のページ番号を返す。(無い場合は未定義) */
var getPreviousPage = function(page) {
	var previousPage;
	if (page > 1) {
		previousPage = parseInt(page) - 1;
	}
	return previousPage;
};

/** 最後のページを返す。 */
var getLastPage = function(totalRows) {
	return (Math.floor(totalRows / context.LINE_PER_PAGE) + 1);
};

/** 次のページ番号を返す。(無い場合は未定義) */
var getNextPage = function(page, totalRows) {
	var nextPage;
	if (page < getLastPage(totalRows)) {
		nextPage = parseInt(page) + 1;
	}
	return nextPage;
};

/** 対象ページとページインデックスよりリンク情報を返す。 */
var getLinkInfo = function(targetPage, pageIndexes) {
	var visible, url = '#';
	if (typeof targetPage !== 'undefined') {
		url = '?page=' + targetPage + '&pageIndexes=' + pageIndexes;
	} else {
		visible = 'disabled';
	}
	var linkInfo = {
		"visible" : visible,
		"url" : url
	};
	return linkInfo;
};

/** ページャー情報を返す */
exports.getPagerInfo = function(page, totalRows, pageIndexes) {
	var pagerInfo = {
		"page" : page,
		"lastPage" : getLastPage(totalRows),
		"previous" : getLinkInfo(getPreviousPage(page), pageIndexes),
		"next" : getLinkInfo(getNextPage(page, totalRows), pageIndexes)
	};
	return pagerInfo;
};

/** URLパラメータよりページインデックスを返す */
exports.getPageIndexes = function(page, urlParam) {
	var pageIndexes;
	if (page == 1 || typeof urlParam === 'undefined') {
		// 最初のページ (初回の検索)
		// ページインデックスを初期化する。(0, 1ページは未使用)
		pageIndexes = [ undefined, undefined ];
	} else {
		pageIndexes = urlParam.split(',');
	}
	return pageIndexes;
};
