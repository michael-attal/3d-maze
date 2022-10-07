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
    /** @type {HTMLElement} */
    elemWhereToInsertTheGui

    cellContentsToImages;

    constructor(maze, showMultidimensionalMaze = true, playerImage, wallImage, freeCaseImage, elevatorUpImage, elevatorDownImage, elevatorUpAndDownImage, goalImage, elemWhereToInsertTheGui) {
        this.maze = maze;
        this.showMultidimensionalMaze = showMultidimensionalMaze;
        this.playerImage = playerImage;
        this.wallImage = wallImage;
        this.freeCaseImage = freeCaseImage;
        this.elevatorUpImage = elevatorUpImage;
        this.elevatorDownImage = elevatorDownImage;
        this.elevatorUpAndDownImage = elevatorUpAndDownImage;
        this.goalImage = goalImage;
        this.elemWhereToInsertTheGui = elemWhereToInsertTheGui;

        this.cellContentsToImages = new Map([
            [Cell.availableContents.get("empty"), freeCaseImage],
            [Cell.availableContents.get("startPosition"), playerImage],
            [Cell.availableContents.get("player"), playerImage],
            [Cell.availableContents.get("elevatorUp"), elevatorUpImage],
            [Cell.availableContents.get("elevatorDown"), elevatorDownImage],
            [Cell.availableContents.get("elevatorUpAndDown"), elevatorUpAndDownImage],
            [Cell.availableContents.get("goal"), goalImage],
        ])

    }


    generate() {

    }

    print() {
        let cells = [];
        for (let cell of this.maze.allCells) {
            // NOTE: Create a div for each cell of the maze that contains the image depending on the cell type.
            let cellDiv = document.createElement("div");
            cellDiv.className = "cell";

            // NOTE: Create a border to each wall of the cell if cell has a wall
            let wallsToBodersProperty = new Map([
                ["left", "borderLeft"],
                ["right", "borderRight"],
                ["forward", "borderTop"],
                ["backward", "borderBottom"],
            ]);
            let entries = Object.entries(cell.walls)

            entries.map(([key, val] = entry) => {
                if (key != "up" && key != "down") {
                    if (val === true) {
                        // TODO: Change by adding a class, like .border-top-cell ...
                        cellDiv.style[wallsToBodersProperty.get(key)] = "5px solid black";
                    } else {
                        cellDiv.style[wallsToBodersProperty.get(key)] = "5px solid white";
                    }
                }
            });

            cellDiv.style.backgroundImage = `url(${this.cellContentsToImages.get(cell.content)})`;
            cells.push(cellDiv);
        }

        for (let i = 0; i < cells.length; i++) {
            // NOTE: Separete each stair for a better visibility
            if (i % (this.maze.rows * this.maze.cols) === 0) {
                let sepStair = document.createElement("div");
                sepStair.className = "separator-stair";
                this.elemWhereToInsertTheGui.appendChild(sepStair);
                console.log("hey hooo");
            } else if (i % this.maze.rows === 0) {
                // NOTE: Break the inline-block rows here.
                let sepRow = document.createElement("div");
                sepRow.className = "separator-row";
                this.elemWhereToInsertTheGui.appendChild(sepRow);
            }
            this.elemWhereToInsertTheGui.appendChild(cells[i]);
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