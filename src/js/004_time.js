const days = [
    "Monday", 
    "Tuesday", 
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
]

window.Time = class Time extends Serializable {
    constructor(hour = 0, minute = 0, day) {
        super()
        
        this.day = day;
        this.hour = hour;
        this.minute = minute;
    }

    get canSleep() {
        var minute = this.getMinute(false);
        return minute <  360   //  6h00
            || minute >= 1290; // 21h30
    }

    get canStayAwake() {
        var minute = this.getMinute(false);
        return minute >= 360    //  6h00
            && minute < 1320; // 22h00
    }

    addTime(day = 0, hour = 0, minute = 0) {
        this.minute += minute;
        this.hour += hour + Math.floor(this.minute / 60);
        this.day += day + Math.floor(this.hour / 24);

        this.minute %= 60;
        this.hour %= 24;
    }

    get week() {
        return 1 + Math.floor(this.day / 7);
    }

    get weekDay() {
        return days[this.day % 7];
    }

    get clock() {
        return `${("0" + (this.hour || "0")).slice(-2)}:${("0" + (this.minute || "0")).slice(-2)}`
    }

    getMinute(countDay = true) {
        return this.minute + this.hour * 60 + this.day * 1440 * (countDay ? 1 : 0)
    }

    static compare(time1, time2) {
        if (typeof time1 != "number") time1 = time1.getMinute();
        if (typeof time2 != "number") time2 = time2.getMinute();

        return time1 - time2;
    }

    get type() {return "Time"}
}