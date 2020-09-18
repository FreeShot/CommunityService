class Timer {
	constructor(config) {
		this.time = {hour: 0, minute: 0};
		this.day = 0;
		this.days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

		this.savedTime = {
			wakeup: {hour: 6, minute: 0},
			sleep: {hour: 22, minute: 0}
		};
	
		Object.keys(config).forEach(function (pn) {
			this[pn] = clone(config[pn]);
		}, this);
	}

	setDate(time) {
		// Grabs preset
		if (typeof time === "string")
			time = this.savedTime[time];

		// Fills missing data
		time = Object.assign({day:0, hour:0, minute:0}, time);

		// Set day if specified. If time is later than now, adds one day
		this.day = (time.day != 0 ? time.day : this.day) + (this.compareTime(time) > 0 ? 0 : 1);
		
		// Set hour and minute
		this.time = {hour: time.hour, minute: time.minute};
	}

	addTime(time) {
		// Grabs preset
		if (typeof time === "string")
			time = this.savedTime[time];

		// Adds minutes if exists
		this.time.minute += (time.minute || 0);

		// Adds hours + overflowing minutes
		this.time.hour += (time.hour || 0) + Math.floor(this.time.minute / 60);

		// Fixes the overflowing minutes:
		this.time.minute %= 60;

		// Adds day + overflowing hours
		this.day += (time.day || 0) + Math.floor(this.time.hour / 24);

		// Fixes the overflowing hours
		this.time.hour %= 24;
	}

	static toMinute(time) {
		return ((time.day || 0) * 24 + (time.hour || 0)) * 60 + time.minute;
	}

	addTravelTime(start, end) {
		this.addTime({minute: 5 * (pathfind.path(start, end).length - 1)})
	}

	compareTime(time, time2) {
		if (typeof time === "string")
			time = this.savedTime[time];

		time2 = time2 || this.time;
		return Timer.toMinute(time) - Timer.toMinute(time2);
	}

	endsAfter(endTime, duration) {
		if (typeof endTime === "string")
			endTime = this.savedTime[time];
		return Timer.toMinute(endTime) - Timer.toMinute(duration) < Timer.toMinute(this.time);
	}

	inInterval(timeStart, timeEnd) {
		if (typeof timeStart === "string")
			timeStart = this.savedTime[timeStart];

		if (typeof timeEnd === "string")
			timeEnd = this.savedTime[timeEnd];

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

	generateClock() {
		drawClock(this.time);
	}

	static getTime(time) {
		return `${("0" + (time.hour || "0")).slice(-2)}:${("0" + (time.minute || "0")).slice(-2)}`
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