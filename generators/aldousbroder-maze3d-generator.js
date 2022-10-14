import Maze3DGenerator from './maze3d-generator.js';
import { Cell, Maze3d } from '../maze3d.js';

class AldousbroderMaze3dGenerator extends Maze3DGenerator {

    constructor() {
        super();
    }

    // NOTE: This method came from Aldours Broder algorithm, see: https://en.wikipedia.org/wiki/Maze_generation_algorithm#Aldous-Broder_algorithm
    generate(stairs, rows, cols) {
        // NOTE: Create the cells
        let cells = this.createCells(stairs, rows, cols);

        // NOTE: Create a random start cell position
        let startPosition = this.getRandomCellPosition(stairs, rows, cols);
        let startCell = cells[startPosition.stair][startPosition.row][startPosition.col];
        startCell.content = Cell.availableContents.get("startPosition");
        let currentCell = startCell;

        // NOTE Initialize the maze
        let maze = new Maze3d(cells, startCell);

        let visited = [];
        visited.push(currentCell);

        while (visited.length < maze.numberOfCells) {
            // NOTE: Get the next random neighbour cell with direction
            let directionAndRandomCell = this.getRandomCellNeighbour(currentCell, maze, true, true);
            /** @type {DirectionHelper} */
            let randomNeighbourCellDirection = directionAndRandomCell[0];
            /** @type {Cell} */
            let randomNeighbourCell = directionAndRandomCell[1];

            if (visited.indexOf(randomNeighbourCell) === -1) {
                // NOTE: Remove the wall between the current cell and the chosen neighbour.
                this.updateWallsForCurrentAndNextCells(currentCell, randomNeighbourCell, randomNeighbourCellDirection);

                // NOTE: Update the content of the current and neighbour cells (add elevators for example).
                this.updateContentForCurrentAndNextCells(currentCell, randomNeighbourCell, randomNeighbourCellDirection);

                // NOTE: Mark the chosen neighbour as visited.
                visited.push(randomNeighbourCell);

            }
            // NOTE: Make the chosen neighbour the current cell.
            currentCell = randomNeighbourCell;
        }

        // NOTE: Select a random cell from the all the cells of the maze and make it the end cell. (visited contain all cells of the maze).
        // let goalCell = visited[Math.floor(Math.random() * visited.length)];
        // goalCell.content = Cell.availableContents.get("goal");

        // NOTE: Select the last visited cell
        let goalCell = visited[visited.length - 1];
        goalCell.content = Cell.availableContents.get("goal");
        maze.goalCell = goalCell;

        return maze;
    }
}

export default AldousbroderMaze3dGenerator;
