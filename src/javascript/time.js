setup.ImagePath = "img/";
setup.SoundPath = "sound/";

class Timer {
	constructor (config) {
		this.time = {hour : 0, minute : 0};
		this.day = 0;
		this.days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

		this.wakeup = {hour: 6, minute: 0};
		this.sleep = {hour: 22, minute: 0};

		Object.keys(config).forEach(function (pn) {
			this[pn] = clone(config[pn]);
		}, this);
	}

	setDate(time) {
		if (typeof time === "string")
			time = this[time]
		time = Object.assign({day:0, hour:0, minute:0}, time);
		if (this.compareTime(time) <= 0)
			this.day = time.day != 0 ? time.day + 1 : this.day + 1
		else {
			this.day = time.day != 0 ? time.day : this.day;
		}
		this.time.hour = time.hour;
		this.time.minute = time.minute;
	}

	addTime(time) {
		if (typeof time === "string")
			time = this[time];
		this.time.minute += (time.minute || 0);
		this.time.hour += (time.hour || 0) + Math.floor(this.time.minute / 60);
		this.time.minute %= 60;
		this.day += (time.day || 0) + Math.floor(this.time.hour / 24);
		this.time.hour %= 24;
	}

	static toMinute(time) {
		return ((time.day || 0) * 24 + (time.hour || 0)) * 60 + (time.minute || 0);
	}

	addTravelTime(start, end){
		this.addTime({minute: 5 * (pathfind.path(start, end).length - 1)})
	}

	compareTime(time, time2) {
		if (typeof time === "string")
			time = this[time];
		time2 = time2 || this.time;
		return Timer.toMinute(time) - Timer.toMinute(time2);
	}

	endsAfter(endTime, duration) {
		if (typeof endTime === "string")
			endTime = this[endTime];
		return Timer.toMinute(endTime) - Timer.toMinute(duration) < Timer.toMinute(this.time);
	}

	inInterval(timeStart, timeEnd) {
		if (typeof timeStart === "string")
			timeStart = this[timeStart];

		if (typeof timeEnd === "string")
			timeEnd = this[timeEnd];

		timeStart = timeStart || {hour: 0, minute: 0};
		timeEnd = timeEnd || {hour : 24, minute : 0};

		var time = Timer.toMinute(this.time);
		var t1 = Timer.toMinute(timeStart);
		var t2 = Timer.toMinute(timeEnd);

		return t1 > t2 ? time >= t1 || time < t2 : time >= t1 && time < t2;
	}

	get weekDay() {
		return this.day % 7;
	}

	get weekDayFormat() {
		return this.days[this.weekDay].charAt(0).toUpperCase() + this.days[this.weekDay].slice(1);
	}

	get clock() {
		return Timer.getTime(this.time);
	}

	static getTime(time) {
		return `${time.hour !== undefined ? ("0" + time.hour).slice(-2) : "00"}:${time.minute !== undefined ? ("0" + time.minute).slice(-2) : "00"}`
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