function skipChores() {
	// Checks if the chores are counted during the reset
	return State.variables.time.day === 0 || State.variables.mansion.currentEvent.name !== "";
}

class Chore {
	constructor (config) {
		this.name = '';
		this.duration = {day: 0, hour: 0, minute: 0};
		this.passages = [
			{name: '', weight: 1}
		];
		this.time = {};
		this.img = [];
		this.staminaCost  = 0;
		this.done = true;
		this.todo = false;
		this.days = [0, 1, 2, 3, 4, 5, 6];
		this.room = '';
		this.id = '';
		this.xp = 1;

		Object.keys(config).forEach((pn) => {
            this[pn] = clone(config[pn]);
        }, this);

		this.time = {...this.time, ...{start:{hour: 6, minute: 0}, end:{hour:22, minute:0}}};
	}

	do(canDoChores, filterDone, hidelocation) {
		// Chore is waiting to be reset
		if (skipChores() || (this.done && filterDone) || !this.todo)
			return "";

		var chorebutton;
		if (State.variables.player.currRoom === this.room && !this.done) 
			chorebutton = `<<link "${this.name}" "${this.passage}">><<set $player.levelUp("cleaning", ${this.xp})>><<set $aPsgText to '${State.variables.mansion.rooms[this.room].passage()}'>><<set $player.currRoom="${this.room}">><<set $time.addTime(${JSON.stringify(this.duration)})>><<set $mansion.rooms["${this.room}"].findChore("${this.name}").done = true>><</link>>`
		else if (!canDoChores || this.done)
			chorebutton = this.name;
		else
			chorebutton = State.variables.mansion.rooms[this.room].passage(this.name);

		var status = "";
		if (this.done) status = "DONE";
		else if (!State.variables.player.hasEnoughStamina(this.staminaCost)) status = "TOO TIRED";
		else if (State.variables.time.endsAfter(this.time.end, this.duration) || State.variables.time.compareTime(this.time.start) > 0) status = "WRONG TIME";
		
		if (!hidelocation) return `<li>${chorebutton} : ${status}</li>`;

		var choreContent = `<tr><td>${chorebutton}</td><td>${State.variables.mansion.rooms[this.room].name}</td><td>${status}</td></tr>`

		return choreContent;
	}

	reset() {
		var cost = 0;
		if (!skipChores())
			cost = !this.done && this.todo ? 1 : 0;
		this.done = false;
		this.todo = false;
		return cost;
	}

	get getDuration() {
		// Returns the duration of the Chore in string
		var timeOrder = ["day", "hour", "minute"];
		var str = "";
		for (var i = 0; i < timeOrder.length; i++) {
			if (this.duration[timeOrder[i]] > 1)
				str += `${this.duration[timeOrder[i]]} ${timeOrder[i]}s `
			else if (this.duration[timeOrder[i]] == 1)
				str += `1 ${timeOrder[i]}`
		}
		return str;
	}

	addPassage(passage) {
		this.passages.push();
	}

	removePassage(passageName) {
		this.passages.filter((pass) => pass.name != passageName);
	}

	get passage() {
		var sum = this.passages.reduce((sum, p) => sum + p.weight, 0);
		var val = State.random(0, sum - 1);
		return this.passages.find((p) => {val -= p.weight; return val < 0}).name
	}

	clone() {
        return new Chore(this);
    }

	toJSON() {
        var ownData = {};
        Object.keys(this).forEach((pn) => ownData[pn] = clone(this[pn]), this);
        return JSON.reviveWrapper('new Chore($ReviveData$)', ownData);
	}

	display(imgIndex) {
		var imgIndex = imgIndex || 0;
		var str = `<span class='estateChore'>${this.name}</span><br>`;

		return str + (imgIndex < this.img.length ? `[img[${this.getImgPath(imgIndex)}]]` : "");
	}

	getImgPath(imgIndex) {
		return `${setup.ImagePath}events/chores/${this.id}/${this.img[imgIndex]}`; 
	}

}
Object.defineProperty(window, 'Chore', {
    value : Chore
});
