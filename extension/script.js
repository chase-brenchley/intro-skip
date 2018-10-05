var skip = setInterval(function(){
	console.log("In the interval");
	container = document.getElementById("movie_player")
	if(container){
		var skipDiv = document.createElement("div");
		skipDiv.classList = "videoAdUiSkipContainer html5-stop-propagation";
		skipDiv.style = "display: none;opacity: 1;";
		skipDiv.id = "skip_button";

		var skipText = document.createElement("div");
		skipText.classList = "videoAdUiSkipButtonExperimentalText videoAdUiFixedPaddingSkipButtonText";
		skipText.innerText = "Skip";

		var icon = document.createElement("div");
		icon.classList = "videoAdUiExperimentalSkipIcon videoAdUiFixedPaddingSkipButtonIcon";

		var butt = document.createElement("button");
		butt.classList = "videoAdUiSkipButton videoAdUiAction videoAdUiFixedPaddingSkipButton";

		butt.appendChild(skipText);
		butt.appendChild(icon);
		skipDiv.appendChild(butt);

		container.appendChild(skipDiv);
		clearInterval(skip);
		return;
	}
}, 500);

api_call = new XMLHttpRequest();
api_call.onreadystatechange = handleStateChange;
url = "https://blooming-anchorage-23601.herokuapp.com/api/v1/skips?yt_id=jasflkdioejf";
api_call.open("GET", url, true);
api_call.send();
var skip_times = []

function handleStateChange(){
	if (api_call.readyState == 4 && api_call.status == 200){
		console.log("Ready to parse " + api_call.responseText);
		response = JSON.parse(api_call.responseText);
		for (var skip of response){
			skip_times.push({start: skip.start_t, end: skip.end_t});
		}
	}
}

var skipper = setInterval(function (){
	// console.log("In this one");
	ytplayer = document.getElementById("movie_player");
	curTime = ytplayer.getCurrentTime();
		for(var time of skip_times){
			if(curTime >= time.start && curTime <= time.end){
				skip_butt = document.getElementById('skip_button')
				skip_butt.style = "display: block; opacity 1;";
				skip_butt.addEventListener('click', function(){
					ytplayer.seekTo(time.end, true);
					skip_butt.style = "display: none; opacity 1;";
				}, once=true);
				break;
			} else {
				document.getElementById('skip_button').style = "display: none; opacity 1;";
			}
		}
}, 1000);

var markVideoMenuButton = setInterval(function(){
	contextMenu = document.getElementsByClassName("ytp-popup ytp-contextmenu");
	console.log("Trying to place the button");
	if (contextMenu.length === 1){
		console.log("The menu exists! Placing button");

		ytplayer = document.getElementById("movie_player");

		var startTime;

		var outer = document.createElement('div');
		outer.classList = "ytp-menuitem";
		outer.id = "context-butt";
		outer.addEventListener('click', function(){
			ytplayer = document.getElementById("movie_player");
			if (!startTime){
					startTime = ytplayer.getCurrentTime();
					// alert("Marking " + startTime + " time as start of non-content")
					inner1.innerText = "Mark as end";
			}
			else{
					endTime = ytplayer.getCurrentTime();
					// alert("Marking " + endTime + " time as end of non-content")

					// Can now send both times to the server
					alert("Sending to server");

					startTime = endTime = null;
					inner1.innerText = "Mark as start of non-content";
				}
			inner2.innerText = "";
		});

		var inner1 = document.createElement('div');
		inner1.classList = "ytp-menuitem-label";
		inner1.innerText = "Mark as start of 'non-content'";

		// <div class="ytp-menuitem-content"></div>
		var inner2 = document.createElement('div');
		inner2.classList = "ytp-menuitem-content";
		setInterval(function(){inner2.innerText = parseInt(ytplayer.getCurrentTime())}, 500);


		outer.appendChild(inner1);
		outer.appendChild(inner2);

		var context = document.getElementsByClassName("ytp-panel-menu")[1]
		context.insertBefore(outer, context.childNodes[0]);

		clearInterval(markVideoMenuButton);
	}
}, 500);
