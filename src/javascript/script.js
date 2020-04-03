setup.ImagePath = "images/";
setup.SoundPath = "sound/";

class DateTime {
	constructor(year, month, day, hours, minutes) {
		this.year = year;
		this.month = month;
		this.day = day;
		this.hours = hours;
		this.minutes = minutes;
	}

	get getDate() {
		return String.format(
			"{0}/{1}/{2}",
			this.year,
			this.month,
			this.day
		);
	}

	get getTime() {
		return String.format(
			"{0}:{1}",
			("0" + this.hours).slice(-2),
			("0" + this.minutes).slice(-2)
		);
	}

	clone() {
        return new DateTime(this.year, this.month, this.day, this.hours, this.minutes);
    }
    
    toJSON() {
        return JSON.reviveWrapper(String.format(
        	'new DateTime({0},{1},{2},{3},{4})', 
        	JSON.stringify(this.year),
        	JSON.stringify(this.month),
        	JSON.stringify(this.day),
        	JSON.stringify(this.hours),
        	JSON.stringify(this.minutes)
        ));
    }
}

Object.defineProperty(window, 'DateTime', {
    value : DateTime
});