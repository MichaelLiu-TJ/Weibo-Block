console.log("pop up component init;");

/**
 * 向本地存储中添加需要屏蔽的关键字
 */
function addKeyword() {
	var willBlockKeywordValue = document.getElementById("will_block_keyword").value;
	LocalStorageUtil.addKeyword(willBlockKeywordValue);
}

/**
 * 从本地存储中移除要屏蔽的关键字
 */
function removeKeyword() {
	// LocalStorageUtil.addKeyword("");
}

document.getElementById("will_block_keyword_button").onclick = addKeyword;