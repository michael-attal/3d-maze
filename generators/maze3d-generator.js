import { Cell } from "../maze3d.js";

class Maze3dGenerator {
    constructor() {
        if (this === Maze3dGenerator) {
            throw new Error("Abstract class can't be instancied.");
        }
    }

    generate(stair, row, col) {
        throw new Error("This method need to be implemented!");
    }

    measureAlgorithmTime(args) {
        let dateTimeBeforeGenerate = Date.now();
        let maze = this.generate(...args);
        // console.log(maze.toString());
        let dateTimeAfterGenerate = Date.now();
        let differenceInMs = dateTimeAfterGenerate - dateTimeBeforeGenerate;
        return "Generate function of " + this.constructor.name + " take " + differenceInMs + " ms, which is equal to " + differenceInMs / 1000 + " seconds.";
    }

    /**
     * 
     * @param {int} stair is the number of stair of the maze
     * @param {int} row is the number of row of the maze
     * @param {int} col is the number of col of the maze
     * @returns {Array<Array<Array<Cell>>>}
     */
    createCells(stair, row, col) {
        /** @type {Array<Array<Array<Cell>>>} */
        let cells = [];

        // NOTE: Create the cells and the randoms walls
        for (let z = 0; z < stair; z++) {
            cells[z] = [];
            for (let y = 0; y < row; y++) {
                cells[z][y] = [];
                for (let x = 0; x < col; x++) {
                    // NOTE: Save the position of the cell from the maze inside the cell itselft for simplicity of the code later
                    /** @type {Cell} */
                    let cell = new Cell(z, y, x);

                    // NOTE: Create the walls randomly - Commented for the moment, because if a cell a wall on the top, it must have a wall on the bottom of the cell above. Same for the left and right walls, and the forward and backward walls we need to select the next cell to put a wall on oposite side
                    // cell.walls["left"] = Math.random() >= 0.5;
                    // cell.walls["right"] = Math.random() >= 0.5;
                    // cell.walls["forward"] = Math.random() >= 0.5;
                    // cell.walls["backward"] = Math.random() >= 0.5;

                    // NOTE: Create elevator up, down, upAndDown randomly
                    if (Math.random() >= 0.9) {
                        if ((z > 0 && z < stair - 1)) {
                            cell.content = Cell.availableContents.get("elevatorUpAndDown");
                        }
                    } else if (Math.random() >= 0.8) {
                        if (Math.random() >= 0.5) {
                            if (z < stair - 1) {
                                cell.content = Cell.availableContents.get("elevatorUp");
                            }
                        } else {
                            if (z > 0) {
                                cell.content = Cell.availableContents.get("elevatorDown");
                            }
                        }
                    }

                    // NOTE: Create the border of the maze with walls. The border is the first and last rows, cols and if cell has no stair up or down
                    // NOTE: Create the wall down if it's ground floor
                    if (z === 0) {
                        cell.walls["down"] = true;
                    }
                    // NOTE: Create the wall up if it's the last floor
                    if (z === stair - 1) {
                        cell.walls["up"] = true;
                    }
                    // NOTE: Create the wall forward if we are on the top of the maze.
                    if (y === 0) {
                        cell.walls["forward"] = true;
                    }
                    // NOTE: Create the wall backward if we are on the bottom of the maze.
                    if (y === row - 1) {
                        cell.walls["backward"] = true;
                    }
                    // NOTE: Create the wall to left if we are on the leftest side of the maze.
                    if (x === 0) {
                        cell.walls["left"] = true;
                    }
                    // NOTE: Create the wall to right if we are on the rightest side of the maze.
                    if (x === col - 1) {
                        cell.walls["right"] = true;
                    }
                    cells[z][y][x] = cell;
                }
            }
        }

        return cells;
    }

    getRandomCellPosition(stair, row, col) {
        let cellStair = Math.floor(Math.random() * stair);
        let cellRow = Math.floor(Math.random() * row);
        let cellCol = Math.floor(Math.random() * col);
        return {
            stair: cellStair,
            row: cellRow,
            col: cellCol
        }
    }

    getRandomGoalPosition(stair, row, col, startPosition) {
        // NOTE: Create the random goal (exit) that must not be the same as the start position - Currently not used
        let goalStair;
        let goalRow;
        let goalCol;
        do {
            goalStair = Math.floor(Math.random() * stair);
            goalRow = Math.floor(Math.random() * row);
            goalCol = Math.floor(Math.random() * col);
        } while (startPosition.stair === goalStair && startPosition.row === goalRow && startPosition.col === goalCol);
        return {
            stair: goalStair,
            row: goalRow,
            col: goalCol
        }
    }
}

export default Maze3dGenerator;