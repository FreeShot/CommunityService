Setting.addHeader("NPC", "Anything that influence the generation of NPCs.");
Setting.addList("maxNPC", {
	label: "Maximum of npc to generate.",
	list: [10, 20, 50, 100],
	default: 20,
	onChange: () => {
		if (State.variables.minorNPC.length > settings.maxNPC)
			State.variables.minorNPC.splice(settings.maxNPC, State.variables.minorNPC.length)
	}
});
Setting.addList("npcPerEvent", {
	label: "Number of npc per events.",
	list: [5, 6, 7, 8, 9, 10],
	default: 5
});
Setting.addList("remeberLastEvents", {
	label: "How many events to store (More means the game is more forgiving).",
	desc: "Avoid changing during the game as it may cause some inbalance",
	list: [1, 2, 3, 4, 5, 6],
	default: 1,
	onInit: () => {
		State.variables.lastEvents = {
			CParty : [100],
			mean : (event) => State.variables.lastEvents[event].reduce((total, curr) => total + curr, 0) / State.variables.lastEvents[event].length
		};
	}
});


Setting.addHeader("Display");
Setting.addList("inventoryRows", {
	label    : "Number of rows in the inventory",
	list: [1, 2, 3, 4, 5],
	default  : 4,
	onInit: () => document.documentElement.style.setProperty("--inventoryRow", settings.inventoryRows),
	onChange: () =>	document.documentElement.style.setProperty("--inventoryRow", settings.inventoryRows)
});

// Setting up a list control for the settings property 'theme' w/ callbacks
var settingThemeHandler = () => {	// cache the jQuery-wrapped <html> element
	var $html = $("html");

	// remove any existing theme class
	$html.removeClass("theme-dark theme-light");

	// switch on the theme name to add the requested theme class
	switch (settings.theme) {
	case "theme-dark":
		$html.addClass("theme-dark");
		break;
	case "theme-light":
		$html.addClass("theme-light");
		break;
	default:
		$html.addClass("theme-dark");
		break;
	}
};
Setting.addList("theme", {
	label    : "Choose a theme.",
	list     : ["theme-dark", "theme-light"], // TODO - add auto switching as an option
	default  : "theme-light",
	onInit   : settingThemeHandler,
	onChange : settingThemeHandler
});


Setting.addHeader("Misc", "For all the settings that don't have their place in other parts");
Setting.addToggle("nsfw", {
	label    : "Displays NSFW images",
	default  : true
});
Setting.addToggle("tips", {
	label    : "Displays the tips",
	default  : true
});
/*
Setting.addToggle("debug", {
	label    : "Displays the debugger",
	default  : false,
	onChange : () => State.variables.debug = settings.debug
});
*/