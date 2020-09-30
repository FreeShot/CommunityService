Config.saves.version = 0;
Config.saves.slots = 8;
Config.history.maxStates = 1;

Config.saves.onLoad = function (save) {
	return save;
}

Config.saves.onSave = function (save, details) {
	return save;
};