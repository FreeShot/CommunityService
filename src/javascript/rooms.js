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
		this.events.sort(function(a, b) {
			if (a.priority > b.priority) return -1;
			else if (a.priority === b.priority) return 0;
			else return 1;
		});
	}

	removeEvent(eventName) {
		this.events = this.events.filter(function(em) {return em.name != eventName});
	}

	getEvent() {
		var activeEvents = Array.from(this.events);
		activeEvents = activeEvents.filter(function(el) {
			return el.active(); // filters events with an active tag
		});
		if (activeEvents.length > 0) {
			var totalWeight = 0;
			activeEvents.forEach(function(el) {
				totalWeight += 1 << el.priority;
			});

			var i = 0;
			for (var eventPicked = Math.floor(State.random() * totalWeight); eventPicked > 0; eventPicked -= 1 << activeEvents[i].priority) {
				i++;
			}
			return activeEvents[i].playEvent(true);
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

		var str = "<span class='estateRoom'>" + this.name + "<br>";

		return str + (imgIndex < this.img.length ? "[img[" + this.getImgPath(imgIndex) + "]]</span>" : "</span>");
	}

	generatePassage() {
		var str = "";
		str += this.display(0) + "<br>";
		str += this.getEvent();
		str += "<br>Chores: ";
		str += this.displayChores(undefined, State.variables.mansion.currentEvent === "");
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
			return "<<link \"" + this.name + "\" \"" + this.id + "\">><<set $player.currentRoom to \"" + this.id + "\">><</link>>";
		} else {
			return "<<link \"" + this.name + "\" \"RoomDescription\">><<set $player.currentRoom to \"" + this.id + "\">><</link>>";
		}
	}

	displayChores(displayTitle, canDoChores, filterDone) {
		if (this.chores.length > 0) {
			var title = ((displayTitle || true) ? this.name : "") + "<ol>";
			var str = "";
			for (var i = 0; i < this.chores.length; i++) {
				var chore = this.chores[i].do(canDoChores, filterDone);
				if (chore != "") {
					str += "<li>" + chore + "</li>";
				}
			}
			if (str === "") {return str;}
			return title + str + "</ol>";
		} else {
			return "";
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