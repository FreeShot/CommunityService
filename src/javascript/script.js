// Adds Icons
importScripts("https://kit.fontawesome.com/7a29cd6e9e.js");
importScripts("https://leaverou.github.io/stretchy/stretchy.min.js");

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
		if (!ev.passage.tags.includes('mainMenu')) {
			State.variables.exitMenu = ev.passage.title;
		}
		//State.variables.exitMenu = ev.passage.title;
	}
});

Setting.addToggle("nsfw", {
	label    : "Displays NSFW images",
	default  : true
});