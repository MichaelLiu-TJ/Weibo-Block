/******************************************************************
 * 运行于后台的脚本，用来监听微博所发出的ajax请求
 * 在微博‘发现’页中，当页面滚动到底部的时候，会触发事件加载更多的热门微博，
 * 所以每当监听到ajax请求之后，就认为需要对页面进行过滤
 ******************************************************************/
"use strict";

var hotWeiboPageUrl = "*://d.weibo.com/*";
var zhihuPage = "*://*.zhihu.com/*";

var ajaxURLs = new Object();
/**
 * 监听weibo的ajax发送
 */
chrome.webRequest.onBeforeSendHeaders.addListener(
	printAJAXRequest,
	{ urls: [hotWeiboPageUrl] },
	["blocking", "requestHeaders"]
);

function printAJAXRequest(requestDetails) {
	if (requestDetails.type != null) {
		if (requestDetails.type == "xmlhttprequest" || requestDetails.type == "sub_frame") {
			ajaxURLs[requestDetails.url] = "yes";
		}
	}
}

/**
 * 监听weibo的ajax结束
 */
chrome.webRequest.onCompleted.addListener(
	removeBlockWeiboCard,
	{ urls: [hotWeiboPageUrl] },
	["responseHeaders"]
);

function removeBlockWeiboCard(requestDetails) {
	if (ajaxURLs[requestDetails.url] == "yes") {
		// console.log(requestDetails.url+" "+ajaxURLs[requestDetails.url]);
		// remove weibo card you don't want to see
		blockWeiboCard();
		delete ajaxURLs[requestDetails.url];
	}
}

function blockWeiboCard() {
	var querying = browser.tabs.query({
		active: true,
		currentWindow: true
	});

	var executing = browser.tabs.executeScript({
		file: "/resources/js/content/page-eater.js"
	}).then(function () {
		querying.then(function (tabs) {
			browser.tabs.sendMessage(tabs[0].id, {
				source: "weibo_block",
				message: "webrequest_completed"
			});
		});
	});
}


