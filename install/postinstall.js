/**
 * @file Memo with pager アプリのインストール後処理
 *
 * <pre>
 * ・データベース「memo」が無い場合は作成する。
 * ・「memo」にビュー「_design/memos」が無い場合は作成する。
 * ・セッション保存用データベース「session」を削除＆作成する。
 * </pre>
 *
 * @author Ippei SUZUKI
 */

// モジュールを読込む。
var context = require('../utils/context');

// ビュー (マップファンクションは空で定義)
var VIEW = {
	"_id" : "_design/memos",
	"views" : {
		"list" : {
			"map" : ""
		}
	}
};

// ビューを作成する。
var insertView = function(db, view) {
	// マップファンクションを設定する。
	var fs = require("fs");
	view.views.list.map = fs.readFileSync(__dirname + '/memo.map').toString();
	db.insert(view, function(err) {
		if (!err) {
			console.log('ビュー[%s]を作成しました。', view._id);
			console.log(view);
		} else {
			console.log(err);
		}
	});
};

// データベースを作成する。
var createDatabese = function(database, view) {
	// データベースの存在をチェックする。
	context.cloudant.db.get(database, function(err, body) {
		if (err && err.error === 'not_found') {
			console.log('アプリに必要なデータベースがありません。');
			context.cloudant.db.create(database, function(err) {
				if (!err) {
					console.log('データベース[%s]を作成しました。', database);
					// ビューを作成する。
					var db = context.cloudant.db.use(database);
					insertView(db, view);
				} else {
					console.log(err);
				}
			});
		} else {
			// ビューの存在をチェックする。
			var db = context.cloudant.db.use(database);
			db.get(view._id, function(err, body) {
				if (!body) {
					// ビューが無いため作成する。
					console.log('アプリに必要なビューがありません。');
					insertView(db, view);
				}
			});
		}
	});
};

// セッション保存用データベースを削除＆作成する。
var createSessionDatabase = function(database) {
	context.cloudant.db.destroy(database, function() {
		context.cloudant.db.create(database, function(err) {
			if (!err) {
				console.log('データベース[%s]を再作成しました。', database);
			} else {
				console.log(err);
			}
		});
	});
}

createDatabese(context.MEMO_DB_NAME, VIEW);
createSessionDatabase(context.SESSION_DB_NAME);
