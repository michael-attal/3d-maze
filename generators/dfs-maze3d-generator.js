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
        let directions = Cell.availableDirections;

        while (stack.length > 0) {
            /** @type {Cell} */
            let nextCell;
            let isCurrentCellStartCell = currentCell === startCell;
            let nextCellDirectionName;

            // NOTE: Get the next random cell neighbour
            while (nextCell === undefined) {
                let nextCellDirectionIndex = Math.floor(Math.random() * directions.size);
                nextCellDirectionName = Cell.getDirectionNameFromIndex(nextCellDirectionIndex);
                let nextCellDirection = Cell.availableDirections.get(nextCellDirectionName);

                // NOTE: Prepare the next cell position
                let nextStair = currentCell.stair + nextCellDirection.stair;
                let nextRow = currentCell.row + nextCellDirection.row;
                let nextCol = currentCell.col + nextCellDirection.col;

                // NOTE: Check if next cell is valid. We should also not go to the next up or down cell if the current cell is the start cell to avoid replace it's content to an elevator.
                // TODO: Ask to Roi if the first of below conditions is OK or should be replace by something else more readble.
                if (((nextCellDirectionName !== "up" && nextCellDirectionName !== "down") || isCurrentCellStartCell === false) &&
                    nextStair >= 0 && nextStair < stair &&
                    nextRow >= 0 && nextRow < row &&
                    nextCol >= 0 && nextCol < col) {
                    nextCell = cells[nextStair][nextRow][nextCol];
                }
            }

            if (visited.indexOf(nextCell) === -1) {
                // NOTE: Remove the wall between the current cell and the chosen neighbour.
                currentCell.walls[nextCellDirectionName] = false;
                nextCell.walls[Cell.oppositeDirections.get(nextCellDirectionName)] = false;

                if (!isCurrentCellStartCell) {
                    currentCell.content = Cell.getCellContentFromDirectionName(nextCellDirectionName);
                    // NOTE: Create upAndDown randomly - Uncomment if we want to create elevatorUpAndDown randomly
                    // if (currentCell.content === Cell.availableContents.get("elevatorUp") || currentCell.content === Cell.availableContents.get("elevatorDown")) {
                    //     if (Math.random() >= 0.5) {
                    //         if ((currentCell.stair > 0 && currentCell.stair < stair - 1)) {
                    //             currentCell.content = Cell.availableContents.get("elevatorUpAndDown");
                    //         }
                    //     }
                    // }
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
