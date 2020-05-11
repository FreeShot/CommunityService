class Character {
	constructor(config) {
		this.name = '';
        this.givenName = '';
		this.title = '';
		this.currentRoom = '';
		this.color = '';
        this.inv = new Inventory({name: "Inventory", isShop: false})

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
                appreciation : 0
            }, config));
	}

    addAppreciation(val) {
        this.appreciation += val;
        if (this.appreciation > 100) {
            this.appreciation = 100;
        }
        else if (this.appreciation < -100) {
            this.appreciation = -100;
        }
    }

    getAppreciation(){
        return String.format("<<scale {0} {1} {2}>><</scale>>", this.appreciation, -100, 100);
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
	gradient = ["#1335A9", "#212EB0", "#3831B5", "#5941BC", "#7852C2", "#9465C7", "#AD78CE", "#C38CD3", "#D4A1DA", "#E0B9DE"];

	constructor(config) {
		super(Object.assign(
            {
                name: "Alex",
                title: "Alex",
                femName: "Alice",
                femininity: 0,
                voice: {current: 0, absolute: 0},
                stamina: {current : 10, max : 10},
                currentRoom: "PlayerBdRm",
                choresLate : 0,
                money : 0,
                bodyPart: {
                    "hairColor" : 0,
                    "hairLength" : 0,
                    "eyeColor" : 0
                },
                bodyHair: {
                    growthSpeed: {current: 10, absolute: 10},
                    current: 0
                }
        }, config));
	}

    equip(itemName, bypassFeminity) {
        var index = this.inv.items.findIndex(function(el) {
            return el.item.name === itemName;
        });
        // Makes sure that the femininity is not too low
        if (bypassFeminity || this.inv.items[index].item.femininity <= this.femininity) {
            this.inv.items[index].item.removeTag("equippable");
            var tags = this.inv.items[index].item.tags;
            // Might have to prefiler the tags
            this.inv.items.filter(function (el) {
                return el.item.tags.some(function(tag) {
                    return tags.includes(tag) && 
                        !["temp", "equipped", "equippable", "shopItem", "gettable"].includes(tag)
                    })
            }).filter(function (el) {
                return el.item.tags.includes("equipped");
            }).forEach(function(el) {
                el.item.addTag("equippable");
                el.item.removeTag("equipped");
            });
            this.inv.items[index].item.addTag("equipped");
        }
    }

    unequip(itemName, bl) {
        if (itemName === "All") {
            // Unequips all of the items
            this.inv.items.forEach(function(el) {
                if (el.item.tags.includes("equipped") && !el.item.tags.some(function (tag) {return (bl || []).includes(tag)})) this.unequip(el.item.name);
            }, this);
        } else {
            var index = this.inv.items.findIndex(function(el) {
                return el.item.name === itemName || 
                    (el.item.tags.includes(itemName) && el.item.tags.includes("equipped"));
            });
            if (index === -1) return undefined;
            this.inv.items[index].item.removeTag("equipped");
            this.inv.items[index].item.addTag("equippable");
        }
    }

    shave(item) {
        if (item.tags.includes("razor")) {
            this.bodyHair.current += item.efficiency;
            this.bodyHair.growthSpeed.current -= item.efficiency;
            if(this.bodyHair.growthSpeed.current < 1) this.bodyHair.growthSpeed.current = 1;
        }
    }

    growHair() {
        this.bodyHair.current -= this.bodyHair.growthSpeed.current;
        this.bodyHair.growthSpeed.current = this.bodyHair.growthSpeed.absolute;
    }

	getStaminaBar() {
		return String.format("<<scale {0} {1} {2}>><</scale>>", this.stamina.current, 0, this.stamina.max);
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

	getDesc(bodyPart) {
		return State.variables.bodyPart.desc[bodyPart][this.bodyPart[bodyPart] || 0];
	}

    hasEquipped(tags) {
        if (!tags.includes["equipped"]) tags.push("equipped");
        return this.inv.items.filter(function(el) {
            return el.item.tags.some(function(tag) {return tags.includes(tag);});
        }).length > 0;
    }

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

    isHidden(bodyPart) {
        return this.hiddenBy(bodyPart).find(function(slot) {
            var slots = [slot, "equipped"]; 
            var items = this.inv.filter(slots);
            if (items.length === 0) {
                return undefined;
            } else {
                return items[0].item
            }
        }, this);
    }
    
	get gender() {
		if (this.femininity > 50) {
			return "female";
		}
		return "male";
	}

    raiseVoice(amnt) {
        this.voice.current = amnt.tmp;
        this.voice.absolute += amnt.abs;
    }

	get getColor() {
		if (this.voice.current / 10 > this.gradient.length - 1) {this.voice.current = 10 * this.gradient.length - 1;}
		return this.gradient[Math.floor(this.voice.current / 10)];
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