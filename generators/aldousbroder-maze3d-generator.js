import Maze3DGenerator from './maze3d-generator.js';
import { Cell, Maze3d } from '../maze3d.js';

class AldousbroderMaze3dGenerator extends Maze3DGenerator {

    constructor() {
        super();
    }

    // NOTE: This method came from Aldours Broder algorithm, see: https://en.wikipedia.org/wiki/Maze_generation_algorithm#Aldous-Broder_algorithm
    generate(stair, row, col) {
        // NOTE: Create the cells
        let cells = this.createCells(stair, row, col);

        // NOTE: Create a random start cell position
        let startPosition = this.getRandomCellPosition(stair, row, col);
        let startCell = cells[startPosition.stair][startPosition.row][startPosition.col];
        startCell.content = Cell.availableContents.get("startPosition");
        let currentCell = startCell;

        let visited = [];
        visited.push(currentCell);

        while (visited.length < stair * row * col) {
            let randomNeighbourPosition = this.getRandomNeighbourPosition(currentCell, startCell, stair, row, col);
            let randomNeighbourCell = cells[randomNeighbourPosition.stair][randomNeighbourPosition.row][randomNeighbourPosition.col];
            if (visited.indexOf(randomNeighbourCell) === -1) {
                // NOTE: Remove the wall between the current cell and the chosen neighbour.
                if (currentCell.stair === randomNeighbourCell.stair) {
                    if (currentCell.row === randomNeighbourCell.row) {
                        if (currentCell.col < randomNeighbourCell.col) {
                            currentCell.walls.right = false;
                            randomNeighbourCell.walls.left = false;
                        } else {
                            currentCell.walls.left = false;
                            randomNeighbourCell.walls.right = false;
                        }
                    } else {
                        if (currentCell.row < randomNeighbourCell.row) {
                            currentCell.walls.backward = false;
                            randomNeighbourCell.walls.forward = false;
                        } else {
                            currentCell.walls.forward = false;
                            randomNeighbourCell.walls.backward = false;
                        }
                    }
                } else {
                    if (currentCell.stair < randomNeighbourCell.stair) {
                        currentCell.walls.up = false;
                        randomNeighbourCell.walls.down = false;
                        currentCell.content = Cell.availableContents.get("elevatorUp");
                    } else {
                        currentCell.walls.down = false;
                        randomNeighbourCell.walls.up = false;
                        currentCell.content = Cell.availableContents.get("elevatorDown");
                    }
                }

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

        return new Maze3d(cells, startCell, goalCell);
    }

    getRandomNeighbourPosition(cell, startCell, stair, row, col) {
        let randomNeighbourPosition = {};
        let isValidPosition = false;
        while (isValidPosition === false) {
            isValidPosition = true;
            let randomLRFBUDPosition = Math.floor(Math.random() * 6);
            switch (randomLRFBUDPosition) {
                case 0:
                    // NOTE: In the start cell we can't go up or down as it will replace the "S" to "↑" or "↓" and we want to keep the "S" as the start cell.
                    if (cell !== startCell && cell.stair + 1 < stair) {
                        randomNeighbourPosition = {
                            stair: cell.stair + 1,
                            row: cell.row,
                            col: cell.col
                        };
                    } else {
                        isValidPosition = false;
                    }
                    break;
                case 1:
                    if (cell !== startCell && cell.stair - 1 >= 0) {
                        randomNeighbourPosition = {
                            stair: cell.stair - 1,
                            row: cell.row,
                            col: cell.col
                        };
                    }
                    else {
                        isValidPosition = false;
                    }
                    break;
                case 2:
                    if (cell.row + 1 < row) {
                        randomNeighbourPosition = {
                            stair: cell.stair,
                            row: cell.row + 1,
                            col: cell.col
                        };
                    }
                    else {
                        isValidPosition = false;
                    }
                    break;
                case 3:
                    if (cell.row - 1 >= 0) {
                        randomNeighbourPosition = {
                            stair: cell.stair,
                            row: cell.row - 1,
                            col: cell.col
                        };
                    }
                    else {
                        isValidPosition = false;
                    }
                    break;
                case 4:
                    if (cell.col + 1 < col) {
                        randomNeighbourPosition = {
                            stair: cell.stair,
                            row: cell.row,
                            col: cell.col + 1
                        };
                    }
                    else {
                        isValidPosition = false;
                    }
                    break;
                case 5:
                    if (cell.col - 1 >= 0) {
                        randomNeighbourPosition = {
                            stair: cell.stair,
                            row: cell.row,
                            col: cell.col - 1
                        };
                    }
                    else {
                        isValidPosition = false;
                    }
                    break;
            }
        }
        return randomNeighbourPosition;
    }


}

export default AldousbroderMaze3dGenerator;
