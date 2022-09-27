class Node {
    state
    /** @type {Node} */
    parent

    constructor(state, parent) {
        this.state = state;
        this.parent = parent;
    }
}

class Searchable {
    stateCounter

    constructor() {
        if (this === Searchable) {
            throw new Error("Can't instantiate abstract class!");
        }
        this.stateCounter = 0;
    }

    search() {
        throw new Error("This method need to be implemented!");
    }

    // NOTE: This function will return the path which is all the node from the start node state to the goal node state.
    solution(node) {
        let solution = [];
        while (node.parent) {
            solution.push(node);
            node = node.parent;
        }
        return solution;
    }
}

export { Node, Searchable };