import Maze3DGenerator from './maze3d-generator.js';
import { Cell, Maze3d } from '../maze3d.js';

class DfsMaze3dGenerator extends Maze3DGenerator {

    constructor() {
        super();
    }

    generate(stairs, rows, cols) {
        // NOTE: Create the cells
        let cells = this.createCells(stairs, rows, cols);

        // NOTE: Create the random start position
        let startPosition = this.getRandomCellPosition(stairs, rows, cols);
        let startCell = cells[startPosition.stair][startPosition.row][startPosition.col];
        startCell.content = Cell.availableContents.get("startPosition");

        // NOTE Initialize the maze
        let maze = new Maze3d(cells, startCell);

        let stack = [];
        let visited = [];

        visited.push(startCell);
        stack.push(startCell);

        let currentCell = startCell;

        while (stack.length > 0) {
            let isCurrentCellStartCell = currentCell === startCell;

            // NOTE: Get the next random cell with direction
            let directionAndRandomCell = this.getRandomCellNeighbour(currentCell, maze, true, true);
            /** @type {DirectionHelper} */
            let nextCellDirection = directionAndRandomCell[0];
            /** @type {Cell} */
            let nextCell = directionAndRandomCell[1];

            if (visited.indexOf(nextCell) === -1) {
                // NOTE: Remove the wall between the current cell and the chosen neighbour.
                this.updateWallsForCurrentAndNextCells(currentCell, nextCell, nextCellDirection);

                // NOTE: Update the content of the current and next cells (add elevators for example).
                this.updateContentForCurrentAndNextCells(currentCell, nextCell, nextCellDirection);

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
        maze.goalCell = goalCell;

        return maze;
    }

}

export default DfsMaze3dGenerator;
