"use strict";

var documentBorderWidth = 5;
var blockToolPopupDiv;

document.body.style.border = documentBorderWidth + "px solid #333333";

(function () {
	// insert css to document
	var style_blockToolPopupDiv = document.createElement("style");
	style_blockToolPopupDiv.type = "text/css";
	style_blockToolPopupDiv.innerText =
		"#blockToolPopupDiv {				" +
		"	position: absolute;				" +
		"	height: (25/16)em;				" +
		"	left: 0px;						" +
		"	top: 0px;						" +
		"	z-index: 65535					" +
		"}									" +
		"#blockToolPopupDiv ul {            " +
		"    float: left;                   " +
		"    width: 100%;                   " +
		"    padding: 0;                    " +
		"    margin: 0;                     " +
		"    list-style-type: none;         " +
		"    height: (25/16)em;             " +
		"}                                  " +
		"                                   " +
		"#blockToolPopupDiv a {             " +
		"    float: left;                   " +
		"    width: 7em;					" +
		"    text-decoration: none;			" +
		"    color: white;                  " +
		"    background-color: purple;      " +
		"    padding: 0.2em 0.6em;          " +
		"    border-right: 1px solid white; " +
		"}									" +
		"									" +
		"#blockToolPopupDiv a:hover {		" +
		"    background-color: #ff3300		" +
		"}									" +
		"									" +
		"#blockToolPopupDiv li {			" +
		"    display: inline;				" +
		"}									";
	document.head.appendChild(style_blockToolPopupDiv);

	// insert popup div to document
	blockToolPopupDiv = document.createElement('div');
	blockToolPopupDiv.style.visibility = "hidden";
	blockToolPopupDiv.id = "blockToolPopupDiv";
	blockToolPopupDiv.innerHTML =
		"<ul>									" +
		"	<li><a href='javascript:void(0)' class='block_selection' block_selection='block_by_weibo_id'>屏蔽这条微博</a></li>	" +
		"	<li><a href='javascript:void(0)' class='block_selection' block_selection='block_by_person_id'>屏蔽此人的微博</a></li>	" +
		"</ul>									";
	document.body.appendChild(blockToolPopupDiv);

	// register event function for popup div
	var block_selections = document.getElementsByClassName('block_selection');
	for (var index in block_selections) {
		if (block_selections[index]) {
			block_selections[index].onclick = handlePopUpClick;
		}
	}
})();

function handleMouseOver(event) {
	if (this.contains(event.target) && !this.contains(event.relatedTarget)) {
		var weiboinfo = extractWeiboCard(this);
		blockToolPopupDiv["weibo_info_current"] = weiboinfo;
		blockToolPopupDiv["weiboCard"] = this;
		blockToolPopupDiv.style.top = this.offsetTop + documentBorderWidth + "px";
		blockToolPopupDiv.style.left = this.offsetLeft + documentBorderWidth + 74 + "px";
		blockToolPopupDiv.style.visibility = "visible";
	}
}

function handleMouseOut(event) {
	if (this.contains(event.target)
		&& !this.contains(event.relatedTarget)
		&& event.relatedTarget != blockToolPopupDiv
		&& !blockToolPopupDiv.contains(event.relatedTarget)) {
		blockToolPopupDiv.style.visibility = "hidden";
	}
}

function handlePopUpClick(event) {
	if (blockToolPopupDiv["weibo_info_current"] && blockToolPopupDiv["weiboCard"]) {
		var weibo_info = blockToolPopupDiv["weibo_info_current"];
		var block_selection_str = event.target.attributes['block_selection'].value;
		if (block_selection_str == 'block_by_weibo_id') {

		} else if (block_selection_str == 'block_by_person_id') {
			var person_id = weibo_info['wb_person_id'];
			console.log(person_id);
			LocalStorageUtil.addBlockPersonId(person_id);
		}
	}
}