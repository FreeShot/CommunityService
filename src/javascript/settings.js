Setting.addHeader("NPC", "Anything that influence the generation of NPCs.");
Setting.addList("maxNPC", {
	label: "Maximum of npc to generate.",
	list: [10, 20, 50, 100],
	default: 20,
	onChange: function() {
		if (State.variables.minorNPC.length > settings.maxNPC) {
			State.variables.minorNPC.splice(settings.maxNPC, State.variables.minorNPC.length);
		}
	}
});
Setting.addList("maleNPC", {
	label: "Number of male NPC generated.",
	list: [0, 0.25, 0.5, 0.75, 1],
	default: 0.5
});


Setting.addHeader("Misc", "For all the settings that don't have their place in other parts");
Setting.addToggle("nsfw", {
	label    : "Displays NSFW images",
	default  : true
});