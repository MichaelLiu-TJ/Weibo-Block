/**
 * public.js 用来存放一些公共变量与通用函数，不能用来做数据交互，因为extension的各个部分不一定在同一个域
 */


var keywordIndex 					= "keyword16";
var wb_block_mids_local_index 		= "wb_block_mids";
var wb_block_tbinfos_local_index 	= "wb_block_tbinfos";
var wb_block_person_ids_local_index = "wb_block_person_ids";

/**
 * 处理错误
 */
function handleError(error){
	console.log('Error: ${error}');
}