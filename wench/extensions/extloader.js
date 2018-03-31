/*
Replace extension code with this code to invoke the extloader

let xhr = new XMLHttpRequest();
let url = browser.extension.getURL('/extensions/extloader.js');
xhr.open('GET', url, false);
xhr.send(null);
eval(xhr.responseText + "\n//# sourceURL=" + url);
*/

/*global browser*/
/*global extension_id*/

((extension_id) => {
	let updateField = (field, data) => {
		let extension = XKit.installed.get(extension_id);
		if (extension[field] !== data) {
			extension[field] = data;
			XKit.installed.update(extension_id, extension);
		}
	};

	let xhr = new XMLHttpRequest();
	let url = browser.extension.getURL('/extensions/' + extension_id + '.js');
	xhr.open('GET', url, false);
	xhr.send(null);
	if (xhr.responseText) eval(xhr.responseText + "\n//# sourceURL=" + url);

	xhr = new XMLHttpRequest();
	url = browser.extension.getURL('extensions/' + extension_id + '.css');
	xhr.open('GET', url, false);
	xhr.send(null);
	if (xhr.responseText) {
		XKit.installed.get(extension_id);
		updateField('css', xhr.responseText);
	}

	xhr = new XMLHttpRequest();
	url = browser.extension.getURL('extensions/' + extension_id + '.png');
	xhr.open('GET', url, true);
	xhr.responseType = "blob";
	xhr.onload = (e) => {
		let reader = new FileReader();
		reader.onload = () => {
			updateField('icon', reader.result);
		};
		reader.readAsDataURL(e.target.response);
	};
	xhr.send(null);
})(extension_id);
