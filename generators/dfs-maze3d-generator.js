import Maze3DGenerator from './maze3d-generator.js';
import { Cell, Maze3d } from '../maze3d.js';

class DfsMaze3dGenerator extends Maze3DGenerator {

    constructor() {
        super();
    }

    generate(stair, row, col) {
        // NOTE: Create the cells
        let cells = this.createCells(stair, row, col);

        // NOTE: Create the random start position
        let startPosition = this.getRandomCellPosition(stair, row, col);
        let startCell = cells[startPosition.stair][startPosition.row][startPosition.col];
        startCell.content = Cell.availableContents.get("startPosition");

        let stack = [];
        let visited = [];

        visited.push(startCell);
        stack.push(startCell);

        let currentCell = startCell;

        while (stack.length > 0) {
            /** @type {Cell} */
            let nextCell;
            let isStartCell = currentCell === startCell;

            // NOTE: It is better to select a random neighbour, but this is done in my other algorithm choice (Aldous Broder)
            // TODO: Maybe use something like direction = [(0, 0, 1), (0, 0, -1), (0, 1, 0), (0, -1, 0), (1, 0, 0), (-1, 0, 0)]; instead of conditions below
            if (currentCell.col + 1 < col) {
                nextCell = cells[currentCell.stair][currentCell.row][currentCell.col + 1];
            } else if (!isStartCell && currentCell.stair + 1 < stair) {
                // NOTE: Don't add stair if the current cell is the start cell
                nextCell = cells[currentCell.stair + 1][currentCell.row][currentCell.col];
            } else if (currentCell.row - 1 >= 0) {
                nextCell = cells[currentCell.stair][currentCell.row - 1][currentCell.col];
            } else if (!isStartCell && currentCell.stair - 1 >= 0) {
                nextCell = cells[currentCell.stair - 1][currentCell.row][currentCell.col];
            } else if (currentCell.col - 1 >= 0) {
                nextCell = cells[currentCell.stair][currentCell.row][currentCell.col - 1];
            } else if (currentCell.row + 1 < row) {
                nextCell = cells[currentCell.stair][currentCell.row + 1][currentCell.col];
            }

            if (visited.indexOf(nextCell) === -1) {
                // NOTE: Remove the wall between the current cell and the chosen neighbour.
                if (currentCell.stair === nextCell.stair) {
                    if (currentCell.row === nextCell.row) {
                        if (currentCell.col < nextCell.col) {
                            currentCell.walls.right = false;
                            nextCell.walls.left = false;
                        } else {
                            currentCell.walls.left = false;
                            nextCell.walls.right = false;
                        }
                    } else {
                        if (currentCell.row < nextCell.row) {
                            currentCell.walls.backward = false;
                            nextCell.walls.forward = false;
                        } else {
                            currentCell.walls.forward = false;
                            nextCell.walls.backward = false;
                        }
                    }
                } else {
                    if (currentCell.stair < nextCell.stair) {
                        currentCell.walls.up = false;
                        nextCell.walls.down = false;
                        currentCell.content = Cell.availableContents.get("elevatorUp");

                        // // NOTE: Create upAndDown randomly - Uncomment if we want to create elevatorUpAndDown randomly and duplicate this code in the else condition
                        // if (Math.random() >= 0.5) {
                        //     if ((currentCell.stair > 0 && currentCell.stair < stair - 1)) {
                        //         currentCell.content = Cell.availableContents.get("elevatorUpAndDown");
                        //     } else {
                        //         currentCell.content = Cell.availableContents.get(elevatorToAdd);
                        //     }
                        // } else {
                        //     currentCell.content = Cell.availableContents.get(elevatorToAdd);
                        // }

                    } else {
                        currentCell.walls.down = false;
                        nextCell.walls.up = false;
                        currentCell.content = Cell.availableContents.get("elevatorDown");
                    }
                }

                visited.push(nextCell);
                stack.push(nextCell);
                currentCell = nextCell;
            } else {
                currentCell = stack.pop();
            }
        }
        // NOTE: Select the last visited cell to make it harder.
        // TODO: Allow player to select the difficulty, then we can make it easy by selecting the closest visited cell or medium with the middle one and hard with the last one.
        let goalCell = visited[visited.length - 1];
        goalCell.content = Cell.availableContents.get("goal");


        return new Maze3d(cells, startCell, goalCell);
    }

}

export default DfsMaze3dGenerator;
