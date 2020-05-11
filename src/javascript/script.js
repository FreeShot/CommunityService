// Adds Icons
importScripts("https://kit.fontawesome.com/7a29cd6e9e.js");
importScripts("https://leaverou.github.io/stretchy/stretchy.min.js");

$(document).on(':passageinit', function (ev) {
	if (settings.nsfw) {
		$("html").removeClass("hidden");	
	} else {
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
	if (ev.passage.tags.includes('eventStart')) { // Stores the last event
		State.variables.mansion.currentEvent = ev.passage.title;
	}
});

Setting.addToggle("nsfw", {
	label    : "Displays NSFW images",
	default  : true
});

Config.passages.onProcess = function (p) {
	var text = (State.variables.pPsgText || '') + p.text + "<br>" + (State.variables.aPsgText || '') +
		(State.variables.debug && !["debug", "nodebug", "init"].some(function(tag) {return p.tags.includes(tag)}) ? "<<include 'debug-passage'>>" : "");
	State.variables.pPsgText = "";
	State.variables.aPsgText = "";
	return text;
};