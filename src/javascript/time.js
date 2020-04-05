setup.ImagePath = "img/";
setup.SoundPath = "sound/";

class DateTime {
	constructor(date) {
		this.date = new Date(date);
	}

	addTime(duration) {
		var day = duration.day || 0;
		var hour = (duration.hour || 0) + day * 24;
		var min = (duration.minute || 0) + hour * 60;
		this.date = new Date(this.date.getTime() + min * 60000);
	}

	setTime(time) {
		var day = time.day || 0;
		var hours = time.hour || 0;
		var min = time.minute || 0;
		this.date.setDay(day);
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