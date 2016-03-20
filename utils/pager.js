/**
 * Memoアプリのページャー
 *
 * @module utils/pager
 * @author Ippei SUZUKI
 */

var context = require('./context');

var list = function(totalRows) {
	var last = Math.round(totalRows / context.LINE_PER_PAGE) + 1;
	var list = [];
	for (var i = 1; i <= last; i++) {
		list.push(i);
	}
	return list;
}


console.log(list(11));