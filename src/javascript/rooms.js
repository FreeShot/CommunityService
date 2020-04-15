class Room {
	constructor(config) {
		this.name = '';
		this.chores = [];
		this.events = [];
		this.img = [];
		this.id = '';
		this.adjacentRooms = [];

		Object.keys(config).forEach(function (pn) {
            this[pn] = clone(config[pn]);
        }, this);
	}

	addChore(chore) {
		chore.room = this.id;
		this.chores.push(chore);
	}

	addEvent(event) {
		event.room = this.name;
		this.events.push(event);
	}

	getEvent() {
		if (this.events.length > 0) {
			return  this.events[Math.floor(Math.random() * this.events.length)].playEvent(true);
		} else {
			return "";
		}
	}

	addEventCondition(event, fun) {
		this.events.find(function(em) {return em.name == event}).setCondition(fun)
	}

	findChore(choreName) {
		return this.chores.find(element => element.name === choreName);
	}

	resetChores() {
		for (var i = 0; i < this.chores.length; i++) {
			this.chores[i].reset();
		}
	}

	getImgPath(imgIndex) {
		return setup.ImagePath + "estate/" + this.id + "/" + this.img[imgIndex]; 
	}

	display(imgIndex) {
		var imgIndex = imgIndex || 0;

		var str = "<span class='estateRoom'>" + this.name + "</span><br>";

		return str + (imgIndex < this.img.length ? "[img[" + this.getImgPath(imgIndex) + "]]" : "");
	}

	generatePassage() {
		var str = "";
		str += this.display(0) + "<br>";
		str += this.getEvent();
		str += "<br>Chores: ";
		str += this.displayChores();
		str += "<br>From here, you can go to: ";
		str += this.getAdjacentRooms();
		return str;
	}

	getAdjacentRooms() {
		if (this.adjacentRooms.length > 0) {
			var str = "<ol>";
			for (var i = 0; i < this.adjacentRooms.length; i++) {
				str += "<li>" + State.variables.mansion.findRoom(this.adjacentRooms[i]).getPassage() + "</li>";
			}
			return str + "</ol>";
		} else {
			return "[[Go to your room|PlayerBdRm]]";
		}
	}

	getPassage() {
		if (Story.has(this.id)) {
			return "<<link \"" + this.name + "\" \"" + this.id + "\">><<set $player.currentRoom to '" + this.id + "'>><</link>>";
		} else {
			return "<<link \"" + this.name + "\" 'RoomDescription'>><<set $player.currentRoom to '" + this.id + "'>><</link>>";
		}
	}

	displayChores(displayTitle) {
		if (this.chores.length > 0) {
			var str = ((displayTitle || true) ? this.name : "") + "<ol>";
			for (var i = 0; i < this.chores.length; i++) {
				str += "<li>" + this.chores[i].do() + "</li>";
			}
			return str + "</ol>";
		} else {
			return ((displayTitle || true) ? this.name : "You don't have any chores in here.");
		}
	}

	clone() {
        return new Room(this);
    }

	toJSON() {
        var ownData = {};
        Object.keys(this).forEach(function (pn) {
            ownData[pn] = clone(this[pn]);
        }, this);
        return JSON.reviveWrapper('new Room($ReviveData$)', ownData);
	}
}
Object.defineProperty(window, 'Room', {
    value : Room
});