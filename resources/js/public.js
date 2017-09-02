/**
 * public.js 用来存放一些公共变量与通用函数，不能用来做数据交互，因为extension的各个部分不一定在同一个域
 */

"use strict";

// 描述一条微博的信息
var WeiboInfo = function () {
	this.mid;
	this.tbinfo;
	this.nick_name;
	this.wb_person_id;
	this.wb_text;
};

// 描述一个博主的信息
var WeiboPerson = function () {
	this.nick_name;
	this.person_id;
	this.avatar_src_url;
};

function getQueryString(usercardStr, name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = usercardStr.match(reg);
	if (r !== null) return unescape(r[2]); return null;
}
/**
 * 判断数组是否包含某元素
 */
function contains(arr, obj) {
	var i = arr.length;
	while (i--) {
		if (arr[i] === obj) {
			return true;
		}
	}
	return false;
}
/**
 * 判断字符串是否包含数组中某元素
 */
function containsArr(str, arr) {
	var i = arr.length;
	while (i--) {
		if (str.indexOf(arr[i]) >= 0) {
			return true;
		}
	}
	return false;
}


/**
 * 处理错误
 */
function handleError(error) {
	console.log('Error: ${error}');
}

function isNull(obj) {
	return obj === null || obj === undefined;
}


// 所有的需要屏蔽的内容
var block_contents = {
	wb_block_mids_local_index: [],
	wb_block_tbinfos_local_index: [],
	wb_block_person_ids_local_index: [],
	keywordIndex: ["杨幂", "大幂幂"]
};

// local storage 的 key
var storageIndexs = {
	keywordIndex: "keyword16",
	wb_block_mids_local_index: "wb_block_mids",
	wb_block_tbinfos_local_index: "wb_block_tbinfos",
	wb_block_person_ids_local_index: "wb_block_person_ids",
};

var storageIndexAndBlockContentIndexMap = {
	keywordIndex: "keywordIndex",
	wb_block_mids_local_index: "wb_block_mids_local_index",
	wb_block_tbinfos_local_index: "wb_block_tbinfos_local_index",
	wb_block_person_ids_local_index: "wb_block_person_ids_local_index"
};

var LocalStorageUtil = {

	// 向local storage 添加一个要屏蔽的人
	addBlockPersonId: function (_person_id) {
		LocalStorageUtil.setLocalStorage(storageIndexs.wb_block_person_ids_local_index, _person_id);
	},
	removePersonId: function (_person_id) {
		LocalStorageUtil.removeLocalStorage(storageIndexs.wb_block_person_ids_local_index, _person_id);
	},

	// 向local中添加一条要屏蔽的微博
	addMid: function (_mid) {
		LocalStorageUtil.setLocalStorage(storageIndexs.wb_block_mids_local_index, _mid);
	},
	removeMid: function (_mid) {
		LocalStorageUtil.removeLocalStorage(storageIndexs.wb_block_mids_local_index, _mid);
	},

	addTbinfo: function (_tbinfo) {
		LocalStorageUtil.setLocalStorage(storageIndexs.wb_block_tbinfos_local_index, _tbinfo);
	},
	removeTbinfo: function (_tbinfo) {
		LocalStorageUtil.removeLocalStorage(storageIndexs.wb_block_tbinfos_local_index, _tbinfo);
	},

	// 向local中添加一个要屏蔽的关键词
	addKeyword: function (_keyword) {
		LocalStorageUtil.setLocalStorage(storageIndexs.keywordIndex, _keyword);
	},
	removeKeyword: function (_keyword) {
		LocalStorageUtil.removeLocalStorage(storageIndexs.keywordIndex, _keyword);
	},

	setLocalStorage: function (storageIndex, content) {
		browser.storage.local.get(storageIndex).then(function (result) {
			if (result[storageIndex] === null) {
				result[storageIndex] = {};
			}
			result[storageIndex][content] = content;
			LocalStorageUtil.store(storageIndex, result[storageIndex]);
		}, handleError);
	},

	removeLocalStorage: function (storageIndex, content) {
		browser.storage.local.get(storageIndex).then(function (result) {
			if (result[storageIndex]) {
				delete result[storageIndex][content];
				LocalStorageUtil.store(storageIndex, result[storageIndex]);
			}
		}, handleError);
	},

	getAll: function () {
		var keys = [];
		for(var index in storageIndexs){
			keys.push(storageIndexs[index]);
		}
		return browser.storage.local.get(keys);
	},

	store: function (k, v) {
		var o = {};
		o[k] = v;
		browser.storage.local.set(o);
	}
};