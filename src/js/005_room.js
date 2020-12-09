window.Room = class Room extends Serializable {
    constructor(id, name = id, adjacent = [], img = "") {
        super();

        this.id = id;
        this.name = name;
        this.adjacent = adjacent;
        this.img = img;
    }

    get passage() {
        if (Story.has(this.id)) return this.id
        return "room template";
    }

    static moveTo(roomName, takeTime = true, moveDuration = 5) {
        if (takeTime) {
            var path = State.variables.roomList[State.variables.currentRoom].findPath(roomName);
            State.variables.time.addTime(path.length * moveDuration)
        }
        State.variables.currentRoom = roomName;
    }

    findPath(roomName, visited = []) {
        if (this.name === roomName) return [this.name];
        if (this.adjacent.includes(roomName))
            return [this.name, roomName];

        var accessible = this.adjacent
            .filter((roomId) => !visited.includes(roomId))
            .map((roomId) => State.variables.roomList[roomId])
        
        // Not found
        if (accessible.length === 0) return null;

        var path = [];
        accessible = accessible
            .map((room) => {
                let pathFrom = room.findPath(roomName, [this.id, ...visited]);
                if (pathFrom === null) return null;
                return [this.id, ...pathFrom]
            })
            .sort((a, b) => {
                if (a === null) {
                    return 1
                } else if (b === null) {
                    return -1
                } else return a.length - b.length
            });

        return accessible[0];
    }

    get imgPath() {
        return `${setup.ImagePath}estate/${this.id}/${this.img}`
    }

    get type() {return "Room"}
}