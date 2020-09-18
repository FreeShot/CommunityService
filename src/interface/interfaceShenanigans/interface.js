Macro.add("navMenu", {
	skipargs: true,
	tags: [],
	handler: function() {
		$(this.output).wiki(`<button class="nav-button" onclick="navMenu(${this.args[1]})">${this.args[0]}</button>`);
	}
});

window.navMenu = function(increase) {
	State.variables.menu += increase;

	State.variables.menu %= $("#info-display").children().length;
	if (State.variables.menu < 0) State.variables.menu += $("#info-display").children().length;
	$(".ui-menu").addClass("hidden");
	$('.ui-menu:nth-child(' + (State.variables.menu + 1)+ ')').removeClass("hidden");
};