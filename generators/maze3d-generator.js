import { Cell, DirectionHelper, Maze3d } from "../maze3d.js";

class Maze3dGenerator {

    constructor() {
        if (this === Maze3dGenerator) {
            throw new Error("Abstract class can't be instancied.");
        }
    }

    /**
     * Generate the maze with a random path from a random entrance to the maze to a random exit from the maze.
     * @param {int} rows
     * @param {int} cols
     * @param {int} stairs 
     * @returns {Maze3d}
     */
    generate(stairs, rows, cols) {
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
    createCells(stairs, rows, cols) {
        /** @type {Array<Array<Array<Cell>>>} */
        let cells = [];

        // NOTE: Create the cells and the randoms walls
        for (let z = 0; z < stairs; z++) {
            cells[z] = [];
            for (let y = 0; y < rows; y++) {
                cells[z][y] = [];
                for (let x = 0; x < cols; x++) {
                    // NOTE: Save the position of the cell from the maze inside the cell itselft for simplicity of the code later
                    /** @type {Cell} */
                    let cell = new Cell(z, y, x);

                    // NOTE: Create the walls randomly - Commented for the moment, because if a cell has a wall on the top, it must have a wall on the bottom of the cell above. Same for the left, right walls, and the forward, backward walls. We need to select the next cell to put a wall on oposite side
                    // cell.walls["left"] = Math.random() >= 0.5;
                    // cell.walls["right"] = Math.random() >= 0.5;
                    // cell.walls["forward"] = Math.random() >= 0.5;
                    // cell.walls["backward"] = Math.random() >= 0.5;

                    // NOTE: Create elevator up, down, upAndDown randomly
                    if (Math.random() >= 0.9) {
                        if ((z > 0 && z < stairs - 1)) {
                            cell.content = Cell.availableContents.get("elevatorUpAndDown");
                        }
                    } else if (Math.random() >= 0.8) {
                        if (Math.random() >= 0.5) {
                            if (z < stairs - 1) {
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
                    if (z === stairs - 1) {
                        cell.walls["up"] = true;
                    }
                    // NOTE: Create the wall forward if we are on the top of the maze.
                    if (y === 0) {
                        cell.walls["forward"] = true;
                    }
                    // NOTE: Create the wall backward if we are on the bottom of the maze.
                    if (y === rows - 1) {
                        cell.walls["backward"] = true;
                    }
                    // NOTE: Create the wall to left if we are on the leftest side of the maze.
                    if (x === 0) {
                        cell.walls["left"] = true;
                    }
                    // NOTE: Create the wall to right if we are on the rightest side of the maze.
                    if (x === cols - 1) {
                        cell.walls["right"] = true;
                    }
                    cells[z][y][x] = cell;
                }
            }
        }

        return cells;
    }

    getRandomCellPosition(stairs, rows, cols) {
        let cellStair = Math.floor(Math.random() * stairs);
        let cellRow = Math.floor(Math.random() * rows);
        let cellCol = Math.floor(Math.random() * cols);
        return {
            stair: cellStair,
            row: cellRow,
            col: cellCol
        }
    }

    getRandomGoalPosition(startPosition, stairs, rows, cols) {
        // NOTE: Create the random goal (exit) that must not be the same as the start position - Currently not used
        let goalPosition;
        do {
            goalPosition = this.getRandomCellPosition(stairs, rows, cols);
        } while (startPosition.stair === goalPosition.stair && startPosition.row === goalPosition.row && startPosition.col === goalPosition.col);
        return {
            stair: goalPosition.stair,
            row: goalPosition.row,
            col: goalPosition.col
        }
    }

    /**
     * 
     * @param {Cell} cell The cell to get a neighbour from it
     * @param {Maze3d} maze The current maze where the cell is located
     * @param {bool} returnAlsoDirectionHelper If true it add to the returns with the random cell neighbour the direction helper associated
     * @param {bool} checkElevator Add another verrification step for the elevator cell
     * @returns {Cell|Array<DirectionHelper&Cell>} Return a random cell neighbour or a random cell neighbour with his direction helper associated if asked in the argument of this method.
     */
    getRandomCellNeighbour(cell, maze, returnAlsoDirectionHelper = false, checkElevator = false) {
        let isValidPosition = false;
        const directions = Cell.availableDirections;

        while (isValidPosition === false) {
            // NOTE: Get a next random position
            let nextCellDirectionIndex = Math.floor(Math.random() * directions.length);
            let nextCellDirection = Cell.availableDirections[nextCellDirectionIndex];
            let tryPosition = new DirectionHelper(nextCellDirection.stair + cell.stair, nextCellDirection.row + cell.row, nextCellDirection.col + cell.col, nextCellDirection.name);

            // NOTE: Check that this next random position is valid 
            if (maze.isValidPosition(tryPosition, checkElevator)) {
                // NOTE: If checkElevator is equal to true we need to check that the current cell (which will become an elevator cell) is not already the start cell of the maze (to not override it's content by an elevator).
                let checkOnlyPosition = true;
                let checkElevatorSuccess = false;

                if (checkElevator !== false) {
                    checkOnlyPosition = false;
                    // TODO: Ask to Roi if the first of below conditions is OK or should be replace by something else more readble.
                    if ((tryPosition.direction !== "up" && tryPosition.direction !== "down") || cell !== maze.startCell) {
                        checkElevatorSuccess = true;
                    }
                }

                if (checkOnlyPosition || checkElevatorSuccess) {
                    isValidPosition = true; // NOTE: Isn't neccessary but let it here to be more explicit.
                    let randomNeighbourCell = maze.cells[tryPosition.stair][tryPosition.row][tryPosition.col];
                    if (returnAlsoDirectionHelper) {
                        return [tryPosition, randomNeighbourCell];
                    } else {
                        return randomNeighbourCell;
                    }
                }
            }
        }
    }
}

export default Maze3dGenerator;