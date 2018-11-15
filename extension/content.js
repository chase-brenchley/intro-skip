var userID;
chrome.runtime.sendMessage({action: "getID"}, function(response){
	// console.log(response.id);
	userID = response.id;
	var s = document.createElement('script');
	s.setAttribute("userID", userID);
	s.src = chrome.extension.getURL('script.js');
	s.onload = function () {
		this.remove();
	};
	(document.head || document.documentElement).appendChild(s);
});

