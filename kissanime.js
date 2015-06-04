var URL = window.location.origin

//temporary way to determine if at least user is on KissAnime.
//Need to replace with reg expression to check for specific page type
if (window.location.href.indexOf("kissanime.com/Anime/") == -1) {
       alert("You are not currently on KissAnime");
       //fake function to cause script to terminate
       AbortJavaScript();
}

var episodeLinks = $('table.listing a').map(function(i,el) { return $(el).attr('href'); });
console.log('Found ' + episodeLinks.length + ' episode links on current page.')

$.ajaxSetup({async:false});
$.getScript("http://kissanime.com/Scripts/asp.js");

var startEpisode; 
do {
	startEpisode = prompt("Enter episode number you want to start from:");
	startEpisode = Number(startEpisode);
	if (startEpisode <= 0 || startEpisode > episodeLinks.length) {
		alert("Episode number must be greater than 0 and less than " + episodeLinks.length); 
	} else {
		break; 
	}
} while(true); 
console.log('Starting episode: ' + startEpisode)

var endEpisode; 
do {
	endEpisode = prompt("Enter episode number you want to end at:");
	endEpisode = Number(endEpisode);
	if (endEpisode <= 0 || endEpisode > episodeLinks.length || endEpisode < startEpisode) {
		alert("Episode number must be greater than 0 and less than " + episodeLinks.length);
	} else {
		break;
	}
} while(true); 
console.log('Ending episode: ' + endEpisode)

var videoQuality = prompt("Enter video quality you want to download. Leave blank for default (1280x720.mp4)"); 
//set preferred quality (will choose the best available if not an option)
if (videoQuality === null) {
	videoQuality = '1280x720.mp4';
}

var i;
var long_url;
var newLinks = '';
var c = startEpisode;
for (i = (episodeLinks.length - startEpisode); i >= (episodeLinks.length - endEpisode); i--) {
	jQuery.ajax({
        url:    URL + episodeLinks[i], 
        success: function(result) {
            var $result = eval($(result));
			var stringStart = result.search("var wra"); 
			var stringEnd = result.search("document.write"); 
			var javascriptToExecute = result.substring(stringStart, stringEnd);
			eval(javascriptToExecute);
			
			$("body").append('<div id="episode' + i + '" style="display: none;"></div>')
			$('#episode' + i).append(wra); 
			
			var downloadQualityOptions = $('#episode' + i + ' a').map(function(i,el) { return $(el); });
			var j; 
			for (j = 0; j < downloadQualityOptions.length; j++) {
				if (videoQuality === downloadQualityOptions[j].html()) {
					long_url = downloadQualityOptions[j].attr('href');
				} else if (j === 0) {
					videoQuality = downloadQualityOptions[0].html();
					long_url = downloadQualityOptions[0].attr('href');
				}
			}
			console.log(c);
			newLinks = newLinks + '<a href="' + long_url + '">Episode ' + c + ' (' + videoQuality + ')</a><br></br>\n';
			c++
        },
        async:   false, 
		script:  true
    });
}

var newPageText = 'Use an addon like DownThemAll! to download the episodes on this page at once. '
newPageText += 'To download them individually, right click the link and choose Save As. <br></br>'
newPageText += 'NOTE: If watching episodes from this list, open them in a new tab as you will not be able to come back.<br></br>'
newPageText += newLinks

var newPage = window.open();
newPage.document.body.innerHTML = newPageText