class Mansion {
	constructor(config) {
		this.rooms = {};
		this.events = {};
		this.currentEvent = new Event({});

		Object.keys(config).forEach(function (key) {
			this[key] = clone(config[key]);
		}, this);
	}

	addChore(room, chore) {
		this.rooms[room].addChore(chore);
	}

	chooseChores(min, max) {
		var max = max || 7;
		var min = min || 5;

		function random(min, max) {
			return Math.floor(Math.random() * (max - min) + min);
		}

		for (var choreCount = random(min, max); choreCount > 0; choreCount--) {
			var room = Object.values(this.rooms)[random(0, Object.values(this.rooms).length - 1)];
			room.chores[random(0, room.chores.length - 1)].todo = true;
			this.rooms[room.id] = room;
		}
	}

	resetChores() {
		return Object.keys(this.rooms).reduce((missed, room) => missed + this.rooms[room].chores.reduce((m, chore) => m + chore.reset(), 0), 0)
	}

	addEvent(category, event) {
		if (this.events[category]) this.events[category].push(event);
		else this.events[category] = [event];
	}

	displayChores(canDoChores, filterDone) {
		return Object.values(this.rooms).reduce((str, room) => str + room.displayChores(canDoChores && this.currentEvent.name === "", filterDone, true), "") || "No chores now"
	}

	checkEvent(trigger) {
		var playEvent = undefined;
		var events = this.events;
		["specialEvent"].concat(trigger || []).find(function(category) {
				playEvent = events[category] ? events[category].find((event) => event.active) : undefined
		});
		return playEvent
	}

	clone() {
        return new Mansion(this);
    }

	toJSON() {
        var ownData = {};
        Object.keys(this).forEach(function (pn) {
            ownData[pn] = clone(this[pn]);
        }, this);
        return JSON.reviveWrapper('new Mansion($ReviveData$)', ownData);
	}
}
Object.defineProperty(window, 'Mansion', {
    value : Mansion
});