import HandleActions from "../events/handle-actions.js";
import DfsMaze3dGenerator from "../generators/dfs-maze3d-generator.js";
import { Cell, Maze3d } from "../maze3d.js";

class MazeGui {
    /** @type {Maze3d} */
    maze
    mazeGenerator
    playerImage
    playerName
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
    handleActions;
    menuHtmlElements;


    constructor(mazeGenerator, playerImage, wallImage, freeCaseImage, elevatorUpImage, elevatorDownImage, elevatorUpAndDownImage, goalImage, elemWhereToInsertTheGui) {
        this.handleActions = new HandleActions(this);
        this.mazeGenerator = mazeGenerator;
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
            [Cell.availableContents.get("elevatorUp"), elevatorUpImage],
            [Cell.availableContents.get("elevatorDown"), elevatorDownImage],
            [Cell.availableContents.get("elevatorUpAndDown"), elevatorUpAndDownImage],
            [Cell.availableContents.get("goal"), goalImage],
        ])

    }


    generateMaze(stairs, rows, cols) {
        this.maze = this.mazeGenerator.generate(stairs, rows, cols);
    }

    print() {
        this.printMenu();
        this.printMaze();
    }

    printMenu() {
        const menuSection = document.createElement("section");
        menuSection.id = "menu";

        const nameLabel = document.createElement("label");
        const nameInput = document.createElement("input");
        nameInput.id = "name";

        const stairsLabel = document.createElement("label");
        const stairsInput = document.createElement("input");
        stairsInput.id = "stairs";

        const rowsLabel = document.createElement("label");
        const rowsInput = document.createElement("input");
        rowsInput.id = "rows";

        const colsLabel = document.createElement("label");
        const colsInput = document.createElement("input");
        colsInput.id = "cols";

        const startGameBtn = document.createElement("button");
        startGameBtn.id = "start-game-btn";
        startGameBtn.textContent = "Start New Game";

        const searchAlgoLabel = document.createElement("label");
        const searchAlgoSelect = document.createElement("select");
        searchAlgoSelect.id = "search-algo";
        searchAlgoLabel.hidden = true; // NOTE: Hide until a maze is generated.
        searchAlgoSelect.hidden = true;

        const solveGameBtn = document.createElement("button");
        solveGameBtn.id = "solve-game-btn";
        solveGameBtn.textContent = "Solve game";
        solveGameBtn.hidden = true;

        const saveGameBtn = document.createElement("button");
        saveGameBtn.id = "save-game-btn";
        saveGameBtn.textContent = "Save current game";
        saveGameBtn.hidden = true;

        const loadGameBtn = document.createElement("button");
        loadGameBtn.id = "load-game-btn";
        loadGameBtn.textContent = "Load a previous game";

        nameLabel.textContent = "Name";
        nameLabel.setAttribute("for", nameInput.id);

        stairsLabel.textContent = "Stairs";
        stairsLabel.setAttribute("for", stairsInput.id);

        rowsLabel.textContent = "Rows";
        rowsLabel.setAttribute("for", rowsInput.id);

        colsLabel.textContent = "Cols";
        colsLabel.setAttribute("for", colsInput.id);

        searchAlgoLabel.textContent = "Search Algo";
        searchAlgoLabel.setAttribute("for", searchAlgoSelect.id);

        // FIXME TO DELETE AFTER TEST FINISH
        nameInput.value = "Michaël";
        stairsInput.value = "4";
        rowsInput.value = "3";
        colsInput.value = "5";
        // FIXME TO DELETE AFTER TEST FINISH


        menuSection.appendChild(nameLabel);
        menuSection.appendChild(nameInput);
        menuSection.appendChild(stairsLabel);
        menuSection.appendChild(stairsInput);
        menuSection.appendChild(rowsLabel);
        menuSection.appendChild(rowsInput);
        menuSection.appendChild(colsLabel);
        menuSection.appendChild(colsInput);
        menuSection.appendChild(startGameBtn);
        menuSection.appendChild(searchAlgoLabel);
        menuSection.appendChild(searchAlgoSelect);
        menuSection.appendChild(solveGameBtn);
        menuSection.appendChild(saveGameBtn);
        menuSection.appendChild(loadGameBtn);

        this.menuHtmlElements = {
            section: menuSection,
            nameInput: nameInput,
            stairsInput: stairsInput,
            rowsInput: rowsInput,
            colsInput: colsInput,
            startGameBtn: startGameBtn,
            searchAlgoLabel: searchAlgoLabel,
            searchAlgoSelect: searchAlgoSelect,
            solveGameBtn: solveGameBtn,
            saveGameBtn: saveGameBtn,
            loadGameBtn: loadGameBtn,
        }

        this.elemWhereToInsertTheGui.appendChild(menuSection);
        const mazeSection = document.createElement("section"); // NOTE: Create an empty section for a better UX when maze game is not started.
        mazeSection.id = "maze";
        this.elemWhereToInsertTheGui.appendChild(mazeSection);
        this.handleActions.addListenerToStartGame();
    }

    printMaze() {
        console.log(this.maze.toString()); // NOTE: Display it also in console log.
        let mazeSection = document.getElementById("maze");
        if (!mazeSection) {
            mazeSection = document.createElement("section");
            mazeSection.id = "maze";
        } else {
            mazeSection.innerHTML = "";
        }

        let cells = [];
        const cellWidth = 50;
        const cellHeight = 50;

        for (let cell of this.maze.allCells) {
            // NOTE: Create a div for each cell of the maze that contains the image depending on the cell type.
            let cellDiv = document.createElement("div");
            cellDiv.className = "cell";
            cellDiv.style.width = cellWidth + "px";
            cellDiv.style.height = cellHeight + "px";

            // NOTE: Create a border to each wall of the cell if cell has a wall
            let wallsToBodersProperty = new Map([
                ["left", "borderLeft"],
                ["right", "borderRight"],
                ["forward", "borderTop"],
                ["backward", "borderBottom"],
            ]);
            let wallsToPaddingsProperty = new Map([
                ["left", "paddingLeft"],
                ["right", "paddingRight"],
                ["forward", "paddingTop"],
                ["backward", "paddingBottom"],
            ]);
            let entries = Object.entries(cell.walls)

            let fullWallsCell = true;
            entries.map(([key, val] = entry) => {
                // NOTE: Used to show a block of background black
                if (val === false) {
                    fullWallsCell = false;
                }

                if (key != "up" && key != "down") {
                    if (val === true) {
                        // TODO: Change by adding a class, like .border-top-cell ...
                        cellDiv.style[wallsToBodersProperty.get(key)] = "5px solid black";
                    } else {
                        cellDiv.style[wallsToPaddingsProperty.get(key)] = "5px";
                    }
                }
            });
            if (fullWallsCell) {
                cellDiv.style.backgroundColor = "black";
            }

            if (this.maze.playerCell === cell) {
                cellDiv.style.backgroundImage = `url(${this.playerImage}), url(${this.cellContentsToImages.get(cell.content)})`;
            } else {
                cellDiv.style.backgroundImage = `url(${this.cellContentsToImages.get(cell.content)})`;
            }
            cells.push(cellDiv);
        }

        for (let i = 0; i < cells.length; i++) {
            // NOTE: Separete each stair for a better visibility
            if (i % (this.maze.rows * this.maze.cols) === 0) {
                let sepStair = document.createElement("div");
                sepStair.className = "separator-stair";
                mazeSection.appendChild(sepStair);
            } else if (i % this.maze.cols === 0) {
                // NOTE: Break the inline-block rows here.
                let sepRow = document.createElement("div");
                sepRow.className = "separator-row";
                mazeSection.appendChild(sepRow);
            }
            mazeSection.appendChild(cells[i]);
        }

        mazeSection.style.minWidth = cellWidth * (this.maze.cols + 1) + "px";
        this.elemWhereToInsertTheGui.appendChild(mazeSection);
    }

    /**
     * 
     * @param {Cell} oldPlayerCell 
     * @param {Cell} newPlayerCell 
     */
    printMovePlayerToNewCell(oldPlayerCell, newPlayerCell) {
        const cellsDiv = document.getElementsByClassName("cell");

        const oldCellIndexPosition = this.maze.getCellIndexFromAllCells(oldPlayerCell);
        const oldPlayerCellDiv = cellsDiv[oldCellIndexPosition];

        const newCellIndexPosition = this.maze.getCellIndexFromAllCells(newPlayerCell);
        const newPlayerCellDiv = cellsDiv[newCellIndexPosition];

        oldPlayerCellDiv.style.backgroundImage = `url(${this.cellContentsToImages.get(oldPlayerCell.content)})`;
        newPlayerCellDiv.style.backgroundImage = `url(${this.playerImage}), url(${this.cellContentsToImages.get(newPlayerCell.content)})`;
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

    displayWinMessage() {
        const winMessageDiv = document.createElement("div");
        winMessageDiv.id = "win-message";
        winMessageDiv.innerHTML = `
        <h3>Congratulations ${this.playerName} 🎉</h3>
        <p>You find the exit of the maze!<br>Try again with more stairs/rows/cols.</p>
        <a href="#" id="close-win-message">&times; Close this message</a>
        `;
        document.getElementById("menu").appendChild(winMessageDiv);
        const closeWinMessage = document.getElementById("close-win-message");
        closeWinMessage.addEventListener("click", () => {
            winMessageDiv.remove();
        });
    }

}

export default MazeGui;