function skipChores() {
	// Checks if the chores are counted during the reset
	return State.variables.time.day === 0 || State.variables.mansion.currentEvent !== "";
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

		this.time = {...this.time, ...{start:{hour: 6, minute: 0}, end:{hour:18, minute:0}}};
	}

	do(canDoChores, filterDone) {
		// Chore is waiting to be reset
		if (skipChores() || (this.done && filterDone) || !this.todo)
			return "";

		var htmlClass = "chore";
		if (this.done)
			htmlClass = 'chore-done';
		else if (!State.variables.player.hasEnoughStamina(this.staminaCost))
			htmlClass = 'chore-exhaused';
		else if (State.variables.time.endsAfter(this.time.end, this.duration) || State.variables.time.compareTime(this.time.start) === -1)
			htmlClass = 'chore-not-time';
		else if (!canDoChores)
			htmlClass = 'chore-unavailable';

		return String.format(
			"<span class='{0}'>{1} {2} {3} {4}</span>",
			htmlClass,
			this.name,
			this.done ? "" : `(To do beween: ${Timer.getTime(this.time.start)} to ${Timer.getTime(this.time.end)}. Duration: ${Timer.getTime(this.duration)})`,
			{"chore-done" : "[DONE]", "chore-exhaused" : "[TOO TIRED]", "chore-not-time" : "[NOT THE RIGHT TIME]", "chore": "", "chore-unavailable": ""}[htmlClass],
			canDoChores && !this.done && htmlClass === "chore" ? String.format(
				"<span class='chore-button'><<link 'Start chore' \"{0}\">><<= $player.levelUp('cleaning', {5})>><<set $aPsgText to `{6}`>><<= $player.currentRoom=`{1}`>><<set $player.useStamina({2})>><<= $time.addTime({3})>><<= $mansion.findRoom('{1}').findChore(\"{4}\").done = true>><</link>></span>",
				this.passage,
				this.room,
				this.staminaCost,
				this.duration,
				this.name,
				this.xp,
				State.variables.mansion.findRoom(this.room).getPassage()
			) : ""
		);
	}

	reset() {
		if (!skipChores())
			State.variables.player.choresLate += this.done ? 0 : 1;
		this.done = false;
		this.todo = false;
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