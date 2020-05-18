window.upgradeSave = function(save) {
	switch (save.version) {
		case 1:
			// Upgrades to version 2
			return save;
		default:
			return null
	}
}

window.downgradeSave = function(save) {
	switch (save.version) {
		case 1:
			return save; // Earliest version
		default:
			return null;
	}
}

Config.saves.version = 1;
Config.saves.slots = 8;
Config.saves.onSave = (save) => {
	save.title = State.passage;
	return save;
};
Config.saves.onLoad = (save) => {
	while (save.version < Config.saves.version)
		upgradeSave(save)
	while (save.version > Config.save.version)
		downgradeSave(save)
	return save;
};
Config.saves.isAllowed = () => !Story.get(State.passage).tags.includes("noSave");
Config.saves.autosave = () => Story.get(State.passage).tags.includes("Save");