class Mansion {
	constructor(config) {
		this.rooms = [];

		if (config != {}) {
			Object.keys(config).forEach(function (pn) {
        	    this[pn] = clone(config[pn]);
        	}, this);
		}
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
		for (var i = 0; i < this.rooms.length; i++) {
			var roomChores = this.rooms[i].displayChores();
			if (roomChores != undefined) {
				str += "<li>" + roomChores  + "</li>";
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