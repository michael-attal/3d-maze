import { Maze3d } from "../maze3d.js";
import { Searchable } from './searchable.js';

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
            goalTest: (cell) => {
                return cell === this.maze3d.goalCell
            },
            actions: (currentCell) => {
                let neighbourCells = [];
                let cells = this.maze3d.cells
                let stairs = cells.length;
                let rows = cells[0].length;
                let cols = cells[0][0].length;

                if (currentCell.stair + 1 < stairs) {
                    neighbourCells.push(cells[currentCell.stair + 1][currentCell.row][currentCell.col]);
                }
                if (currentCell.stair - 1 >= 0) {
                    neighbourCells.push(cells[currentCell.stair - 1][currentCell.row][currentCell.col]);
                }
                if (currentCell.row + 1 < rows) {
                    neighbourCells.push(cells[currentCell.stair][currentCell.row + 1][currentCell.col]);
                }
                if (currentCell.row - 1 >= 0) {
                    neighbourCells.push(cells[currentCell.stair][currentCell.row - 1][currentCell.col]);
                }
                if (currentCell.col + 1 < cols) {
                    neighbourCells.push(cells[currentCell.stair][currentCell.row][currentCell.col + 1]);
                }
                if (currentCell.col - 1 >= 0) {
                    neighbourCells.push(cells[currentCell.stair][currentCell.row][currentCell.col - 1]);
                }

                return neighbourCells;
            }
        };
        return this.searchable.search(problem);
    }

}

export default AdapterMaze3dToSearchable;