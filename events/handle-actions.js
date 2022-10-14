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
        ["n", "up"],
        ["b", "down"],
    ]);
    /** @type {MazeGui} */
    #gui

    constructor(gui) {
        this.#gui = gui;
        this.addDirectionListenerToPage();
    }

    addDirectionListenerToPage() {
        document.body.addEventListener('keydown', e => {
            if (this.#gui.maze && HandleActions.arrowKeyToDirectionName.has(e.key)) {
                e.preventDefault();
                let direction = Cell.availableDirections.find(direct => direct.name === HandleActions.arrowKeyToDirectionName.get(e.key));
                let tryPosition = new DirectionHelper(direction.stair + this.#gui.maze.playerCell.stair, direction.row + this.#gui.maze.playerCell.row, direction.col + this.#gui.maze.playerCell.col, direction.name);

                console.log(tryPosition);
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
            this.#gui.playerName = this.#gui.menuHtmlElements.nameInput.value;
            this.#gui.generateMaze(this.#gui.menuHtmlElements.stairsInput.value, this.#gui.menuHtmlElements.rowsInput.value, this.#gui.menuHtmlElements.colsInput.value);
            this.#gui.printMaze();
            this.#gui.menuHtmlElements.searchAlgoLabel.hidden = false; // NOTE: Allow user to solve his game.
            this.#gui.menuHtmlElements.searchAlgoSelect.hidden = false;
            this.#gui.menuHtmlElements.solveGameBtn.hidden = false;
            this.#gui.menuHtmlElements.saveGameBtn.hidden = false; // NOTE: Allow user to save his game.
            this.#gui.menuHtmlElements.loadGameBtn.hidden = true; // NOTE: Hide load a previous game if user has started a game.
        });

    }

    addListenerToSolveGame() {

    }

    movePlayerTo(newPlayerCell) {
        const oldPlayerCell = this.#gui.maze.playerCell;
        this.#gui.maze.playerCell = newPlayerCell;
        this.#gui.printMovePlayerToNewCell(oldPlayerCell, newPlayerCell); // NOTE: Don't do a full print of the maze, but just update the 2 cells (for performance).
        if (newPlayerCell === this.#gui.maze.goalCell) {
            this.#gui.displayWinMessage();
        }
    }



}

export default HandleActions;