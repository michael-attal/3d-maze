import { Cell, Maze3d } from "../maze3d.js";

class MazeGui {
    /** @type {Maze3d} */
    maze
    showMultidimensionalMaze
    playerImage
    wallImage
    freeCaseImage
    elevatorUpImage
    elevatorDownImage
    elevatorUpAndDownImage
    goalImage
    showMultidimensionalMaze
    elemToInsertTheGui

    constructor(maze, showMultidimensionalMaze = true, playerImage, wallImage, freeCaseImage, elevatorUpImage, elevatorDownImage, elevatorUpAndDownImage, goalImage, elemToInsertTheGui) {
        this.maze = maze;
        this.showMultidimensionalMaze = showMultidimensionalMaze;
        this.playerImage = playerImage;
        this.wallImage = wallImage;
        this.freeCaseImage = freeCaseImage;
        this.elevatorUpImage = elevatorUpImage;
        this.elevatorDownImage = elevatorDownImage;
        this.elevatorUpAndDownImage = elevatorUpAndDownImage;
        this.goalImage = goalImage;
        this.elemToInsertTheGui = elemToInsertTheGui;
    }

    generate() {

    }

    print() {
        for (let cell of this.maze.cells) {
            // Create a div for each cell of the maze that contains the image depending on the cell type.
            let cellDiv = document.createElement("div");
            cellDiv.style.width = "50px";

            // Create a div to each wall of the cell if cell has a wall
            if (cell.walls.top) {
                let topWallDiv = document.createElement("div");
                topWallDiv.style.width = "50px";
                topWallDiv.style.height = "5px";
                topWallDiv.style.backgroundColor = "black";
                cellDiv.appendChild(topWallDiv);
            }
            if (cell.walls.right) {
                let rightWallDiv = document.createElement("div");
                rightWallDiv.style.width = "5px";
                rightWallDiv.style.height = "50px";
                rightWallDiv.style.backgroundColor = "black";
                cellDiv.appendChild(rightWallDiv);
            }


            if (cell.content === Cell.availableContents.get("empty")) {
                cellDiv.style.backgroundImage = `url(${this.freeCaseImage})`;
            }
            else if (cell.content === Cell.availableContents.get("elevatorUp")) {
                cellDiv.style.backgroundImage = `url(${this.elevatorUpImage})`;
            }
            else if (cell.content === Cell.availableContents.get("elevatorDown")) {
                cellDiv.style.backgroundImage = `url(${this.elevatorDownImage})`;
            }
            else if (cell.content === Cell.availableContents.get("elevatorUpAndDown")) {
                cellDiv.style.backgroundImage = `url(${this.elevatorUpAndDownImage})`;
            }
            else if (cell.content === Cell.availableContents.get("goal")) {
                cellDiv.style.backgroundImage = `url(${this.goalImage})`;
            }
            else if (cell.content === Cell.availableContents.get("player")) {
                cellDiv.style.backgroundImage = `url(${this.playerImage})`;
            }


        }
    }

    printSolution() {

    }

    getHint() {
        // TODO: Call a function from a* for the next best move. (change the start position to the current player position)
    }

    saveMaze() {
        // TODO: Create another class to save the maze ?

    }

    loadMaze() {

    }

}

export default MazeGui;