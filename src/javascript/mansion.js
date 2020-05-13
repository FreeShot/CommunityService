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
		return this.rooms.find(element => element.id === roomID);
	}

	display(roomID, imgIndex) {
		return this.findRoom(roomID).display(imgIndex);
	}

	describeRoom(roomID) {
		return this.findRoom(roomID).generatePassage();
	}

	displayChores() {
		var str = "<ol>";
		var hasChores = false;
		for (var i = 0; i < this.rooms.length; i++) {
			var roomChores = this.rooms[i].displayChores();
			if (roomChores != undefined && roomChores !== "") {
				str += "<li>" + roomChores  + "</li>";
				hasChores = true;
			}
		}
		return str + "</ol>";
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
		if (roomID === "specialEvent") {
			this.events = this.events.filter(function(em) {return em.name !== eventName});
		} else {
			this.findRoom(roomID).events.filter(function(em) {return em.name !== eventName});
		}
	}

	checkSpecialEvents() {
		return this.events.reduce(
			function (str, ev) {
				if (ev.active()) {return str += ev.playEvent()}
				return str;
			}, "");
	}

	resetChores() {
		for (var i = 0; i < this.rooms.length; i++) {
			this.rooms[i].resetChores();
		}
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