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
        let startPosition = this.getRandomStartPosition(stair, row, col);
        let startCell = cells[startPosition.stair][startPosition.row][startPosition.col];
        startCell.content = Cell.availableContents.get("startPosition");

        let stack = [];
        let visited = [];

        visited.push(startCell);
        stack.push(startCell);

        let currentCell = startCell;
        let goalCell;

        while (stack.length > 0) {
            /** @type {Cell} */
            let nextCell;
            let currentWallToRemove;
            let nextWallToRemove;
            let popStack = true;
            let elevatorToAdd = "";
            let isStartCell = currentCell.content === Cell.availableContents.get("startPosition");

            // NOTE: Don't add stair if the current cell is the start cell
            if (isStartCell === false && currentCell.stair + 1 < stair && visited.indexOf(cells[currentCell.stair + 1][currentCell.row][currentCell.col]) === -1) {
                nextCell = cells[currentCell.stair + 1][currentCell.row][currentCell.col];
                currentWallToRemove = "up";
                nextWallToRemove = "down";
                elevatorToAdd = "elevatorUp";
                popStack = false;
            } else if (isStartCell === false && currentCell.stair - 1 >= 0 && visited.indexOf(cells[currentCell.stair - 1][currentCell.row][currentCell.col]) === -1) {
                nextCell = cells[currentCell.stair - 1][currentCell.row][currentCell.col];
                currentWallToRemove = "down";
                nextWallToRemove = "up";
                elevatorToAdd = "elevatorDown";
                popStack = false;
            } else if (currentCell.row + 1 < row && visited.indexOf(cells[currentCell.stair][currentCell.row + 1][currentCell.col]) === -1) {
                nextCell = cells[currentCell.stair][currentCell.row + 1][currentCell.col];
                currentWallToRemove = "backward";
                nextWallToRemove = "forward";
                popStack = false;
            } else if (currentCell.row - 1 >= 0 && visited.indexOf(cells[currentCell.stair][currentCell.row - 1][currentCell.col]) === -1) {
                nextCell = cells[currentCell.stair][currentCell.row - 1][currentCell.col];
                currentWallToRemove = "forward";
                nextWallToRemove = "backward";
                popStack = false;
            } else if (currentCell.col + 1 < col && visited.indexOf(cells[currentCell.stair][currentCell.row][currentCell.col + 1]) === -1) {
                nextCell = cells[currentCell.stair][currentCell.row][currentCell.col + 1];
                currentWallToRemove = "right";
                nextWallToRemove = "left";
                popStack = false;
            } else if (currentCell.col - 1 >= 0 && visited.indexOf(cells[currentCell.stair][currentCell.row][currentCell.col - 1]) === -1) {
                nextCell = cells[currentCell.stair][currentCell.row][currentCell.col - 1];
                currentWallToRemove = "left";
                nextWallToRemove = "right";
                popStack = false;
            }

            if (popStack === false) {
                currentCell.walls[currentWallToRemove] = false;
                nextCell.walls[nextWallToRemove] = false;

                if (elevatorToAdd !== "") {
                    // NOTE: Create upAndDown randomly
                    if (Math.random() >= 0.5) {
                        if ((currentCell.stair > 0 && currentCell.stair < stair - 1)) {
                            currentCell.content = Cell.availableContents.get("elevatorUpAndDown");
                        } else {
                            currentCell.content = Cell.availableContents.get(elevatorToAdd);
                        }
                    } else {
                        currentCell.content = Cell.availableContents.get(elevatorToAdd);
                    }
                }
                visited.push(nextCell);
                stack.push(nextCell);
                currentCell = nextCell;
            } else {
                currentCell = stack.pop();
            }
        }
        // NOTE: Select a random cell from the visited cells (that way we are sure that at least one path exist to the goal).
        goalCell = visited[Math.floor(Math.random() * visited.length)];
        goalCell.content = Cell.availableContents.get("goal");

        return new Maze3d(cells, startCell, goalCell);
    }

}

export default DfsMaze3dGenerator;
