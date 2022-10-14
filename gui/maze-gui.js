import HandleActions from "../events/handle-actions.js";
import DfsMaze3dGenerator from "../generators/dfs-maze3d-generator.js";
import { Cell, Maze3d } from "../maze3d.js";
import AdapterMaze3dToSearchable from "../search-algorithms/adapter-maze3d-to-searchable.js";
import { Searchable } from "../search-algorithms/searchable.js";

class MazeGui {
    /** @type {Maze3d} */
    maze
    mazeGenerator
    /** @type {Array<Searchable>} */
    searchAlgorithms
    /** @type {AdapterMaze3dToSearchable} */
    adapterToSearchAlgorithms
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


    constructor(mazeGenerator, searchAlgorithms, adapterToSearchAlgorithms, playerImage, wallImage, freeCaseImage, elevatorUpImage, elevatorDownImage, elevatorUpAndDownImage, goalImage, elemWhereToInsertTheGui) {
        this.handleActions = new HandleActions(this);
        this.mazeGenerator = mazeGenerator;
        this.searchAlgorithms = searchAlgorithms;
        this.adapterToSearchAlgorithms = adapterToSearchAlgorithms;
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
        for (const searchAlgo of this.searchAlgorithms) {
            const option = new Option(searchAlgo.constructor.name, searchAlgo.constructor.name);
            if (searchAlgo.constructor.name === "AStar") {
                option.selected = true;
            }
            searchAlgoSelect.options.add(option);
        }
        searchAlgoSelect.id = "search-algo";
        searchAlgoLabel.hidden = true; // NOTE: Hide until a maze is generated.
        searchAlgoSelect.hidden = true;

        const solveGameBtn = document.createElement("button");
        solveGameBtn.id = "solve-game-btn";
        solveGameBtn.textContent = "Solve game";
        solveGameBtn.hidden = true;

        const getHintBtn = document.createElement("button");
        getHintBtn.id = "get-hint-btn";
        getHintBtn.textContent = "Get a hint";
        getHintBtn.hidden = true;

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
        nameInput.value = "First maze of Michaël";
        stairsInput.value = "4";
        rowsInput.value = "5";
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
        menuSection.appendChild(getHintBtn);
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
            getHintBtn: getHintBtn,
        }

        this.elemWhereToInsertTheGui.appendChild(menuSection);
        const mazeSection = document.createElement("section"); // NOTE: Create an empty section for a better UX when maze game is not started.
        mazeSection.id = "maze";
        this.elemWhereToInsertTheGui.appendChild(mazeSection);
        // NOTE: Add the listeners after the elements are added to the DOM.
        this.handleActions.addListenerToStartGame();
        this.handleActions.addListenerToLoadGame();
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

            cellDiv.setAttribute('stair', cell.stair);
            cellDiv.setAttribute('row', cell.row);
            cellDiv.setAttribute('col', cell.col);

            cells.push(cellDiv);
        }

        let stairDivs = [];
        let stairIdx = -1;
        for (let i = 0; i < cells.length; i++) {
            const currentStair = Number(cells[i].getAttribute('stair'));
            // NOTE: Separete each stair for a better visibility
            if (i % (this.maze.rows * this.maze.cols) === 0) {
                stairIdx++;
                stairDivs.push(document.createElement("div"));
                stairDivs[stairIdx].className = "maze-stair";

                if (this.maze.playerCell.stair === currentStair) {
                    stairDivs[stairIdx].id = "current-player-stair";
                }

            } else if (i % this.maze.cols === 0) {
                // NOTE: Break the inline-block rows here.
                let sepRow = document.createElement("div");
                sepRow.className = "separator-row";
                stairDivs[stairIdx].appendChild(sepRow);
            }
            stairDivs[stairIdx].appendChild(cells[i]);
        }
        for (let i = 0; i < stairDivs.length; i++) {
            let sepStair = document.createElement("div");
            sepStair.className = "separator-stair";
            // NOTE: Add separator except for the first stair
            if (i != 0) {
                mazeSection.appendChild(sepStair);
            }
            mazeSection.appendChild(stairDivs[i]);
        }

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

        // NOTE: Also update the current stair (to add the transform effect)
        if (oldPlayerCell.stair != newPlayerCell.stair) {
            const oldPlayerStairDiv = document.getElementById("current-player-stair");
            oldPlayerStairDiv.id = "";
            const newPlayerStairDiv = document.getElementsByClassName("maze-stair")[newPlayerCell.stair];
            newPlayerStairDiv.id = "current-player-stair";
            newPlayerCellDiv.scrollIntoView({
                behavior: 'auto',
                block: 'center',
                inline: 'center'
            });
        }
    }

    /**
     * 
     * @param {Cell} cellToGo 
     */
    displayHint(cellToGo) {
        // FIXME À FAIRE:
        // TODO: Get the first item in solution from the searchable algorithm and print it in menu panel, e.g. "Try this: move to the right".
        // Or add a background image with a hint arrow.
        // Do the 2 things above.
        console.log("continue here");
        // NOTE: Get the cell div to add the hint image
        const divHint = document.createElement("div");
        divHint.className = "hint";
        divHint.innerHTML = "Hint: ";
        const cellIndexPosition = this.maze.getCellIndexFromAllCells(cellToGo);
        const cellDiv = document.getElementsByClassName("cell")[cellIndexPosition];
        // TODO: Finish here to add hint image (and remove the image after the user has a new position - remove also text hint).

        const menu = document.getElementById("menu");
        // menu.appendChild(divHint);

        console.log(cellToGo);
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