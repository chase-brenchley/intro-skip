// alert("Hello from your chrome extension")

// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
// 	if (request.message === "clicked_browser_action") {
// 		var firstHref = $("a[href^='http']").eq(0).attr("href");
// 		console.log(firstHref);

// 		chrome.runtime.sendMessage({"message": "open_new_tab", "url": firstHref});
// 	}
// });

// Inject an <a> at somewhere in the youtube html

// $("body").append("<a id='extension_click' class='yt-simple-endpoint style-scope yt-formatted-string' href='/watch?v=jB1XvMyEBNA&t=91s'></a>");
// function markIntro(){
// 	ytplayer = document.getElementById("movie_player");
// 	time = ytplayer.getCurrentTime();
// 	alert(time);
// }

function wait(){
	// I need to wait for the right click menu to show up
	// This finds the right click menu 
	menu = document.getElementsByClassName("ytp-popup ytp-contextmenu");

	// If menu.length is 1, then the element exist
	if (menu.length === 1){
		document.getElementsByClassName("ytp-panel-menu")[1].innerHTML = `<div class="ytp-menuitem" aria-haspopup="false" role="menuitem" tabindex="0" data-visual-id="8" id="intro-butt"><div class="ytp-menuitem-label">Mark as end of intro</div><div class="ytp-menuitem-content"></div></div>` + document.getElementsByClassName("ytp-panel-menu")[1].innerHTML;
		link = document.getElementById('intro-butt');
		link.addEventListener('click', function(){
			ytplayer = document.getElementById("movie_player");
			time = ytplayer.getCurrentTime();
			alert(time);
		});
		return;
	} else {
		setTimeout(function(){
			wait();
		}, 500);
	}
}
wait();