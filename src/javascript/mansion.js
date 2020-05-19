class Mansion {
	constructor(config) {
		this.rooms = [];
		this.events = []; // Special Events
		this.currentEvent = "";
		this.choresGroup = {};

		if (config != {}) {
			Object.keys(config).forEach(function (pn) {
        	    this[pn] = clone(config[pn]);
        	}, this);
		}
	}

	endEvent() {
		this.currentEvent = "";
	}

	findRoom(roomID) {
		return this.rooms.find((element) => element.id === roomID);
	}

	display(roomID, imgIndex) {
		return this.findRoom(roomID).display(imgIndex);
	}

	describeRoom(roomID) {
		return this.findRoom(roomID).generatePassage();
	}

	displayChores(canDoChores, filterDone, short) {
		var str = "<ol>";
		var hasChores = false;
		for (var i = 0; i < this.rooms.length; i++) {
			var roomChores = this.rooms[i].displayChores(undefined, canDoChores && this.currentEvent == "", filterDone, short || false);
			if (roomChores != undefined && roomChores !== "") {
				str += roomChores;
				hasChores = true;
			}
		}
		return hasChores ? (`${str}</ol>`) : "No chores right now !!";
	}

	addRoom(room) {
		this.rooms.push(room);
	}

	addChore(roomID, chore, groups) {
		var groups = groups || ["default"]; 
		groups.forEach(function(group) {
			if (this.choresGroup[group] !== undefined)
				this.choresGroup[group].push({name: chore.name, room: roomID});
			else
				this.choresGroup[group] = [{name: chore.name, room: roomID}];
		}, this);
		this.findRoom(roomID).addChore(chore.clone());
	}

	resetChores() {
		this.rooms.forEach(
		    function(room) {room.resetChores()}
		);
		var i = Object.keys(this.choresGroup)[Math.floor(State.random() * Object.keys(this.choresGroup).length)];
		this.choresGroup[i].forEach(function(chore) {
			this.findRoom(chore.room).chores.find(function(c) {return c.name === chore.name}).todo |= true;
		}, this);
		var j = i; 
		while (j === i) 
			j = Object.keys(this.choresGroup)[Math.floor(State.random() * Object.keys(this.choresGroup).length)];
		this.choresGroup[j].forEach(function(chore) {
			this.findRoom(chore.room).chores.find(function(c) {return c.name === chore.name}).todo |= State.random() > 0.5;
		}, this);
	}

	addEvent(roomID, event) {
		if (roomID === "specialEvent") {
			event.room = roomID;
			this.events.push(event);
		} else {
			this.findRoom(roomID).addEvent(event.clone());
		}
	}

	removeEvent(roomID, eventName) {
		if (roomID === "specialEvent")
			this.events = this.events.filter((em) => em.name !== eventName);
		else
			this.findRoom(roomID).events.filter((em) => em.name !== eventName);
	}

	checkSpecialEvents() {
		return this.events.reduce((str, ev) => ev.active() ? str += ev.playEvent() : str, "");
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