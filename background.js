// chrome.webNavigation.onCommitted.addListener(function(details){
// 	alert("You were about to navigate" + details.url);
// }, {url: [{hostSuffix: 'youtube.com'}]});

// chrome.webNavigation.onCommitted.addListener(function(details){
// 	alert("You were about to navigate" + details.url);
// });
// https://www.youtube.com/watch?v=1Lfv5tUGsn8

function youtube_parser(url){
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    return (match&&match[7].length==11)? match[7] : false;
}

database = {
    '1Lfv5tUGsn8': '60'
}

chrome.webRequest.onBeforeRequest.addListener(
    function(details){
        // alert("You were about to navigate " + details.url);
        // If there's not a tag, redirect
        if(!/\&t=/.test(details.url)){
            videoId = youtube_parser(details.url);
            time = database[videoId];
            return {redirectUrl: details.url+"&t="+time};
        }
        return {redirectUrl: false};
    }, 
    {urls: ["https://www.youtube.com/watch*"]},
    ["blocking"]
);