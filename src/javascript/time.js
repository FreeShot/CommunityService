setup.ImagePath = "img/";
setup.SoundPath = "sound/";

class Timer {
	days = ["monday", "tuesday", "wednesday", "thursday", "firday", "saturday", "sunday"];

	constructor (config) {
		this.time = {hour : 0, minute : 0};
		this.day = 0;

		this.wakeupTime = {default: {hour: 6, minute: 0}};

		Object.keys(config).forEach(function (pn) {
			this[pn] = clone(config[pn]);
		}, this);
	}

	setDate(time) {
		this.day = time.day || this.day;
		this.time.hour = time.hour || this.time.hour;
		this.time.minute = time.minute || this.time.minute;
	}

	addTime(time) {
		this.time.minute += (time.minute || 0);
		this.time.hour += (time.hour || 0) + Math.floor(this.time.minute / 60);
		this.time.minute %= 60;
		this.day += (time.day || 0) + Math.floor(this.time.hour / 24);
		this.time.hour %= 24;
	}

	get weekDay() {
		return this.day % 7;
	}

	get weekDayFormat() {
		return this.days[this.weekDay].charAt(0).toUpperCase() + this.days[this.weekDay].slice(1);
	}

	get clock() {
		return String.format(
			"{0}:{1}",
			("0" + this.time.hour).slice(-2),
			("0" + this.time.minute).slice(-2)
		);
	}

	clone() {
        return new Timer(this);
    }

	toJSON() {
        var ownData = {};
        Object.keys(this).forEach(function (pn) {
            ownData[pn] = clone(this[pn]);
        }, this);
        return JSON.reviveWrapper('new Timer($ReviveData$)', ownData);
	}
}
Object.defineProperty(window, 'Timer', {
    value : Timer
});