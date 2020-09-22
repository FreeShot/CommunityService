$(document).on(':passageend', function (ev) {
	console.log(State.variables.time);
	State.variables.time.generateClock();
});

/*Config.saves.isAllowed = () => {
	!Story.get(State.passage).tags.includes("nosave")
}*/