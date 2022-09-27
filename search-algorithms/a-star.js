import { Node, Searchable } from './searchable.js';

class AStar extends Searchable {

    constructor() {
        super();
    }

    search(problem, heuresticFunc) {
        let node = new Node(problem.initialState);

        let frontier = []; // NOTE: The priority queue.
        frontier.push({
            priority: heuresticFunc(node, node, problem.goalState),
            node: node
        });

        let explored = new Set();

        while (frontier.length > 0) {
            frontier.sort((a, b) => a.priority - b.priority);
            let frontierObj = frontier.shift(); // TODO: Maybe do a pop instead of shift for performance optimization (need to order by desc first) ?
            node = frontierObj.node;
            explored.add(node.state);

            if (problem.goalTest(node.state)) {
                return {
                    solution: this.solution(node),
                    stateVisited: this.stateCounter,
                }
            }

            for (let action of problem.actions(node.state)) {
                let child = new Node(action, node);
                if (problem.goalTest(child.state)) {
                    return {
                        solution: this.solution(child),
                        stateVisited: this.stateCounter,
                    }
                }

                if (explored.has(child.state) === false) {
                    let priorityChild = heuresticFunc(child, node, problem.goalState);
                    let newFrontierObj = {
                        priority: priorityChild,
                        node: child
                    }
                    this.stateCounter++;

                    let existInFrontier = false;
                    for (let i = 0; i < frontier.length; i++) {
                        if (frontier[i].node.state === child.state) {
                            existInFrontier = true;
                            if (frontier[i].priority >= priorityChild) {
                                frontier[i] = newFrontierObj;
                            }
                            break;
                        }
                    }
                    if (existInFrontier === false) {
                        frontier.push(newFrontierObj);
                    }
                }
            }
        }
        return "failure";
    }

}

export default AStar;