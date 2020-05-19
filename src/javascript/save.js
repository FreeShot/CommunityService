Config.saves.version = 1;

Config.saves.isAllowed = () => !Story.get(State.passage).tags.includes("noSave");
Config.saves.autosave = () => Story.get(State.passage).tags.includes("Save");