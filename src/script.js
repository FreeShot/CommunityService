$(document).on(':passagestart', function (ev) {
	if (!ev.passage.tags.includes('noreturn')) {
		State.variables.return = ev.passage.title;
	}
});

$(document).on(':passagestart', function (ev) {
	if (!ev.passage.tags.includesAny(['mainMenu', 'noreturn'])) {
		State.variables.exitMenu = ev.passage.title;
	}
});