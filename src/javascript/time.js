setup.ImagePath = "img/";
setup.SoundPath = "sound/";

class Timer {
	days = ["monday", "tuesday", "wednesday", "thursday", "firday", "saturday", "sunday"];
	constructor (config) {
		this.time = {hour : 0, minute : 0};
		this.day = 0;

		this.wakeup = {hour: 6, minute: 0};
		this.sleep = {hour: 22, minute: 0};

		Object.keys(config).forEach(function (pn) {
			this[pn] = clone(config[pn]);
		}, this);
	}

	setDate(time) {
		if (typeof time === "string") {
			time = this[time];
		}
		this.day = time.day || this.day;
		this.time.hour = time.hour;
		this.time.minute = time.minute;
	}

	addTime(time) {
		if (typeof time === "string") {
			time = this[time];
		}
		this.time.minute += (time.minute || 0);
		this.time.hour += (time.hour || 0) + Math.floor(this.time.minute / 60);
		this.time.minute %= 60;
		this.day += (time.day || 0) + Math.floor(this.time.hour / 24);
		this.time.hour %= 24;
	}

	compareTime(time, time2) {
		if (typeof time === "string") {
			time = this[time];
		}
		time2 = time2 || this.time;
		var minuteTime = time.hour * 60 + time.minute;
		var minuteTime2 = time2.hour * 60 + time2.minute;
		var timeDif = minuteTime - minuteTime2;
		if (timeDif == 0) {
			return 0;
		} else if (timeDif < 0) {
			return 1;
		} else {
			return -1;
		}
	}

	inInterval(timeStart, timeEnd) {
		if (typeof timeStart === "string") {
			timeStart = this[timeStart];
		}
		if (typeof timeEnd === "string") {
			timeEnd = this[timeEnd];
		}
		timeEnd = timeEnd || {hour : 24, minute : 0};
		if (this.compareTime(timeEnd, timeStart) < 0) {
			return this.compareTime(timeStart) > -1 && this.compareTime(timeEnd) === -1;
		} else {
			return this.compareTime(timeStart) > -1 || this.compareTime(timeEnd) === -1;
		}
	}

	get weekDay() {
		var day = this.day;
		while (day < 0) {day += 7}
		return day % 7;
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