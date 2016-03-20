/**
 * @file ページャー付きMemoアプリのインストール後処理
 *
 * <pre>
 * ・データベース「memo」が無い場合は作成する。
 * ・「memo」にビュー「_design/memos」が無い場合は作成する。
 * </pre>
 *
 * @author Ippei SUZUKI
 */

//モジュールを読込む。
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
var createDatabese = function(database) {
	// データベースの存在をチェックする。
	context.cloudant.db.get(database, function(err, body) {
		if (err && err.error === 'not_found') {
			console.log('アプリに必要なデータベースがありません。');
			context.cloudant.db.create(database, function(err) {
				if (!err) {
					console.log('データベース[%s]を作成しました。', database);
					// ビューを作成する。
					var db = context.cloudant.db.use(database);
					insertView(db, VIEW);
				} else {
					console.log(err);
				}
			});
		} else {
			// ビューの存在をチェックする。
			var db = context.cloudant.db.use(database);
			db.get(VIEW._id, function(err, body) {
				if (!body) {
					// ビューが無いため作成する。
					console.log('アプリに必要なビューがありません。');
					insertView(db, VIEW);
				}
			});
		}
	});
};

createDatabese(context.MEMO_DB_NAME);