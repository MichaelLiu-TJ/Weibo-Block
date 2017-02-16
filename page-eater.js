function eatPage(request, sender, sendResponse) {
	blockWeibo();
}

browser.runtime.onMessage.addListener(eatPage);

var block_content = {
	wb_mids:[],
	wb_tbinfos:[],
	wb_person_ids:[],
	wb_key_words:["杨幂","大幂幂"]
}

/**
 * 屏蔽微博
 */
function blockWeibo(){
	var weiboCardsList = document.getElementsByClassName("WB_cardwrap WB_feed_type S_bg2");
	if(weiboCardsList == null){
		return;
	}
	for(index in weiboCardsList){
		var weiboCard = weiboCardsList[index];
		if(weiboCard == undefined || weiboCard == null){
			continue;
		}
		
		if(weiboCard.parentNode == undefined || weiboCard.parentNode == null){
			continue;
		}
		
		var weibo_info = extractWeiboCard(weiboCard);
		console.log(weibo_info);
		
		if(needBlock(weibo_info)){
			weiboCard.style.display = 'none';
			console.log("Block a piece of weibo");
			console.log(weibo_info);
			continue;
		}

	}
}

/**
 * 每一条微博及人的信息包含在一个复杂的div中，此方法是抽取其中的关键信息并包含在一个对象实例中
 *
 */
function extractWeiboCard(weiboCard){
	
	if(weiboCard == undefined||weiboCard== null){
		return;
	}
	
	var tbinfo;
	var mid;
	
	tbinfo 	= weiboCard.attributes["tbinfo"].value;
	mid 	= weiboCard.attributes["mid"].value;
	
	var wb_detail_fix;
	for(index in weiboCard.children){
		if('WB_feed_detail clearfix' == weiboCard.children[index].className){
			wb_detail_fix = weiboCard.children[index];
		}
	}
	
	if(wb_detail_fix == null){
		return;
	}
	
	var screen_box;
	
	var wb_face;
	
	var wb_detail_div;
	for(index in wb_detail_fix.children){
		if('WB_detail' == wb_detail_fix.children[index].className){
			wb_detail_div = wb_detail_fix.children[index];
		}
	}
	
	var wb_info_div;
	var wb_text_div,wb_text_content;
	for(index in wb_detail_div.children){
		if('WB_info' == wb_detail_div.children[index].className){
			wb_info_div = wb_detail_div.children[index];
		}else if('WB_text W_f14' ==  wb_detail_div.children[index].className){
			wb_text_div = wb_detail_div.children[index];
			wb_text_content = wb_text_div.innerText;
		}
	}
	
	// get person nick name and person id
	var nick_name;
	var wb_usercard,wb_person_id,wb_refer_flag;
	if(wb_info_div!=null && wb_info_div!= undefined){
		for(index in wb_info_div.children){
			if("W_f14 W_fb S_txt1" == wb_info_div.children[index].className){
				nick_name 		= wb_info_div.children[index].attributes["nick-name"].value;
				wb_usercard 	= wb_info_div.children[index].attributes["usercard"].value;
				wb_person_id = getQueryString(wb_usercard, 'id');
				wb_refer_flag = getQueryString(wb_usercard, 'refer_flag');
			}
		} 
	}
	
	var wb_infomation = new WeiboInfo();
	wb_infomation.mid 			= mid;
	wb_infomation.tbinfo 		= tbinfo;
	wb_infomation.nick_name 	= nick_name;
	wb_infomation.wb_person_id 	= wb_person_id;
	wb_infomation.wb_text 		= wb_text_content;
	
	return wb_infomation;
	
}

/**
 * 根据微博的关键信息判断微博是否需要屏蔽
 */
function needBlock(weibo_info){
	if(contains(block_content.wb_mids, weibo_info.mid)){
		return true;
	}
	if(contains(block_content.wb_tbinfos, weibo_info.tbinfo)){
		return true;
	}
	if(contains(block_content.wb_person_ids, weibo_info.wb_person_id)){
		return true;
	}
	if(containsArr(weibo_info.wb_text, block_content.wb_key_words)){
		return true;
	}
}

var WeiboInfo = function(){
	this.mid;
	this.tbinfo;
	this.nick_name;
	this.wb_person_id;
	this.wb_text;
}

function getQueryString(usercardStr, name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = usercardStr.match(reg);
	if (r != null) return unescape(r[2]); return null;
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
function containsArr(str, arr){
	var i = arr.length;
	while (i--) {
		if (str.indexOf(arr[i])>=0) {
			return true;
		}
	}
	return false;
}
