/**
 * Memo with pager アプリのモデル
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
	return (Math.ceil(totalRows / context.LINE_PER_PAGE));
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
var getLinkInfo = function(targetPage) {
	var visible, url = '#';
	if (typeof targetPage !== 'undefined') {
		url = '?page=' + targetPage;
	} else {
		visible = 'disabled';
	}
	var linkInfo = {
		"visible" : visible,
		"url" : url
	};
	return linkInfo;
};

/** ページャー情報を返す。 */
exports.getPagerInfo = function(page, totalRows) {
	var pagerInfo = {
		"page" : page,
		"lastPage" : getLastPage(totalRows),
		"previous" : getLinkInfo(getPreviousPage(page)),
		"next" : getLinkInfo(getNextPage(page, totalRows))
	};
	return pagerInfo;
};

/** ページインデックスを返す。 */
exports.getPageIndexes = function(page, pageIndexes) {
	return page == 1 ? [ undefined, undefined ] : pageIndexes;
};

/** ページを返す。 */
exports.getPage = function(page) {
	return (typeof page !== 'undefined') ? page : 1;
}