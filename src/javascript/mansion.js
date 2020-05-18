class Mansion {
	constructor(config) {
		this.rooms = [];
		this.events = []; // Special Events
		this.currentEvent = "";

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

	displayChores(canDoChores, filterDone) {
		var str = "<ol>";
		var hasChores = false;
		for (var i = 0; i < this.rooms.length; i++) {
			var roomChores = this.rooms[i].displayChores(undefined, canDoChores && this.currentEvent == "", filterDone);
			if (roomChores != undefined && roomChores !== "") {
				str += `<li>${roomChores}</li>`;
				hasChores = true;
			}
		}
		return hasChores ? (`${str}</ol>`) : "No chores right now !!";
	}

	addRoom(room) {
		this.rooms.push(room);
	}

	addChore(roomID, chore) {
		this.findRoom(roomID).addChore(chore.clone());
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

	resetChores() {
		this.rooms.forEach((el) => el.resetChores())
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