$(document).on(':passageend', function (ev) {
	console.log(State.variables.time);
	State.variables.time.generateClock();
	$(".ui-menu").addClass("hidden");
	$('.ui-menu:nth-child(' + (State.variables.menu + 1) + ')').removeClass("hidden");
});

Config.saves.isAllowed = () => {
	!Story.get(State.passage).tags.includes("nosave")
}