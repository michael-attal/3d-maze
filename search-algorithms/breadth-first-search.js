import { Node, Searchable } from './searchable.js';


class BreadthFirstSearch extends Searchable {
    stateCounter
    constructor() {
        super();
        this.stateCounter = 0;
    }

    search(problem) {
        // NOTE: problem = the maze in this project
        let node = new Node(problem.initialState);
        // NOTE: goalTest is just a function that check if the goal node state === the current node.state (state = a cell of the maze in this project)
        if (problem.goalTest(node.state)) {
            return {
                solution: this.solution(node),
                stateVisited: this.stateCounter,
            } // NOTE: If the start node and goal node are the same it will return it directly.
        }
        let frontier = []; // NOTE: The FIFO queue.
        frontier.push(node);
        let explored = new Set();

        while (frontier.length > 0) {
            node = frontier.shift();
            explored.add(node.state);
            for (let action of problem.actions(node.state)) {
                let child = new Node(action, node);
                if (frontier.indexOf(child) === -1 || explored.has(child.state) === false) {
                    this.stateCounter++;
                    if (problem.goalTest(child.state)) {
                        return {
                            solution: this.solution(child),
                            stateVisited: this.stateCounter,
                        }
                    }
                    frontier.push(child);
                }
            }
        }
        return "failure";
    }
}

export default BreadthFirstSearch;