import { Cell, DirectionHelper, Maze3d } from "../maze3d.js";
import MazeGui from "../gui/maze-gui.js";

class HandleActions {
    static arrowKeyToDirectionName = new Map([
        ["ArrowLeft", "left"],
        ["ArrowRight", "right"],

        ["ArrowUp", "forward"],
        ["ArrowDown", "backward"],

        ["PgUp", "up"],
        ["PgDn", "down"],
        // NOTE: For keyboard without PgUp and PgDn key
        ["u", "up"],
        ["d", "down"],
    ]);
    /** @type {MazeGui} */
    #gui

    constructor(gui) {
        this.#gui = gui;
        this.addDirectionListenerToPage();
    }

    addDirectionListenerToPage() {
        document.body.addEventListener('keydown', e => {
            // NOTE: Handle move only if there is a generated maze and that the user is not editing an input field
            if (this.#gui.maze && HandleActions.arrowKeyToDirectionName.has(e.key) && e.target.constructor.name != "HTMLInputElement") {
                e.preventDefault();
                let direction = Cell.availableDirections.find(direct => direct.name === HandleActions.arrowKeyToDirectionName.get(e.key));
                let tryPosition = new DirectionHelper(direction.stair + this.#gui.maze.playerCell.stair, direction.row + this.#gui.maze.playerCell.row, direction.col + this.#gui.maze.playerCell.col, direction.name);

                if (this.#gui.maze.isValidPosition(tryPosition)) {
                    let newPlayerCell = this.#gui.maze.cells[tryPosition.stair][tryPosition.row][tryPosition.col];
                    if (this.#gui.maze.playerCell.walls[tryPosition.name] === false) {
                        // NOTE: If position is valid and there is no wall between player cell and the new cell, lets go!
                        this.movePlayerTo(newPlayerCell);
                    }
                }
            }
        });
    }

    addListenerToStartGame() {
        this.#gui.menuHtmlElements.startGameBtn.addEventListener("click", e => {
            this.#gui.generateMaze(this.#gui.menuHtmlElements.stairsInput.value, this.#gui.menuHtmlElements.rowsInput.value, this.#gui.menuHtmlElements.colsInput.value);
            this.#gui.printMaze();
            this.initGameStart();
        });
    }

    addListenerToSolveGame() {
        this.#gui.menuHtmlElements.solveGameBtn.addEventListener("click", e => {
            this.solveGameWithSearchAlgo(this.#gui.menuHtmlElements.searchAlgoSelect.value);
        });
    }

    addListenerToGetHint() {
        this.#gui.menuHtmlElements.getHintBtn.addEventListener("click", e => {
            this.getHint();
        });
    }

    addListenerToSaveGame() {
        this.#gui.menuHtmlElements.saveGameBtn.addEventListener("click", e => {
            this.saveGame(this.#gui.menuHtmlElements.nameInput.value);
        });
    }

    addListenerToLoadGame() {
        this.#gui.menuHtmlElements.loadGameBtn.addEventListener("click", e => {
            const gameToLoad = prompt("Please provide the name of the maze to load");
            this.loadGame(gameToLoad);
        });
    }

    movePlayerTo(newPlayerCell) {
        const oldPlayerCell = this.#gui.maze.playerCell;
        this.#gui.maze.playerCell = newPlayerCell;
        this.#gui.printMovePlayerToNewCell(oldPlayerCell, newPlayerCell); // NOTE: Don't do a full print of the maze, but just update the 2 cells (for performance).
        if (newPlayerCell === this.#gui.maze.goalCell) {
            this.#gui.displayWinMessage();
        }
    }

    solveGameWithSearchAlgo(searchAlgoName, onlyGetFirstMove = false) {
        const searchAlgo = this.#gui.searchAlgorithms.find(algo => algo.constructor.name === searchAlgoName);
        this.#gui.adapterToSearchAlgorithms.searchable = searchAlgo;
        this.#gui.adapterToSearchAlgorithms.maze3d = this.#gui.maze;
        // NOTE: Use current player cell as initial state
        const result = this.#gui.adapterToSearchAlgorithms.search(this.#gui.maze.playerCell);
        if (result === "failure") {
            alert("Oops an error occured, no path to exit was finded for this maze :(")
        } else {
            let moveSolutionIndex = result.solution.length - 1;
            const moveInterval = setInterval(() => {
                if (onlyGetFirstMove) {
                    this.movePlayerTo(result.solution[moveSolutionIndex].state);
                    clearInterval(moveInterval);
                } else {
                    if (moveSolutionIndex != -1) {
                        this.movePlayerTo(result.solution[moveSolutionIndex].state);
                    } else {
                        clearInterval(moveInterval);
                    }
                    moveSolutionIndex--;
                }
            }, 250);
        }
    }

    /**
     * 
     * @param {Array<String>} availableSearchAlgosNames 
     */
    getHint() {
        // NOTE: Only get the first best move from the current player position with the A* search algorithm.
        let searchAlgoName = "AStar"; // Best search algorithm
        // NOTE: Check that the AStar exist in the select options, else take the available one.
        if (!document.getElementById("search-algo").innerHTML.includes(`value="${searchAlgoName}"`)) {
            searchAlgoName = this.#gui.menuHtmlElements.searchAlgoSelect.value;
        }
        const onlyGetFirstMove = true;
        this.solveGameWithSearchAlgo(searchAlgoName, onlyGetFirstMove);
    }

    saveGame(gameName) {
        // NOTE: Save the current maze to the local storage.
        localStorage.setItem(gameName, JSON.stringify(this.#gui.maze.toJSON()));
    }

    loadGame(gameName) {
        // NOTE: Load the maze from the local storage, print it and update the input fields value as well.
        const mazeStored = localStorage.getItem(gameName);
        if (mazeStored) {
            const maze = Maze3d.createMaze3dFromJSON(JSON.parse(mazeStored));
            this.#gui.maze = maze;
            this.#gui.printMaze();
            this.#gui.menuHtmlElements.nameInput.value = gameName;
            this.#gui.menuHtmlElements.stairsInput.value = maze.stairs;
            this.#gui.menuHtmlElements.rowsInput.value = maze.rows;
            this.#gui.menuHtmlElements.colsInput.value = maze.cols;
            this.initGameStart();
            alert("Game loaded!");
        } else {
            alert("Error: No maze found with this name!");
        }
    }

    initGameStart() {
        const playerStairDiv = document.getElementById("current-player-stair");
        playerStairDiv.scrollIntoView({
            behavior: 'auto',
            block: 'center',
            inline: 'center'
        });
        this.#gui.menuHtmlElements.getHintBtn.hidden = false; // NOTE: Allow user to get a hint for the current maze.
        this.addListenerToGetHint();
        this.#gui.menuHtmlElements.searchAlgoLabel.hidden = false; // NOTE: Allow user to solve his game.
        this.addListenerToSolveGame();
        this.#gui.menuHtmlElements.searchAlgoSelect.hidden = false;
        this.#gui.menuHtmlElements.solveGameBtn.hidden = false;
        this.#gui.menuHtmlElements.saveGameBtn.hidden = false; // NOTE: Allow user to save his game.
        this.addListenerToSaveGame();
        this.#gui.menuHtmlElements.loadGameBtn.hidden = true; // NOTE: Hide load a previous game if user has started a game.
    }

}

export default HandleActions;