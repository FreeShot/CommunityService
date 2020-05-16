setup.ImagePath = "img/";
setup.SoundPath = "sound/";

class Timer {
	days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
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
		if (this.compareTime(time) === 1) {
				this.addTime({day: 1});
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

	endsAfter(endTime, duration) {
		if (typeof endTime === "string") {
			endTime = this[endTime];
		}
		let time = Object.assign({}, this.time);
		time.minute += (duration.minute || 0);
		time.hour += (duration.hour || 0) + Math.floor((duration.minute || 0) / 60);
		time.minute %= 60;
		return this.compareTime(endTime, time) != -1;
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
		return day % 7;
	}

	get weekDayFormat() {
		return this.days[this.weekDay].charAt(0).toUpperCase() + this.days[this.weekDay].slice(1);
	}

	get clock() {
		return Timer.getTime(this.time);
	}

	static getTime(time) {
		return String.format(
			"{0}:{1}",
			time.hour !== undefined ? ("0" + time.hour).slice(-2) : "00",
			time.minute !== undefined ? ("0" + time.minute).slice(-2) : "00"
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