importScripts("https://kit.fontawesome.com/7a29cd6e9e.js");

Config.ui.stowBarInitially = false;

$('#ui-bar-history>#history-forward').before("<button id=\"history-pin\"><i class=\"fas fa-thumbtack\"></i></button>"); // adds lock button
$('#ui-bar-toggle').remove();

$("#history-pin").click(function() {
	$("#ui-bar").toggleClass("active");
	$("#history-pin").toggleClass("active");
});


$(document).on(':passageinit', function (ev) {
	if (settings.nsfw) {
		console.log("NSFW ON");
		$("html").removeClass("hidden");	
	} else {
		console.log("NSFW OFF");
		$("html").addClass("hidden");	
	}
});

$(document).on(':passagestart', function (ev) {
	if (!ev.passage.tags.includes('noreturn')) {
		State.variables.return = ev.passage.title;
		State.variables.exitMenu = ev.passage.title;
	}
	else if (!ev.passage.tags.includes('mainMenu')) {
		State.variables.exitMenu = ev.passage.title;
	}
});

Setting.addToggle("nsfw", {
	label    : "Displays NSFW images",
	default  : true
});