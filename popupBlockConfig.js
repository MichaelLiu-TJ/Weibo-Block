var keywordIndex = "keyword15";

function addKeyword() {
	var willBlockKeywordValue = document.getElementById("will_block_keyword").value;

	var getting = browser.storage.local.get(keywordIndex);
	getting.then(function(result) {
		if(result[keywordIndex]==null){
			result[keywordIndex] = new Object();
		}
		result[keywordIndex][willBlockKeywordValue] = 'yes';
		
		browser.storage.local.set({
			keyword15:result[keywordIndex]
		});
		console.log(result);
	}, function(error) {
		console.log('Error: ${error}');
	});
}

document.getElementById("will_block_keyword_button").onclick = addKeyword;
// document.getElementById("will_block_keyword").onkeypress = function(event){
// console.log(event.target.value);
// }
