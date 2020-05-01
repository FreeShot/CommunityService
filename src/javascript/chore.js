class Chore {
	constructor (config) {
		this.name = '';
		this.duration = {day: 0, hour: 0, minute: 0};
		this.passages = [
			{name: '', weight: 1}
		];
		this.img = [];
		this.staminaCost  = 0;
		this.done = false;
		this.room = '';
		this.id = '';
		this.choreFrequency = "D"; // Weekly, Biweekly, Daily
		this.dayLeft = 0;

		Object.keys(config).forEach(function (pn) {
            this[pn] = clone(config[pn]);
        }, this);
	}

	do() {
		console.log(State.variables.time.endsAfter("sleep", this.duration));
		if (this.dayLeft < 0) {
			return "";
		} else if (this.done) {
			return String.format(
				"<span class='ChoreDone'>{0} (Done)</span>",
				this.name
			);
		} else if (!State.variables.player.hasEnoughStamina(this.staminaCost)) {
			return String.format(
				"<span class='ChoreDone'>{0} (Not enough stamina)</span>",
				this.name
			);
		} else if (State.variables.time.endsAfter("sleep", this.duration)) {
			return String.format(
				"<span class='ChoreDone'>{0} (Too late)</span>",
				this.name
				);
		} else {
			return String.format(
				"<<link '{0}' '{1}'>><<set $player.useStamina({2})>><<= $time.addTime({3})>><<= $mansion.findRoom('{5}').findChore('{0}').done = true>><</link>> (Costs {2} stamina, takes about {4} and needs to be done before {6})",
				this.name,
				this.passage,
				this.staminaCost,
				this.duration,
				this.getDuration,
				this.room,
				this.getLastDay
			);
		}
	}

	reset() {
		var days = State.variables.time.day % 7;
		this.dayLeft--;
		if(this.dayLeft < 0) {
			if (!this.done){
				console.log("Missing chores is bad");
				State.variables.player.choresLate++;
			}
			if (this.choreFrequency === "D") {
				this.dayLeft = 0;
			} else if (this.choreFrequency === "B") {
				if (days === 2) {
					this.dayLeft = 1;
				} else if (days === 0) {
					this.dayLeft = 2;
				}
			} else if (this.choreFrequency === "W" && days === 0) {
				this.dayLeft = 6;
			}
			this.done = false;
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
		var val = random(0, sum - 1);
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