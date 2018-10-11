api_call = new XMLHttpRequest();
api_call.onreadystatechange = handleStateChange;
url = "https://blooming-anchorage-23601.herokuapp.com/api/v1/skips?yt_id=";
var videoId;
// url = "https://blooming-anchorage-23601.herokuapp.com/api/v1/skips?yt_id=jasflkdioejf";
// api_call.open("GET", url, true);
// api_call.send();
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

var getVideoId = setInterval(function(){
	container = document.getElementsByClassName("style-scope ytd-page-manager hide-skeleton");
	if(container.length > 0){
		videoId = container[0].getAttribute("video-id");
		url = url+videoId;
		api_call.open("GET", url, true);
		api_call.send();
		clearInterval(getVideoId);
	}
}, 500);

var addSkipButton = setInterval(function(){
	// console.log("In the interval");
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
		clearInterval(addSkipButton);
		return;
	}
}, 500);

var skipper = setInterval(function (){
	// // console.log("In this one");
	if(typeof document.getElementById("movie_player").getCurrentTime == 'function'){
		curTime = document.getElementById("movie_player").getCurrentTime();
		for(var time of skip_times){
			if(curTime >= time.start && curTime <= time.end){
				skip_butt = document.getElementById('skip_button')
				skip_butt.style = "display: block; opacity 1;";
				skip_butt.addEventListener('click', function(){
					document.getElementById("movie_player").seekTo(time.end, true);
					skip_butt.style = "display: none; opacity 1;";
				}, once=true);
				break;
			} else {
				document.getElementById('skip_button').style = "display: none; opacity 1;";
			}
		}
	}
}, 500);

var markVideoMenuButton = setInterval(function(){
	contextMenu = document.getElementsByClassName("ytp-popup ytp-contextmenu");
	// console.log("Trying to place the button");
	if (contextMenu.length === 1){
		console.log("The menu exists! Placing button");

		ytplayer = document.getElementById("movie_player");

		var startTime;

		var outer = document.createElement('div');
		outer.classList = "ytp-menuitem";
		outer.id = "context-butt";
		outer.addEventListener('click', function(){
			ytplayer = document.getElementById("movie_player");
			if (startTime == null){
					startTime = ytplayer.getCurrentTime();
					// alert("Marking " + startTime + " time as start of non-content")
					inner1.innerText = "Mark as end";
			}
			else{
					endTime = ytplayer.getCurrentTime();
					// alert("Marking " + endTime + " time as end of non-content")

					// Can now send both times to the server
					confirmation = confirm("Sending to server\nVideo ID: " + videoId + "\nStart: " + startTime + "\n End: " + endTime);
					if(confirmation == true){
						postToAPI = new XMLHttpRequest();
						postToAPI.open("POST", "https://blooming-anchorage-23601.herokuapp.com/api/v1/skips", true);
						postToAPI.setRequestHeader("Content-Type", "application/json");
						postToAPI.send(JSON.stringify({"start_time": startTime, "end_time": endTime, "user": "test", "yt_id": videoId}));
					}

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