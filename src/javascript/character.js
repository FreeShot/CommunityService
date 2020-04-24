class Character {
	constructor(config) {
		this.name = '';
		this.title = '';
		this.currentRoom = '';
		this.color = '';

		Object.keys(config).forEach(function (pn) {
            this[pn] = clone(config[pn]);
        }, this);
	}

	speak(text) {
		return Character.speakAnonymous(text, this.color);
	}

	static speakAnonymous(text, color) {
		return String.format(
			'<span class="speak" style="color:{0};">"{1}"</span>',
			color,
			text
		);
	}

	clone() {
        return new Character(this);
    }

	toJSON() {
        var ownData = {};
        Object.keys(this).forEach(function (pn) {
            ownData[pn] = clone(this[pn]);
        }, this);
        return JSON.reviveWrapper('new Character($ReviveData$)', ownData);
    }
}
Object.defineProperty(window, 'Character', {
    value : Character
});

class NPC extends Character {
	constructor(config) {
		super(Object.assign(
            {
                schedule : [
                	{
                		days : ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
                		location : "",
                		start : {hour: 0, minute: 0},
                		end : {hour: 24, minute: 0}
                	}
                ],
                acceptance : 0
            }, config));
	}

	get getLocation() {
		var schedule = this.schedule.find(function(ev) {return ev.days.includes(State.variables.time.weekDayFormat.slice(0, 2)) && State.variables.time.inInterval(ev.start, ev.end)});
		if (schedule) {return schedule.location}
		return "";
	}

	clone() {
        return new NPC(this);
    }

	toJSON() {
        var ownData = {};
        Object.keys(this).forEach(function (pn) {
            ownData[pn] = clone(this[pn]);
        }, this);
        return JSON.reviveWrapper('new NPC($ReviveData$)', ownData);
    }
}
Object.defineProperty(window, 'NPC', {
    value : NPC
});


class Player extends Character {
	gradiant = ["#1335A9", "#212EB0", "#3831B5", "#5941BC", "#7852C2", "#9465C7", "#AD78CE", "#C38CD3", "#D4A1DA", "#E0B9DE"];

	constructor(config) {
		super(Object.assign(
            {
                name: "Alex",
                title: "Alex",
                femininity: 0,
                looks: {
                	hairColor: 0,
                	hairLength: 0,
                    eyeColor: 0,
                	face: 0,
                	lips: 0,
                	skin: 0,
                	chest: 0,
                	butt: 0,
                	hips: 0,
                	crotch: 0,
                	legs: 0
                },
                slots: [
                	{name: "wig", equipped: null},
                	{name: "chest", equipped: null},
                	{name: "bra", equipped: null},
                	{name: "underwear", equipped: null},
                	{name: "hoistery", equipped: null},
                	{name: "legs", equipped: null},
                	{name: "feet", equipped: null},
                	{name: "accessory-hair", equipped: null},
                	{name: "accessory-neck", equipped: null},
                	{name: "accessory-ear", equipped: null},
                	{name: "accessory-eye", equipped: null},
                	{name: "toy-front", equipped: null},
                	{name: "toy-back", equipped: null}
                ],
                stamina: {current : 10, max : 10},
                currentRoom: "PlayerBdRm",
                choresLate : 0
        }, config));
	}

	getStaminaBar() {
		var str = "";
		for(var i = 0; i < this.stamina.current; i++) {
			str += "█";
		}
		for(var i = this.stamina.current; i < this.stamina.max; i++) {
			str += "░";
		}
		return str
	}

	hasEnoughStamina(cost) {
		return this.stamina.current >= cost;
	}

	rest() {
		this.stamina.current = this.stamina.max;
	}

	useStamina(amnt) {
		this.stamina.current = Math.max(this.stamina.current - amnt, 0);
	}

	getLook(bodyPart) {
		return State.variables[bodyPart][this.looks[bodyPart]];
	}

    tryDescribe(slot) {
        var s = this.getSlot(slot);
        return s.equipped !== null ? s.equipped.describe(this) : "";
    }

	getSlot(slot) {
		return this.slots.find(function(el) {return el.name == slot});
	}

    hasEquipped(slot) {
        return this.getSlot(slot).equipped != null;
    }

    equipped(slot, item) {
        this.slots.forEach(function (el) {
            if (el.name == slot) {
                el.equipped = item
            }
        });
    }

    describe() {
        var str = String.format(
            "Your name is {0}. <br> {1} <br> {2} <br> {3}",
            this.name,
            this.descFace(),
            this.descBody()
        );
        return str;
    }

    descHair() {
        var wig = this.getSlot("wig").equipped;
        wig = wig === null ? "" : wig.describe();
        return wig === "" ? String.format("You have {0} {1} hairs", this.getLook("hairLength"), this.getLook("hairColor")) : wig; 
    }

    desc

    descEye() {
        var eye = this.getSlot("accessory-eye")
    }

    descFace() {
        var str = "";
        str += this.descHair();
        return str;
    }

    descBody() {
        return "Description of the body";
    }

	get gender() {
		if (this.femininity > 50) {
			return "female";
		}
		return "male";
	}

	get getColor() {
		if (this.femininity > this.gradiant.length - 1) {this.femininity = this.gradiant.length - 1;}
		return this.gradiant[this.femininity];
	}

	speak(text) {
		return Character.speakAnonymous(text, this.getColor);
	}

	clone() {
        return new Player(this);
    }

	toJSON() {
        var ownData = {};
        Object.keys(this).forEach(function (pn) {
            ownData[pn] = clone(this[pn]);
        }, this);
        return JSON.reviveWrapper('new Player($ReviveData$)', ownData);
    }
}
Object.defineProperty(window, 'Player', {
    value : Player
});