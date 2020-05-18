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
		this.events.sort((a, b) => {
			if (a.priority > b.priority) return -1;
			else if (a.priority === b.priority) return 0;
			else return 1;
		});
	}

	removeEvent(eventName) {
		this.events = this.events.filter((em) => em.name != eventName);
	}

	getEvent() {
		var activeEvents = Array.from(this.events);
		activeEvents = activeEvents.filter((el) => el.active());
		if (activeEvents.length > 0) {
			var totalWeight = activeEvents.reduce((totalWeight, el) => totalWeight + 1 << el.priority, 0);

			var i = 0;
			for (var eventPicked = Math.floor(State.random() * totalWeight); eventPicked > 0; eventPicked -= 1 << activeEvents[i].priority)
				i++;
			return activeEvents[i].playEvent(true);
		} 
		else
			return "";
	}

	addEventCondition(event, fun) {
		this.events.find((em) => em.name == event).setCondition(fun)
	}

	findChore(choreName) {
		return this.chores.find((el) => el.name === choreName);
	}

	resetChores() {
		for (var i = 0; i < this.chores.length; i++)
			this.chores[i].reset()
	}

	getImgPath(imgIndex) {
		return `${setup.ImagePath}estate/${this.id}/${this.img[imgIndex]}`; 
	}

	display(imgIndex) {
		var imgIndex = imgIndex || 0;
		var str = `<span class='estateRoom'>${this.name}<br>`;
		return str + (imgIndex < this.img.length ? `[img[${this.getImgPath(imgIndex)}]]</span>` : "</span>");
	}

	generatePassage() {
		return `${this.display(0)}<br>${this.getEvent()}<br>Chores: ${this.displayChores(undefined, State.variables.mansion.currentEvent === "", false)}<br>From here, you can go to ${this.getAdjacentRooms()}`;
	}

	getAdjacentRooms() {
		if (this.adjacentRooms.length > 0)
			return this.adjacentRooms.reduce((str, room, i) => `${str}<li>${State.variables.mansion.findRoom(this.adjacentRooms[i]).getPassage()}</li>`, `<ol>`) + "</ol>";
		else
			return "[[Go to your room|PlayerBdRm]]";
	}

	getPassage() {
		return `<<link "${this.name}" "${Story.has(this.id) ? this.id : "RoomDescription"}">><<set $player.currentRoom to "${this.id}">><</link>>`
	}

	displayChores(displayTitle, canDoChores, filterDone) {
		if (this.chores.length > 0) {
			var title = `${((displayTitle || true) ? this.name : "")}<ol>`;
			var str = "";
			for (var i = 0; i < this.chores.length; i++) {
				var chore = this.chores[i].do(canDoChores, filterDone || false);
				if (chore != "")
					str += `<li>${chore}</li>`;
			}
			if (str === "")
				return str
			return `${title}${str}</ol>`
		} else
			return ""
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