console.log("pop up component init;");

/**
 * 向本地存储中添加需要屏蔽的关键字
 */
function addKeyword() {
	var willBlockKeywordValue = document.getElementById("will_block_keyword").value;

	browser.storage.local.get(keywordIndex).then(function (result) {
		if (result[keywordIndex] == null) {
			result[keywordIndex] = new Object();
		}
		result[keywordIndex][willBlockKeywordValue] = willBlockKeywordValue;

		storeBlockKeywords(result[keywordIndex]);
	}, handleError);
}

/**
 * 从本地存储中移除要屏蔽的关键字
 */
function removeKeyword() {
	browser.storage.local.get(keywordIndex).then(function (result) {
		if (result[keywordIndex] == null) {
			return;
		}
		delete result[keywordIndex][willBlockKeywordValue];

		storeBlockKeywords(result[keywordIndex]);
	}, handleError);
}

function storeBlockKeywords(keywords) {
	browser.storage.local.set({
		keyword16: keywords
	});
}

document.getElementById("will_block_keyword_button").onclick = addKeyword;