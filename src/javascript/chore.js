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
		this.done = false;
		this.room = '';
		this.id = '';
		this.choreFrequency = "D"; // Weekly, Biweekly, Daily

		Object.keys(config).forEach(function (pn) {
            this[pn] = clone(config[pn]);
        }, this);

        this.time.start = this.time.start || {hour: 6, minute: 0};
		this.time.end = this.time.end || {hour: 18, minute: 0};
	}

	do(canDoChores, filterDone) {
		// Chore is waiting to be reset
		if (skipChores() || (this.done && filterDone)) {
			return "";
		}

		var htmlClass = [];
		if (this.done) {
			htmlClass.push('chore-done');
		}
		if (!State.variables.player.hasEnoughStamina(this.staminaCost)) {
			htmlClass.push('chore-exhaused');
		}
		if (State.variables.time.endsAfter(this.time.end, this.duration) || State.variables.time.compareTime(this.time.start) === -1) {
			htmlClass.push('chore-not-time');
		}
		if (!canDoChores) {
			htmlClass.push('chore-unavailable');
		}

		var info = String.format(
			"(To do beween: {0} to {1} before {2}. Duration: {3})",
			Timer.getTime(this.time.start),
			Timer.getTime(this.time.end),
			this.getLastDay,
			Timer.getTime(this.duration)
		);
		htmlClass = [htmlClass.length > 0 ? htmlClass[0] : "chore"];
		return String.format(
			"<span class='{0}'>{1} {2} {3} {4}</span>",
			htmlClass.reduce((str, el) => `${str} ${el}`, ""),
			this.name,
			this.done ? "" : info,
			htmlClass.reduce(function(str, el){
				switch (el) {
					case "chore-done":
						return str + " [DONE]";
					case "chore-exhaused":
						return str + " [TOO TIRED]";
					case "chore-not-time":
						return str + " [NOT THE RIGHT TIME]";
					case "chore-unavailable":
						return str;
				}
			}, ""),
			canDoChores && !this.done && htmlClass[0] === "chore" ? String.format(
				"<span class='chore-button'><<link 'Start chore' \"{0}\">><<set $aPsgText to `{5}`>><<= $player.currentRoom=`{1}`>><<set $player.useStamina({2})>><<= $time.addTime({3})>><<= $mansion.findRoom('{1}').findChore(\"{4}\").done = true>><</link>></span>",
				this.passage,
				this.room,
				this.staminaCost,
				this.duration,
				this.name,
				State.variables.mansion.findRoom(this.room).getPassage()
			) : ""
		);
	}

	reset() {
		// TODO - RESET CHORE IF TIME IS UP
		if (this.dayLeft === 0 && !skipChores()) {
			State.variables.player.choresLate++;
		}
	}

	get dayLeft() {
		var day = State.variables.time.weekDay;
		switch (this.choreFrequency) {
			case "W":
				// Resets on sunday
				return 6 - day;
			case "B":
				// Resets on wednesday and sunday
				return day < 3 ? 2 - day : 6 - day;
			case "D":
				// Chore resets everydays
				return 0;
			default:
				console.log("Wrong chore frequency");
				break;
		}
	}

	get getLastDay() {
		var strLastDay = ["tomorrow", "2 days", "3 days", "4 days", "5 days", "6 days", "a week"];
		return strLastDay[this.dayLeft];
	}

	get getDuration() {
		// Returns the duration of the Chore in string
		var timeOrder = ["day", "hour", "minute"];
		var str = "";
		for (var i = 0; i < timeOrder.length; i++) {
			if (this.duration[timeOrder[i]] > 1) {
				str += this.duration[timeOrder[i]] + " " + timeOrder[i] + "s ";
			} else if (this.duration[timeOrder[i]] == 1) {
				str += 1 + " " + timeOrder[i] + " ";
			}
		}
		return str;
	}

	addPassage(passage) {
		this.passages.push();
	}

	removePassage(passageName) {
		this.passages.filter(function(pass){pass.name != passageName});
	}

	get passage() {
		var sum = 0; for (var i = this.passages.length - 1; i >= 0; i--) {sum += this.passages[i].weight;}
		var val = State.random(0, sum - 1);
		for (var i = 0; i < this.passages.length; i++) {
			val -= this.passages[i].weight;
			if (val < 0) {
				return this.passages[i].name;
			}
		}
		//return this.passageName; // Use instead of this.passageName
	}

	clone() {
        return new Chore(this);
    }

	toJSON() {
        var ownData = {};
        Object.keys(this).forEach(function (pn) {
            ownData[pn] = clone(this[pn]);
        }, this);
        return JSON.reviveWrapper('new Chore($ReviveData$)', ownData);
	}

	display(imgIndex) {
		var imgIndex = imgIndex || 0;

		var str = "<span class='estateChore'>" + this.name + "</span><br>";

		return str + (imgIndex < this.img.length ? "[img[" + this.getImgPath(imgIndex) + "]]" : "");
	}

	getImgPath(imgIndex) {
		return setup.ImagePath + "events/chores/" + this.id + "/" + this.img[imgIndex]; 
	}

}
Object.defineProperty(window, 'Chore', {
    value : Chore
});