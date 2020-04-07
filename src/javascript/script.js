$(document).on(':passagestart', function (ev) {
	if (!ev.passage.tags.includes('noreturn')) {
		State.variables.return = ev.passage.title;
		State.variables.exitMenu = ev.passage.title;
	}
	else if (!ev.passage.tags.includes('mainMenu')) {
		State.variables.exitMenu = ev.passage.title;
	}
});