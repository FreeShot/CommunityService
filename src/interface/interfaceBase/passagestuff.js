$(document).on(':passageend', function (ev) {
	State.variables.time.generateClock();
});

/*Config.saves.isAllowed = () => {
	!Story.get(State.passage).tags.includes("nosave")
}*/