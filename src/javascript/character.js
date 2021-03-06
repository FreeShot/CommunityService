window.ClothesSlots = ["wig", "shirt", "pants", "underwear", "bra", "hoisery", "shoe", "accessory-head", "accessory-neck", "toy-front", "toy-back"];

function createNPC(gender) {
	// Creates the values for a random npc of specified gender

	// TODO CLEAN UP THIS MESS
	// Note from 03/07/2020 --> I really really don't wanna, but I'll have to do it soonish
	// Note from 25/07/2020 --> Still don't want, what am I doing with my life
	// Note from 18/09/2020 --> Still no, but I really feel like it's the next thing I have to do

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
	constructor(config) {
		this.name = "";
		this.title = "";
		this.color = {};

		Object.keys(config).forEach((pn) => this[pn] = clone(config[pn]));
	}

	speak(text) {
		return Character.speakAnonymous(text, this.colorTheme());
	}

	colorTheme(index) {
		//console.log( this.color[settings.theme.substring(6)]);
		var color = this.color[settings.theme.substring(6)] || this.color["theme-dark"];
		if (typeof color === "string")
			return color
		else return color[index];
	}

	static speakAnonymous(text, color) {
		return `<span class="speachBox" style="color:${color};">"${text}"</span>`;
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

class NPC extends  Character {
	// Class for the major npc
	constructor(config) {
		super(Object.assign({
			schedule: new Schedule(),
			path: [],
			appreciation: 0,
			displayPos: false
		}, config));
	}

	getSidebar() {
		function isDark(c) {
			var c = c.substring(1);      // strip #
			var rgb = parseInt(c, 16);   // convert rrggbb to decimal
			var r = (rgb >> 16) & 0xff;  // extract red
			var g = (rgb >>  8) & 0xff;  // extract green
			var b = (rgb >>  0) & 0xff;  // extract blue

			var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709

			return luma < 40;
		}
		return `<tr style="color:${this.colorTheme()};"><td>${this.name}</td><td>${this.schedule.estimateLoc()}</td><div class="tooltip"><div class="tooltip-content" style="background-color:${this.colorTheme()};color:${isDark(this.colorTheme()) ? "#FFFFFF" : "#000000"}"><<set $pPassage to "<<set _npc to '${this.name}'>>">><<include "infoCharacter">></div></div></tr>`
	}

	addAppreciation(val) {
		// changes how much a npc likes you. Values beteween -100 and 100
		this.appreciation = Math.clamp(this.appreciation + val, -100, 100);
	}

	getAppreciation() {
		// Returns string for displaying how much an npc likes you
		return `<<scale ${this.appreciation} ${-100} ${100}>><</scale>>`;
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
			title: "servant",
			femName: "Alice",
			color: {
				"dark" : [[53,124,217], [223,121,189]]
			},
			femininity: 0,
			appearance: 0,
			submission: 0,
			boldness: 0,
			voice: {
				current: 0,
				absolute: 0
			},
			stamina: {
				current: 100,
				max: 100
			},
			arousal: {
				current: 0,
				max: 100
			},
			currRoom: "PlayerBdRm",
			lastRoom: "PlayerBdRm",
			choresLate: 0,
			debt: 23456,
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
			},
			weeksFailed: 0
		}, config));
	}

	moveTime() {
		var time = (pathfind.path(this.lastRoom, this.currRoom).length - 1) * 5;
		State.variables.time.addTime({minute: time});
		this.lastRoom = this.currRoom;
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

	getArousalBar() {
		return `<<scale ${this.arousal.current} ${0} ${this.arousal.max}>><</scale>>`
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

	// Returns the arousal bar for the player
	getArousalBar() {
		return `<<scale ${this.arousal.current} ${0} ${this.arousal.max}>><</scale>>`
	}

	// Adds some of the arousal to the player
	increaseArousal(amnt) {
		this.arousal.current = Math.min(this.arousal.current + (amnt || this.arousal.max), this.arousal.max);
	}

	// Uses some of the arousal
	decreaseArousal(amnt) {
		this.arousal.current = Math.max(this.arousal.current - amnt, 0);
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
		var ratio = this.femininity / 100;
		console.log(ratio);

		function pickHex(color1, color2, weight) {
			var w1 = (weight * 2) /2;
			var w2 = 1 - w1;
			return color1.map((col, i) => col * w2 + color2[i] * w1);
		}

		return pickHex(this.colorTheme(0), this.colorTheme(1), ratio);
	}

	// Makes the character speak
	speak(text) {
		var color = this.getColor;
		return Character.speakAnonymous(text, `rgb(${color[0]},${color[1]},${color[2]})`);
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
	constructor(values) {
		super(values);
	}

	// Gets how many points this npc gives
	getBonusPoint() {
		// TODO
		return 0;
		return tageval(this.like, el.data, el.expected) * 5;
	}

	// For twine
	clone() {
		return new MinorNPC(this);
	}

	// For twine
	toJSON() {
        var ownData = {};
        Object.keys(this).forEach(function (pn) {
            ownData[pn] = clone(this[pn]);
        }, this);
        return JSON.reviveWrapper('new MinorNPC($ReviveData$)', ownData);
	}
}
// Addst MinorNPC to window
Object.defineProperty(window, 'MinorNPC', {
	value: MinorNPC
});

window.npc = {
	baseNPC : {
		gender: "male",
		title: "Mr",
		name: "James",
		lastName: "Walls",
		age: 50,
		like: {tag: "count", data: [], expected: true},
		color: {light: "#FFFFFF", dark: "#FFFFFF"}
	},
	generateNPC: function(gender) {
		var npc = this.baseNPC;
		npc.gender = gender ? "male" : "female";
		npc.title = gender ? "Mr" : "Mrs";
		npc.name = (gender ? ["James", "Joseff", "Jack", "John", "Hugo", "Leo", "Vincent"] : ["Lea", "Marie", "Aurora", "Fiona", "Maeve", "Jade", "Amber", "Liya", "Velma", "Nana"]).random()
		npc.lastName = ["Walls", "Barker", "O'Connor", "Thomas", "Short", "Beard", "Simon", "Knott", "Robins", "Moody", "Cullen", "Morris", "Dilon"].random();
		npc.age = Math.floor(State.random() * 30) + 20;

		var tags = [
			{tag: "bodyPart", data: {bodyPart: "hairLength", value: 0}, expected: true},
			{tag: "bodyPart", data: {bodyPart: "hairLength", value: 1}, expected: true},
			{tag: "bodyPart", data: {bodyPart: "hairLength", value: 2}, expected: true},
			{tag: "bodyPart", data: {bodyPart: "hairColor", value: 0}, expected: true},
			{tag: "bodyPart", data: {bodyPart: "hairColor", value: 1}, expected: true},
			{tag: "bodyPart", data: {bodyPart: "hairColor", value: 2}, expected: true},
			{tag: "bodyPart", data: {bodyPart: "hairColor", value: 3}, expected: true},
			{tag: "bodyPart", data: {bodyPart: "eyeColor", value: 0}, expected: true},
			{tag: "bodyPart", data: {bodyPart: "eyeColor", value: 1}, expected: true},
			{tag: "bodyPart", data: {bodyPart: "eyeColor", value: 2}, expected: true},
		];

		npc.like.data = tags.filter((tag) => State.random() < 0.3); // TODO

		npc.color.light = this.getColor();
		npc.color.dark = npc.color.light;
		return npc
	},
	getColor: function() {
		var letters = '0123456789ABCDEF'.split('');
    	var color = '#';
    	for (var i = 0; i < 6; i++ ) {
    	    color += letters[Math.round(Math.random() * letters.length - 1)];
    	}
    	return color;
	},
	createNPC: function(list, activeNPC, nb) {
		if (settings.maxNPC <= list.length || (list.length > 1 && State.random() > 0.5)) {
			var index = Math.floor(State.random() * list.length);
			if (!activeNPC.includes(index)) {
				activeNPC.push(index);
			} else {
				this.createNPC(list, activeNPC, nb / settings.npcPerEvent < 0.5);
			}
		} else {
			do {
				var values = this.generateNPC(State.random() > 0.5);
			} while (State.variables.minorNPC.find((el) => el.title === values.title))
			list.push(new MinorNPC(values));
			activeNPC.push(list.length - 1);
		}
	}
}
