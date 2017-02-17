var hotWeiboPageUrl = "*://d.weibo.com/*";
var zhihuPage = "*://*.zhihu.com/*";

var ajaxURLs = new Object();

function removeBlockWeiboCard(requestDetails) {
  if(ajaxURLs[requestDetails.url] == "yes"){
	console.log(requestDetails.url+" "+ajaxURLs[requestDetails.url]);
	// remove weibo card you don't want to see
	blockWeiboCard();
	delete ajaxURLs[requestDetails.url];
  }
}

function printAJAXRequest(requestDetails){
  if(requestDetails.type != null){
    if (requestDetails.type == "xmlhttprequest") {
	  ajaxURLs[requestDetails.url] = "yes";
    }
  }
}

chrome.webRequest.onBeforeSendHeaders.addListener(
  printAJAXRequest,
  {urls: [hotWeiboPageUrl]},
  ["blocking", "requestHeaders"]
);

chrome.webRequest.onCompleted.addListener(
  removeBlockWeiboCard,
  {urls: [hotWeiboPageUrl]},
  ["responseHeaders"]
);


function blockWeiboCard() {	
	var querying = browser.tabs.query({
      active: true,
      currentWindow: true
    });
	
	var executing = browser.tabs.executeScript({
      file: "/resources/js/content/page-eater.js"
    });
	
	querying.then(function (tabs) {
		browser.tabs.sendMessage(tabs[0].id, {
			replacement: "Message from the add-on!"
		});
	});
}


