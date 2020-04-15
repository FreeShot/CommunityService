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
                feminity: 0,
                looks: {
                	hair: {color: "Brunette", length: 0}
                },
                stamina: {current : 10, max : 10},
                currentRoom: "PlayerBdRm",
                arrousal : 0,
                submission : 0,
                appearance : 0,
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

	get gender() {
		if (this.feminity > 50) {
			return "female";
		}
		return "male";
	}

	get getColor() {
		if (this.feminity > this.gradiant.length - 1) {this.feminity = this.gradiant.length - 1;}
		return this.gradiant[this.feminity];
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