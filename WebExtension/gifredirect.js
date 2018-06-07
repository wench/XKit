/* globals chrome, browser, msBrowser */

if (typeof(browser) === 'undefined') {
	if (typeof(chrome) !== 'undefined') {
		browser = chrome; // eslint-disable-line no-global-assign
	} else if (typeof(msBrowser) !== 'undefined') {
		browser = msBrowser; // eslint-disable-line no-global-assign
	}
}


let patterns = ["*://*.media.tumblr.com/*.gif", "*://*.media.tumblr.com/*/*.gif", "*://*.media.tumblr.com/*.gifv", "*://*.media.tumblr.com/*/*.gifv"];
let regex = /^(.*_)(\d{3,})\.gifv?$/;
let regexv = /^(.*_)(\d{3,})\.gifv\?$/;
let allowed = { };

let placeholder = browser.extension.getURL('/gifplaceholder.gif');
function redirect(requestDetails) {
	let match = regex.exec(requestDetails.url) || regexv.exec(requestDetails.url);
	if (match)	{
		let wanted = Number.parseInt(match[2]);
		if (wanted > 200 && allowed[match[0]] !== match[0]) {
			return {
				cancel: true
			};
		}
	} 
}

browser.webRequest.onBeforeRequest.addListener(
  redirect,
  {urls:patterns, types:["image"]},
  ["blocking"]
);


browser.contextMenus.create({
	id: "xkit-gifredirect",
	title: "Load GIF fullsize",
	contexts: ["image", "link"],
	targetUrlPatterns: patterns,

	onclick: (info, tab) => {
		let url = info.srcUrl || info.linkUrl;
		let match = regex.exec(url);
		if (match)	{
			let newurl;

			// Find the largest match we know about...
			let largest;
			for (let i = 1280; i >= 200; i -= 10) {
				let key = match[1] + i + ".gif";
				if (key in allowed) {
					if (!largest) {
						largest = i;
						newurl = allowed[match[0]] = match[1] + largest + ".gif";
					}
					allowed[key] = newurl;
				}
			}
			
			if (!newurl) 
				return;
	
			allowed[match[1]] = largest;
				
			let func = function(src, to) {
				for (let i = 0; i < document.images.length; i++) {
					let image = document.images[i];
					if (image.src.startsWith(src)) {
						console.info("Load fullsize: " + image.src + " => " + to);
						image.src = to + "?";
					}
				}
			};

			let script = "(" + func.toString() + ")(" + JSON.stringify(match[0]) + "," + JSON.stringify(newurl) + ");";

			browser.tabs.executeScript(tab.id, {
				allFrames: true,
				code: script
			});
		}
	}
});

browser.runtime.onMessage.addListener((message, sender, sendResponse)=>{
	switch (message.command || '')	{

	case "GET_ALLOWED": 
		if (message.url in allowed) sendResponse(allowed[message.url]);
		else sendResponse('');
		break;

	case "SET_ALLOWED": 
		allowed[message.url] = message.value;
		sendResponse(true);
		break;

	}

	return false;
});
