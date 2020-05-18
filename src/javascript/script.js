// Adds Icons
//importScripts("https://kit.fontawesome.com/7a29cd6e9e.js");
importScripts("https://leaverou.github.io/stretchy/stretchy.min.js");

$(document).on(':passageinit', (ev) => (settings.nsfw) ? $("html").removeClass("hidden") : $("html").addClass("hidden"));

$(document).on(':passagestart', (ev) => {
	if (!ev.passage.tags.includes('noreturn')) {
		State.variables.return = ev.passage.title;
		if (!ev.passage.tags.includes('mainMenu'))
			State.variables.exitMenu = ev.passage.title;
	}
	if (ev.passage.tags.includes('eventStart')) // Stores the last event
		State.variables.mansion.currentEvent = ev.passage.title;
});

Config.passages.onProcess = (p) => {
	var text = `${State.variables.pPsgText}${p.text}<br>${State.variables.aPsgText}`;
	State.variables.pPsgText = "";
	State.variables.aPsgText = "";
	return text;
};

window.rememberScore = (score, event) => {
	// Stores the new events and forgets an event if it needs to
	while (State.variables.lastEvents[event].length >= settings.rememberLastEvents)
		State.variables.lastEvents[event].shift();
	State.variables.lastEvents[event].push(score);
}

window.process = (str) => Scripting.evalTwineScript(str);