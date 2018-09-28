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

// assuming skip times come in order
skip_times = [
	{start: 60, end: 600},
	{start: 1200, end: 2036}, 
]

var skipper = setInterval(function (){
	// console.log("In this one");
	ytplayer = document.getElementById("movie_player");
	curTime = ytplayer.getCurrentTime();
	for(var time of skip_times){
		if(curTime >= time.start && curTime <= time.end){
			foo = document.getElementById('skip_button')
			foo.style = "display: block; opacity 1;";
			foo.addEventListener('click', function(){
				ytplayer.seekTo(time.end, true);
				foo.style = "display: none; opacity 1;";
			}, once=true);
			break;
		} else {
			document.getElementById('skip_button').style = "display: none; opacity 1;";
		}
	}
}, 1000);
