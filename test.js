var context = require('./utils/context');
var cloudant = context.cloudant;
var db = cloudant.db.use(context.MEMO_DB_NAME);

var viewParams = {
	descending : true
};

db.view('memos', 'list', viewParams, function(err, body) {
	console.log('#### 1, offset=%s, page=%s', body.offset, Math
			.floor(body.offset / 5) + 1);
	body.rows.forEach(function(doc) {
		console.log(doc.key);
	});
});

viewParams = {
	descending : true,
	limit : context.LINE_PER_PAGE + 1
};

db.view('memos', 'list', viewParams, function(err, body) {
	console.log('#### 2-1, offset=%s, page=%s', body.offset, Math
			.floor(body.offset / 5) + 1);
	body.rows.forEach(function(doc) {
		console.log(doc.key);
	});
});

viewParams = {
	descending : true,
	limit : context.LINE_PER_PAGE + 1,
	startkey : '2016/03/10 18:33:22.791'
};

db.view('memos', 'list', viewParams, function(err, body) {
	console.log('#### 2-2, offset=%s, page=%s', body.offset, Math
			.floor(body.offset / 5) + 1);
	body.rows.forEach(function(doc) {
		console.log(doc.key);
	});
});

viewParams = {
	descending : true,
	limit : context.LINE_PER_PAGE + 1,
	endkey : '2016/03/10 18:33:22.791'
};

db.view('memos', 'list', viewParams, function(err, body) {
	console.log('#### 3-1 = 2-1 ?, offset=%s, page=%s', body.offset, Math
			.floor(body.offset / 5) + 1);
	body.rows.forEach(function(doc) {
		console.log(doc.key);
	});
});

viewParams = {
	descending : true,
	limit : context.LINE_PER_PAGE + 2,
	endkey : '2016/03/10 20:42:39.283'
};

db.view('memos', 'list', viewParams, function(err, body) {
	console.log('#### 3-2, total_rows=%s,offset=%s, page=%s', body.total_rows,
			body.offset, Math.floor(body.offset / 5) + 1);
	console.log(viewParams);
	body.rows.forEach(function(doc) {
		console.log(doc.key);
	});
});

viewParams = {
	descending : true,
	limit : context.LINE_PER_PAGE + 2,
	endkey : '2016/03/10 18:31:32.794'
};

db.view('memos', 'list', viewParams, function(err, body) {
	console.log('#### 4-1, offset=%s, page=%s', body.offset, Math
			.floor(body.offset / 5) + 1);
	body.rows.forEach(function(doc) {
		console.log(doc.key);
	});
});

viewParams = {
	descending : true,
	limit : context.LINE_PER_PAGE + 1,
	startkey : '2016/03/10 18:31:46.468'
};

db.view('memos', 'list', viewParams, function(err, body) {
	console.log('#### 5-1, total_rows=%s,offset=%s, page=%s', body.total_rows,
			body.offset, Math.floor(body.offset / 5) + 1);
	body.rows.forEach(function(doc) {
		console.log(doc.key);
	});
});

viewParams = {
	descending : true,
	limit : context.LINE_PER_PAGE + 1,
	startkey : '2016/03/10 18:34:13.986'
};

db.view('memos', 'list', viewParams, function(err, body) {
	console.log('#### 6-1, total_rows=%s,offset=%s, page=%s', body.total_rows,
			body.offset, Math.floor(body.offset / 5) + 1);
	console.log(body.rows[0].key);
});
