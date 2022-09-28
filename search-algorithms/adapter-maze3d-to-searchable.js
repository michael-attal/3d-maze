import { Cell, Maze3d } from "../maze3d.js";
import { Searchable } from './searchable.js';
import AStar from "./a-star.js";

class AdapterMaze3dToSearchable {
    searchable
    maze3d

    /**
     * 
     * @param {Searchable} searchable 
     * @param {Maze3d} maze3d 
     */
    constructor(searchable, maze3d) {
        this.searchable = searchable;
        this.maze3d = maze3d;
    }

    search() {
        let problem = {
            initialState: this.maze3d.startCell,
            goalState: this.maze3d.goalCell,
            goalTest: (cell) => {
                return cell === this.maze3d.goalCell;
            },
            actions: (currentCellToCheckNeighbours) => {
                /** @type Cell */
                let currentCell = currentCellToCheckNeighbours;
                let neighbourCells = [];
                let cells = this.maze3d.cells
                let stairs = cells.length;
                let rows = cells[0].length;
                let cols = cells[0][0].length;

                if (currentCell.stair + 1 < stairs && currentCell.walls.up === false) {
                    neighbourCells.push(cells[currentCell.stair + 1][currentCell.row][currentCell.col]);
                }
                if (currentCell.stair - 1 >= 0 && currentCell.walls.down === false) {
                    neighbourCells.push(cells[currentCell.stair - 1][currentCell.row][currentCell.col]);
                }
                if (currentCell.row + 1 < rows && currentCell.walls.backward === false) {
                    neighbourCells.push(cells[currentCell.stair][currentCell.row + 1][currentCell.col]);
                }
                if (currentCell.row - 1 >= 0 && currentCell.walls.forward === false) {
                    neighbourCells.push(cells[currentCell.stair][currentCell.row - 1][currentCell.col]);
                }
                if (currentCell.col + 1 < cols && currentCell.walls.right === false) {
                    neighbourCells.push(cells[currentCell.stair][currentCell.row][currentCell.col + 1]);
                }
                if (currentCell.col - 1 >= 0 && currentCell.walls.left === false) {
                    neighbourCells.push(cells[currentCell.stair][currentCell.row][currentCell.col - 1]);
                }

                return neighbourCells;
            },
            heurestic: (currNode, prvNode, goalState) => {
                //NOTE: Since the distance from the previous node state to current node state is always one (except for the first iteration, where prvNode is the same as currNode), we don't really need to use prvNode for the maze heurestic solve algorithm.
                let cost = 0;
                if (currNode !== prvNode) {
                    cost += 1;
                }
                // NOTE: Return distance from current node state to goal state
                // NOTE: If goal state is on another stair don't forget to add the cost to move to the stair - TODO: Maybe add extra cost if the elevator is hard to access ?
                cost += Math.abs(goalState.stair - currNode.state.stair) + Math.abs(goalState.stair - currNode.state.stair)
                // NOTE: Add the cost of "minimum" steps from current node state to goal state (without checking if any walls between them exists)
                cost += Math.abs(goalState.row - currNode.state.row) + Math.abs(goalState.col - currNode.state.col);
                return cost;

            },
        };
        if (this.searchable.constructor.name === "AStar") {
            return this.searchable.search(problem, problem.heurestic);
        } else {
            return this.searchable.search(problem);
        }
    }

}

export default AdapterMaze3dToSearchable;