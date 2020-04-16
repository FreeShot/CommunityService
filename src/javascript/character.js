class Inventory {
	constructor(config) {
		this.inventory = {items : [], count : []};
		this.unlimitedSupplies = false;

		Object.keys(config).forEach(function (pn) {
            this[pn] = clone(config[pn]);
        }, this);
	}

	addItem(item, amount) {
		var i = this.inventory.items.findIndex(function(ev) {ev.name == item.name});
		if (i !== -1 && !this.unlimitedSupplies) {
			this.inventory.count[i] += amount || 1;
		} else if (i === -1) {
			this.inventory.items.push(item);
			this.unlimitedSupplies ? this.inventory.count.push(Infinity) : this.inventory.count.push(amount || 1);
		}
	}

	removeItem(item, amount) {
		var i = this.inventory.items.findIndex(function(ev) {ev.name == item.name});
		if (i !== -1 && this.inventory.count[i] >= amount) {
			this.inventory.count[i] -= amount;
			if (this.inventory.count[i] === 0) {
				delete this.inventory.count[i];
				delete this.inventory.items[i];
			}
			return amount;
		} else {
			return -1;
		}
	}

	displayInv() {
		var str = "INVENTORY : \n" 
		var inv = this.inventory;
		console.log(inv);
		if(this.inventory.items.length === 0) {return "No items"} 
		for (var i = 0; i < this.inventory.items.length; i++) {
			str += this.inventory.items[i].name + ": " + this.inventory.count[i] + "<br>";
		}
		return str;
	}

	invGetCount(item) {
		return this.inventory[item];
	}

	clone() {
        return new Inventory(this);
    }

	toJSON() {
        var ownData = {};
        Object.keys(this).forEach(function (pn) {
            ownData[pn] = clone(this[pn]);
        }, this);
        return JSON.reviveWrapper('new Inventory($ReviveData$)', ownData);
    }
}
Object.defineProperty(window, 'Inventory', {
    value : Inventory
});

class Character extends Inventory {
	constructor(config) {
		super(Object.assign(
			{
				name: '',
				title: '',
				currentRoom: '',
				color: ''
			},config));
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
                	hairColor: 0,
                	hairLength: 0,
                	face: 0,
                	lips: 0,
                	skin: 0,
                	chest: 0,
                	butt: 0,
                	hips: 0,
                	crotch: 0,
                	legs: 0
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

	getLook(bodyPart) {
		return State.variables[bodyPart](this.looks[bodyPart]);
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