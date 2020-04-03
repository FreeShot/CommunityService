setup.ImagePath = "images/";
setup.SoundPath = "sound/";

class DateTime {
	constructor(date) {
		this.date = new Date(date);
	}

	addTime(day, hours, min) {
		hours += day * 24;
		min += hours * 60;
		this.date = new Date(this.date.getTime() + min * 60000);
	}

	setTime(hours, min) {
		hours = (hours + Math.floor(min / 60)) % 24;
		min %= 60;
		this.date.setHours(hours);
		this.date.setMinutes(min)
	}

	get getDate() {
		return String.format(
			"{0}/{1}/{2}",
			this.date.getFullYear(),
			("0" + (this.date.getMonth() + 1)).slice(-2),
			("0" + this.date.getDate()).slice(-2)
		);
	}

	get getClock() {
		return String.format(
			"{0}:{1}",
			("0" + this.date.getHours()).slice(-2),
			("0" + this.date.getMinutes()).slice(-2)
		);
	}

	clone() {
        return new DateTime(this.date.getTime());
    }
    
    toJSON() {
        return JSON.reviveWrapper(
        	'new DateTime($ReviveData$)', 
        	this.date.getTime());
    }
}

Object.defineProperty(window, 'DateTime', {
    value : DateTime
});