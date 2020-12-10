window.Chore = class Chore extends Serializable {
    constructor(name, duration, passages) {
        super();

        this.name = name;
        this.duration = duration;
        this.passages = passages;

        this.done = false;
        this.todo = false;
    }

    getTemplate() {
        var sel_passages = this.passages.randomMany(random(1, this.passages.length));

        return sel_passages.reduce((str, p) => `${str}\n<<include "${p}">>`, "")
    }

    static getChores(todoOnly = false, rooms = State.variables.roomList) {
        var chores = Object.values(rooms)
            .flatMap(room => room.chores);
        if (todoOnly) return chores.filter(chore => chore.todo);
        return chores;
    }

    static getStats() {
        var chores = Chore.getChores(true);

        var stats = {
            done: 0,
            missed: 0
        }

        chores.forEach(chore => {
            if (chore.done)
                stats.done++;
            else
                stats.missed++;
        })

        return stats;
    }

    static planDay(nbChore = 5) {
        var chores = Chore.getChores();
        chores.forEach(chore => {
            chore.todo = false;
            chore.done = false;
        });

        while (nbChore >= 0) {
            either(chores).todo = true;
            chores = chores.filter(chore => !chores.todo);
            nbChore--;
        }
    }

    get type() {
        return "Chore";
    }
}