/**
 * page-eater.js 
 * block the pieces of weibo that you don't want to see.
 */

"use strict";

console.log("insert page-eater into tab weibo");

function eatPage(request, sender, sendResponse) {
	try {
		if (request["source"] !== "weibo_block") {
			return;
		}
		rebuildBlockContentsAndExecuteBlock();
	} catch (error) {
		console.log(error);
	} finally {
		browser.runtime.onMessage.removeListener(eatPage);
	}
}

browser.runtime.onMessage.addListener(eatPage);

/**
 * 当页面改变需要再次进行屏蔽之后，先从本地存储中取出最新的屏蔽内容，再进行屏蔽
 */
function rebuildBlockContentsAndExecuteBlock() {
	var getting = LocalStorageUtil.getAll();
	getting.then(function (result) {
		console.log(result);
		for (var index in storageIndexAndBlockContentIndexMap) {
			var storageIndexStr = storageIndexs[index];//用于存储和获取local storage 的索引字符串
			var temp_block_content = block_contents[storageIndexAndBlockContentIndexMap[index]];//内存中要屏蔽内容的分类数据数组
			if (result[storageIndexStr] !== null && storageIndexStr !== null) {
				var keywordFromLocal = result[storageIndexStr];// 从本地存储获取的其中一组数据
				for (var index in keywordFromLocal) {
					if (temp_block_content.indexOf(keywordFromLocal[index]) < 0) {
						temp_block_content.push(keywordFromLocal[index]);
					}
				}
			}
		}
		executeBlock();
	}, handleError);
}

/**
 * block weibo
 */
function executeBlock() {
	var weiboCardsList = document.getElementsByClassName("WB_cardwrap WB_feed_type S_bg2");
	if (weiboCardsList === null || weiboCardsList.length === 0) { console.log("can not get weibo list"); return; }

	for (var index in weiboCardsList) {
		var weiboCard = weiboCardsList[index];
		if (weiboCard === undefined || weiboCard === null) { continue; }


		if (weiboCard.attributes === undefined) {
			continue;
		}

		var weibo_info = extractWeiboCard(weiboCard);
		weiboCard.onmouseover = handleMouseOver;
		weiboCard.onmouseout = handleMouseOut;
		if (weiboCard.style.display !== "none" && needBlock(weibo_info)) {
			weiboCard.style.display = 'none';
			console.log("Block a piece of weibo");
			console.log(weibo_info.wb_text);
			continue;
		}
	}
}

/**
 * each piece of weibo containd in a complicated div. so this function will extract key info to a object.
 */
function extractWeiboCard(weiboCard) {
	var tbinfo = weiboCard.attributes["tbinfo"].value;
	var mid = weiboCard.attributes["mid"].value;

	var wb_detail_fix;
	for (var index in weiboCard.children) {
		if ('WB_feed_detail clearfix' === weiboCard.children[index].className) {
			wb_detail_fix = weiboCard.children[index];
		}
	}

	if (wb_detail_fix === null) {
		return;
	}

	var screen_box;

	var wb_face;

	var wb_detail_div;
	for (var index in wb_detail_fix.children) {
		if ('WB_detail' === wb_detail_fix.children[index].className) {
			wb_detail_div = wb_detail_fix.children[index];
		}
	}

	var wb_info_div;
	var wb_text_div, wb_text_content;
	for (var index in wb_detail_div.children) {
		if ('WB_info' === wb_detail_div.children[index].className) {
			wb_info_div = wb_detail_div.children[index];
		} else if ('WB_text W_f14' === wb_detail_div.children[index].className) {
			wb_text_div = wb_detail_div.children[index];
			wb_text_content = wb_text_div.innerText;
		}
	}

	var nick_name, wb_usercard, wb_person_id, wb_refer_flag;// 一些发送这条微博的用户的个人信息
	if (wb_info_div !== null && wb_info_div !== undefined) {
		for (var index in wb_info_div.children) {
			if ("W_f14 W_fb S_txt1" === wb_info_div.children[index].className) {
				nick_name = wb_info_div.children[index].attributes["nick-name"].value;
				wb_usercard = wb_info_div.children[index].attributes["usercard"].value;
				wb_person_id = getQueryString(wb_usercard, 'id');
				wb_refer_flag = getQueryString(wb_usercard, 'refer_flag');
			}
		}
	}

	var wb_infomation = new WeiboInfo();
	wb_infomation.mid = mid;
	wb_infomation.tbinfo = tbinfo;
	wb_infomation.nick_name = nick_name;
	wb_infomation.wb_person_id = wb_person_id;
	wb_infomation.wb_text = wb_text_content;

	return wb_infomation;

}

/**
 * 根据微博的关键信息判断微博是否需要屏蔽
 */
function needBlock(weibo_info) {
	if (contains(block_contents.wb_block_mids_local_index, weibo_info.mid)) {
		console.log("block by mid");return true;
	}
	if (contains(block_contents.wb_block_tbinfos_local_index, weibo_info.tbinfo)) {
		console.log("block by tbinfo");return true;
	}
	if (contains(block_contents.wb_block_person_ids_local_index, weibo_info.wb_person_id)) {
		console.log("block by person id");return true;
	}
	if (containsArr(weibo_info.wb_text, block_contents.keywordIndex)) {
		console.log("block by keyword");return true;
	}
	return false;
}