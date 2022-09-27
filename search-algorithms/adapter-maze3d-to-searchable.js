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
            heurestic: (node, startNode, goalState) => {
                // NOTE: Return the diagonal from previous node state to current node state + diagonal current node state to goal state. - I don't know why the value is overestimated and don't work as a good heurestic value.
                // let diagonalPrvToCurr = Math.sqrt(Math.abs(node.state.row - startNode.state.row) ** 2 + Math.abs(node.state.col - startNode.state.col) ** 2);
                // let diagonalCurrToGoal = Math.sqrt(Math.abs(goalState.row - node.state.row) ** 2 + Math.abs(goalState.col - node.state.col) ** 2);
                // return diagonalPrvToCurr + diagonalCurrToGoal;

                // NOTE: This heuristic value is not optimal since it's not the diagonal but it works perfectly.
                return Math.abs(node.state.row - startNode.state.row) + Math.abs(node.state.col - startNode.state.col);

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