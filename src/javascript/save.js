window.upgradeSave = function(save) {
	switch (save.version) {
		case 1:
			// Upgrades to vertion 2
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
Config.saves.onSave = function (save) {
	save.title = State.passage;
	return save;
};
Config.saves.onLoad = function (save) {
	while (save.version < Config.saves.version) {
		upgradeSave(save);
	}
	while (save.version > Config.save.version) {
		downgradeSave(save);
	}
	return save;
};
Config.saves.isAllowed = function () {
	// Dissalow when passage has tag noSave
	return !Story.get(State.passage).tags.includes("noSave");
};
Config.saves.autosave = function () {
	// Make autosave when passage has tag Save
	return Story.get(State.passage).tags.includes("Save");
}