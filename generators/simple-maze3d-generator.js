import Maze3DGenerator from './maze3d-generator.js';
import { Cell, Maze3d } from '../maze3d.js';

class SimpleMaze3dGenerator extends Maze3DGenerator {
    constructor() {
        super();
    }

    /**
     * Generate the maze with a random path from a random entrance to the maze to a random exit from the maze.
     * @param {int} row 
     * @param {int} col 
     * @param {int} stair 
     * @returns {Maze3d}
     */
    generate(stair, row, col) {
        // NOTE: Create the cells
        let cells = this.createCells(stair, row, col);

        // NOTE: Create the random start position
        let startPosition = this.getRandomStartPosition(stair, row, col);
        let startCell = cells[startPosition.stair][startPosition.row][startPosition.col];
        startCell.content = Cell.availableContents.get("startPosition");

        // NOTE: Create the random goal (exit) - Commented out for the moment because we use the random path as the goal
        // TODO: Maybe Create the random path from the random entrance to the random exit ?
        // let goalPosition = this.getRandomGoalPosition(stair, row, col, startPosition);
        // let goalCell = cells[goalPosition.stair][goalPosition.row][goalPosition.col];
        // goalCell.content = Cell.availableContents.get("goal");

        // NOTE: Create the random path from the random entrance to a random exit
        /** @type {Cell} */
        let currentCell = startCell;

        // TODO: Maybe put the randomMoves to do in the parameter of the generate function?
        let randomMoves = 20;
        let directions = ["left", "right", "forward", "backward", "up", "down"];
        for (let i = 0; i < randomMoves; i++) {
            if (i === randomMoves - 1) {
                // NOTE: Create the goal at the last move
                currentCell.content = Cell.availableContents.get("goal");
                break;
            }
            // NOTE: Get the next random cell direction
            let nextCellDirectionIndex = Math.floor(Math.random() * directions.length);
            let nextCellDirectionName = directions[nextCellDirectionIndex];

            // NOTE: Prepare the next cell position
            let nextStair = currentCell.stair;
            let nextRow = currentCell.row;
            let nextCol = currentCell.col;
            let isStartCell = currentCell.content === Cell.availableContents.get("startPosition");

            switch (nextCellDirectionName) {
                case "down":
                    if (currentCell.stair === 0 || isStartCell) {
                        // NOTE: If the random choice is down and there is no down stair, just pickup a random choice again.
                        i--;
                        continue;
                    } else {
                        nextStair--;
                        currentCell.content = Cell.availableContents.get("elevatorDown");
                    }
                    break;
                case "up":
                    if (currentCell.stair === stair - 1 || isStartCell) {
                        // NOTE: If the random choice is up and there is no up stair, just pickup a random choice again.
                        i--;
                        continue;
                    } else {
                        nextStair++;
                        currentCell.content = Cell.availableContents.get("elevatorUp");
                    }
                    break;
                case "left":
                    if (currentCell.col === 0) {
                        // NOTE: If the random choice is left and the cell are at the border left of the maze, just pickup a random choice again.
                        i--;
                        continue;
                    } else {
                        nextCol--;
                        if (!isStartCell) {
                            currentCell.content = Cell.availableContents.get("empty");
                        }
                        currentCell.walls['left'] = false;
                    }
                    break;
                case "right":
                    if (currentCell.col === col - 1) {
                        // NOTE: If the random choice is right and the cell are at the border right of the maze, just pickup a random choice again.
                        i--;
                        continue;
                    } else {
                        nextCol++;
                        if (!isStartCell) {
                            currentCell.content = Cell.availableContents.get("empty");
                        }
                        currentCell.walls['right'] = false;
                    }
                    break;
                case "forward":
                    if (currentCell.row === 0) {
                        // NOTE: If the random choice is forward and the cell are at the border top of the maze, just pickup a random choice again.
                        i--;
                        continue;
                    } else {
                        nextRow--;
                        if (!isStartCell) {
                            currentCell.content = Cell.availableContents.get("empty");
                        }
                        currentCell.walls['forward'] = false;
                    }
                    break;
                case "backward":
                    if (currentCell.row === row - 1) {
                        // NOTE: If the random choice is backward and the cell are at the border bottom of the maze, just pickup a random choice again.
                        i--;
                        continue;
                    } else {
                        nextRow++;
                        if (!isStartCell) {
                            currentCell.content = Cell.availableContents.get("empty");
                        }
                        currentCell.walls['backward'] = false;
                    }
                    break;
            }

            let nextCell = cells[nextStair][nextRow][nextCol];

            // NOTE: Remove the wall of the next cell to the opposite direction of the current cell
            switch (nextCellDirectionName) {
                case "left":
                    nextCell.walls["right"] = false;
                    break;
                case "right":
                    nextCell.walls["left"] = false;
                    break;
                case "forward":
                    nextCell.walls["backward"] = false;
                    break;
                case "backward":
                    nextCell.walls["forward"] = false;
                    break;
                case "up":
                    nextCell.walls["down"] = false;
                    break;
                case "down":
                    nextCell.walls["up"] = false;
                    break;
                default:
                    break;
            }

            // NOTE: Set the next cell as the current cell for the next iteration
            currentCell = nextCell;
        }

        return new Maze3d(cells, startCell, currentCell); // NOTE: The last current cell is the goal cell.
    }

}

export default SimpleMaze3dGenerator;