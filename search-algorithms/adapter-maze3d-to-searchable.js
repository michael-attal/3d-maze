import { Cell, DirectionHelper, Maze3d } from "../maze3d.js";
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

    search(initialState = this.maze3d.startCell, goalCell = this.maze3d.goalCell) {
        let problem = {
            initialState: initialState,
            goalState: goalCell,
            goalTest: (cell) => {
                return cell === goalCell;
            },
            actions: (currentCellToCheckNeighbours) => {
                /** @type {Cell} */
                let currentCell = currentCellToCheckNeighbours;
                let neighbourCells = [];
                let cells = this.maze3d.cells;

                // NOTE: Check that each direction is a valid direction (that mean there is no wall between the current cell and neighbour cell and that the direction don't go over the maze limit)
                for (let direction of Cell.availableDirections) {
                    let tryPosition = new DirectionHelper(direction.stair + currentCell.stair, direction.row + currentCell.row, direction.col + currentCell.col, direction.name);
                    if (this.maze3d.isValidPosition(tryPosition)) {
                        let neighbourCell = cells[tryPosition.stair][tryPosition.row][tryPosition.col];
                        if (currentCell.walls[tryPosition.name] === false) {
                            neighbourCells.push(neighbourCell);
                        }
                    }
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