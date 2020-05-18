window.ClothesSlots = ["wig", "shirt", "pants", "underwear", "bra", "hoisery", "shoe", "accessory-head", "accessory-neck", "toy-front", "toy-back"];

function createNPC(gender) {
	// Creates the values for a random npc of specified gender

	// TODO CLEAN UP THIS MESS
	var values = {};

	values["gender"] = (gender) ? 'male' : 'female';
	values["title"] = (gender) ? "Mr" : "Mrs";

	var names;
	if (gender)
		names = ["James", "Joseff", "Jack", "John", "Hugo", "Leo", "Vincent"];
	else
		names = ["Lea", "Marie", "Aurora", "Fiona", "Maeve", "Jade", "Amber", "Liya", "Velma", "Nana"];
	var lastName = ["Walls", "Barker", "O'Connor", "Thomas", "Short", "Beard", "Simon", "Knott", "Robins", "Moody", "Cullen", "Morris", "Dilon"];

	var index = Math.floor(State.random() * names.length);
	values["name"] = names[index];

	index = Math.floor(State.random() * lastName.length);
	lastName = lastName[index];
	values["name"] += " " + lastName;
	values["title"] += " " + lastName;

	values["age"] = Math.floor(State.random() * 30) + 20;

	values["like"] = Object.keys(State.variables.npcLike).filter(function(el) {
		return State.random() < 2 / (Object.keys(State.variables.npcLike).length);
	});

	values["appreciation"] = 0;
	values["color"] = {};
	values["color"]["light"] = `#${(State.random() * 0xFFFFFF << 0).toString(16)}`;
	values["color"]["dark"] = values["color"]["light"];
	return values;
}

class Character {
	// Base class for npc
	constructor(config) {
		this.name = '';
		this.title = '';
		this.currentRoom = '';
		this.color = {};

		Object.keys(config).forEach((pn) => this[pn] = clone(config[pn]), this);
	}

	// Displays the speach buble for the npc
	speak(text) {
		return Character.speakAnonymous(text, this.colorTheme)
	}

	// Gets the color for the selected theme
	get colorTheme() {
		return settings.theme === "theme-dark" ? this.color["dark"] : this.color["light"]
	}

	// Speach function. Color is optionnal and allows to display in a specific color if given
	static speakAnonymous(text, color) {
		return `<span class="speak" style="color:${color};">"${text}"</span>`
	}

	// Used by twine
	clone() {
		return new Character(this);
	}

	// Used by twine
	toJSON() {
        var ownData = {};
        Object.keys(this).forEach(function (pn) {
            ownData[pn] = clone(this[pn]);
        }, this);
        return JSON.reviveWrapper('new Character($ReviveData$)', ownData);
	}
}
// Add Character class to the window
Object.defineProperty(window, 'Character', {
	value: Character
});

class NPC extends Character {
	// Class for the major npc
	constructor(config) {
		super(Object.assign({
			schedule: [{
				days: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
				location: "",
				start: {
					hour: 0,
					minute: 0
				},
				end: {
					hour: 24,
					minute: 0
				}
			}],
			appreciation: 0
		}, config));
	}

	addAppreciation(val) {
		// changes how much a npc likes you. Values beteween -100 and 100
		this.appreciation = Math.clamp(this.appreciation + val, -100, 100);
	}

	getAppreciation() {
		// Returns string for displaying how much an npc likes you
		return `<<scale ${this.appreciation} ${-100} ${100}>><</scale>>`;
	}

	get getLocation() {
		// Returns the current location of the npc, takes use of the current time.
		var schedule = this.schedule.find(
			(ev) => ev.days.includes(State.variables.time.weekDayFormat.slice(0, 2)) && State.variables.time.inInterval(ev.start, ev.end));
		return schedule ? schedule.location : "";
	}

	// Used by twine
	clone() {
		return new NPC(this);
	}

	// Used by twine
	toJSON() {
        var ownData = {};
        Object.keys(this).forEach(function (pn) {
            ownData[pn] = clone(this[pn]);
        }, this);
        return JSON.reviveWrapper('new NPC($ReviveData$)', ownData);
	}
}
// Adds NPC to the window
Object.defineProperty(window, 'NPC', {
	value: NPC
});


class Player extends Character {
	// Player's class
	constructor(config) {
		super(Object.assign({
			name: "Alex",
			title: "Alex",
			femName: "Alice",
			femininity: 0,
			voice: {
				current: 0,
				absolute: 0
			},
			stamina: {
				current: 10,
				max: 10
			},
			currentRoom: "PlayerBdRm",
			choresLate: 0,
			money: 0,
			bodyPart: {
				"hairColor": 0,
				"hairLength": 0,
				"eyeColor": 0
			},
			bodyHair: 0,
			inv: new Inventory({
				name: "Player Inventory"
			}),
			stats: {
				serving: {level:1, xp: 0},
				cleaning: {level:1, xp: 0},
				fitness: {level:1, xp: 0}
			}
		}, config));
	}

	// Equips item of name 'itemName'. If bypassFemininty is true, skips the check for femininity (usefull for events)
	equip(itemName, bypassFeminity) {
		var index = this.inv.items.findIndex((el) => el.item.name === itemName);
		// Makes sure that the femininity is not too low
		if (bypassFeminity || this.inv.items[index].item.femininity <= this.femininity) {
			this.inv.items[index].item.removeTag("equippable");
			var tags = this.inv.items[index].item.tags;
			// Might have to prefiler the tags (ie remove any tags that are special)
			this.inv.items.filter((el) =>
				el.item.tags.some((tag) => tags.includes(tag) && ClothesSlots.includes(tag)))
					.filter((el) => el.item.tags.includes("equipped"))
					.forEach((el) => {
						el.item.addTag("equippable");
						el.item.removeTag("equipped");
					});
			this.inv.items[index].item.addTag("equipped");
		}
	}

	levelUp(stat, amnt) {
		this.stats[stat].xp += amnt;
		while (this.stats[stat].xp > 25 * this.stats[stat].level) {
			this.stats[stat].xp -= 25 * this.stats[stat].level;
			this.stats[stat].level++;
		}
	}

	getStat(stat) {
		return this.stats[stat].level;
	}

	getStatBar(stat) {
		return `<<scale ${this.stats[stat].xp} ${0} ${25 * this.stats[stat].level}>><</scale>>`
	}

	// Unequips items. ItemName can be either specific item or All. If all, unequips all of the items but the ones with a tag in bl.
	unequip(itemName, bl) {
		if (itemName === "All") {
			// Unequips all of the items
			this.inv.items.forEach((el) => {
				if (el.item.tags.includes("equipped") && !el.item.tags.some((tag) => (bl || []).includes(tag))) 
					this.unequip(el.item.name);
			}, this);
		} else {
			var index = this.inv.items.findIndex(
				(el) => el.item.name === itemName || (el.item.tags.includes(itemName) && el.item.tags.includes("equipped")));
			if (index === -1) return undefined;
			this.inv.items[index].item.removeTag("equipped");
			this.inv.items[index].item.addTag("equippable");
		}
	}

	// Shaves the player using the item 'item'
	shave(item) {
		if (item.tags.includes("razor")) {
			this.bodyHair += item.efficiency;
			if (this.bodyHair > 1) 
				this.bodyHair--;
		}
	}

	// Grows the player's body hairs
	growHair() {
		this.bodyHair.current -= this.bodyHair.growthSpeed.current;
		this.bodyHair.growthSpeed.current = this.bodyHair.growthSpeed.absolute;
	}

	// Returns the stamina bar for the player
	getStaminaBar() {
		return `<<scale ${this.stamina.current} ${0} ${this.stamina.max}>><</scale>>`
	}

	// Checks if the player has enough stamina
	hasEnoughStamina(cost) {
		return this.stamina.current >= cost;
	}

	// Adds some of the stamina to the player
	rest(amnt) {
		this.stamina.current = Math.min(this.stamina.current + (amnt || this.stamina.max), this.stamina.max);
	}

	// Uses some of the stamina
	useStamina(amnt) {
		this.stamina.current = Math.max(this.stamina.current - amnt, 0);
	}

	// Returns the description of the bodypart
	getDesc(bodyPart) {
		return State.variables.bodyPart.desc[bodyPart][this.bodyPart[bodyPart] || 0];
	}

	// Returns false if no equipped item fit the tags, the first found item if found
	hasEquipped(tags) {
		if (typeof(tags) !== Array)
			tags = [tags, "equipped"];
		else if (!tags.includes["equipped"]) tags.push("equipped");
		var item = this.inv.items.filter((el) => tags.every((tag) => el.item.tags.includes(tag)))
		return item.length > 0 ? item[0].item.name : false;
	}

	// Returns which body part hides said bodypart
	hiddenBy(bodyPart) {
		switch (bodyPart) {
			case "hair":
				return ["wig"];
			case "chest":
				return ["shirt", "bra"];
			case "crotch":
				return ["pants", "underwear"];
			case "legs":
				return ["pants", "hoisery"];
			default:
				return [];
		}
	}

	// returns this items hiding said bodyPart
	isHidden(bodyPart) {
		var bodyPart = this.hiddenBy(bodyPart).filter((el) => this.hasEquipped(el), this)
		if (bodyPart.length > 0)
			return this.hasEquipped(bodyPart[0]);
		return undefined;
	}

	// Returns the gender of the npc
	get gender() {
		if (this.femininity > 50)
			return "female";
		return "male";
	}

	// Raises the voice by amount
	raiseVoice(amnt) {
		this.voice.current = amnt.tmp;
		this.voice.absolute += amnt.abs;
	}

	// Returns the hair color
	get getHairColor() {
		return this.isHidden("hair") ? this.inv.filter(["wig", "equipped"]).color : this.getDesc("hairColor");
	}

	// Returns the hair length
	get getHairLength() {
		return this.isHidden("hair") ? this.inv.filter(["wig", "equipped"]).length : this.getDesc("hairLength");
	}

	// Returns the voice color (TO BE CHANGED)
	get getColor() {
		return State.variables.bluePinkGradient[Math.min(this.voice.current, State.variables.bluePinkGradient.length - 1)];
	}

	// Makes the character speak
	speak(text) {
		return Character.speakAnonymous(text, this.getColor);
	}

	// For twine
	clone() {
		return new Player(this);
	}

	// For twine
	toJSON() {
        var ownData = {};
        Object.keys(this).forEach(function (pn) {
            ownData[pn] = clone(this[pn]);
        }, this);
        return JSON.reviveWrapper('new Player($ReviveData$)', ownData);
	}
}
// adds player to window
Object.defineProperty(window, 'Player', {
	value: Player
});

class MinorNPC extends Character {
	// Minor npc generated for events
	constructor() {
		do {
		var values = createNPC();
		} while (State.variables.minorNPC.find((el) => el.title === values.title))

		super(values);
	}

	// Gets how many points this npc gives
	getBonusPoint() {
		return this.like.reduce((val, el) => val + State.variables.npcLike[el]() ? 5 : 0, 0);
	}

	// For twine
	clone() {
		return new MinorNPC(this);
	}

	// For twine
	toJSON() {
		return JSON.reviveWrapper('new Player($ReviveData$)', Object.keys(this).reduce((data, pn) => data[pn] = clone(this[pn]), this));
	}
}
// Addst MinorNPC to window
Object.defineProperty(window, 'MinorNPC', {
	value: MinorNPC
});

// updates the list and active npc with some new npc
window.generateNPC = function(list, activeNPC, nb) {
	if (settings.maxNPC <= list.length || (list.length > 1 && State.random() > 0.5)) {
		var index = Math.floor(State.random() * list.length);
		if (!activeNPC.includes(index)) {
			activeNPC.push(index);
		} else {
			generateNPC(list, activeNPC, nb / settings.npcPerEvent < 0.5);
		}
	} else {
		list.push(new MinorNPC());
		activeNPC.push(list.length - 1);
	}
}