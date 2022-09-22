class Node {
    state
    parent

    constructor(state, parent) {
        this.state = state;
        this.parent = parent;
    }
}

class Searchable {
    constructor() {
        if (this === Searchable) {
            throw new Error("Can't instantiate abstract class!");
        }
    }

    search() {
        throw new Error("This method need to be implemented!");
    }
}

export { Node, Searchable };