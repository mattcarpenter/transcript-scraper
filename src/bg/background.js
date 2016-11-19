// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });


//example of using a message handler from the inject scripts
var lastUrl;

chrome.webRequest.onCompleted.addListener(
  function(details) {
  	var linesPattern = /<text\sstart="(.+?)"\sdur="(.+?)">(.+?)<\/text>/g;
  	var partsPattern = /<text\sstart="(.+?)"\sdur="(.+?)">(.+?)<\/text>/;

  	if (details.url.indexOf('api/timedtext') != -1
  		&& details.url.indexOf('type=track') != -1) {

  		// prevent infinite loop. this webRequest listener will "see" the XHR
  		// created below using fetch() too...
  		if (lastUrl === details.url) {
  			return;
  		}

  		lastUrl = details.url;

  		fetch(details.url).then(function (response) {
  			return response.text();
  		}).then(function (text) {
  			var lines = text.match(linesPattern) || [];
  			var output = [];

  			lines.forEach(function (line) {
  				var parts = line.match(partsPattern);
  				var start = parts[1];
  				var duration = parts[2];
  				var line = parts[3];

  				output.push('' + start + ',' + (Number(start) + Number(duration)));
  				output.push(line);
  				output.push('');
  			});

  			var data = output.join('\n');

  			var input = document.createElement('textarea');
	        document.body.appendChild(input);
	        input.value = data;
	        input.focus();
	        input.select();
	        document.execCommand('Copy');
	        input.remove();

	        alert('Transcript copied to clipboard.');
  		});
  	}
    //return {cancel: details.url.indexOf('api/timedtext') != -1};
  },
  { urls: ["<all_urls>"] }
);