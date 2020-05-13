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
Setting.addList("npcPerEvent", {
	label: "Number of npc per events.",
	list: [5, 6, 7, 8, 9, 10],
	default: 5
});
Setting.addList("remeberLastEvents", {
	label: "How many events to store (More means the game is more forgiving).",
	desc: "Avoid changing during the game as it may cause some inbala",
	list: [1, 2, 3, 4, 5, 6],
	default: 1,
	onInit: function() {
		State.variables.lastEvents = {
			CParty : [100],
			mean : function(event) {
				return State.variables.lastEvents[event].reduce(function(total, curr) {
					return total + curr;
				}) / State.variables.lastEvents[event].length;
			}
		};
	}
});


Setting.addHeader("Misc", "For all the settings that don't have their place in other parts");
Setting.addToggle("nsfw", {
	label    : "Displays NSFW images",
	default  : true
});