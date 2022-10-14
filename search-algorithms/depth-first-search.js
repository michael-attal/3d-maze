import { Node, Searchable } from './searchable.js';

class DepthFirstSearch extends Searchable {

    constructor() {
        super();
    }

    search(problem) {
        let node = new Node(problem.initialState);
        if (problem.goalTest(node.state)) {
            return {
                solution: this.solution(node),
                stateVisited: this.stateCounter,
            }
        }
        let frontier = []; // NOTE: The LIFO queue.
        frontier.push(node);
        let explored = new Set();

        while (frontier.length > 0) {
            node = frontier.pop(); // NOTE: Do a pop to remove the last element from the stack frontier (LIFO queue).
            if (explored.has(node.state) === false) {
                explored.add(node.state);
                for (let action of problem.actions(node.state)) {
                    let child = new Node(action, node);
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

export default DepthFirstSearch;