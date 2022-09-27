class Cell {
    static availableContents = new Map([
        ["empty", " "],
        ["startPosition", "S"],
        ["goal", "G"],
        ["player", "P"],
        ["elevatorUp", "↑"],
        ["elevatorDown", "↓"],
        ["elevatorUpAndDown", "↕"],
    ]);

    #walls
    #content
    #position

    /**
     * 
     * @param {int} z is the stair of the cell
     * @param {int} y is the row of the cell
     * @param {int} x is the col of the cell
     */
    constructor(z, y, x) {
        this.walls = {
            left: true,
            right: true,
            forward: true,
            backward: true,
            up: false,
            down: false
        };
        this.content = " "; // NOTE: Init at empty cell, can be one of the following: empty -> " ", startPosition -> "S", goal -> "G", player -> "P", elevatorUp -> "↑", elevatorDown -> "↓", elevatorUpAndDown -> "↕"

        // NOTE: Save the position of the cell from the maze inside the cell itselft for simplicity of the code later
        this.#position = {
            z: z,
            y: y,
            x: x
        }
    }

    get stair() {
        return this.#position.z;
    }

    get row() {
        return this.#position.y;
    }

    get col() {
        return this.#position.x;
    }

    get walls() {
        return this.#walls;
    }

    get content() {
        return this.#content;
    }

    set walls(walls) {
        this.#walls = walls;
    }

    set content(content) {
        this.#content = content;
    }

    toString() {
        let cellStrFormatted = "";
        cellStrFormatted += "Position of the cell: stair: " + this.stair + ", row: " + this.row + ", col: " + this.col + ".\n";
        cellStrFormatted += "Walls of the cell: " + JSON.stringify(this.#walls) + "\n";
        cellStrFormatted += 'Content of the cell: "' + this.content + '".\n';
        return cellStrFormatted;
    }

}

class Maze3d {
    /** @type {Array<Array<Array<Cell>>>} */
    #cells
    /** @type {Cell} */
    #startCell // NOTE: The start cell of the maze - Currently not used in Maze3d class but can be used in the future
    /** @type {Cell} */
    #goalCell // NOTE: The exit cell of the maze is the goalCell - Currently not used in Maze3d class but can be used in the future

    constructor(cells, startCell, goalCell) {
        // NOTE: z,y,x array of cell objects where z represent the stair, y the row and x the column. Example : cells[1][2][3] contain the cell at z=1, y=2, x=3 position in the maze
        this.cells = cells;
        this.startCell = startCell
        this.goalCell = goalCell;
    }

    get cells() {
        return this.#cells;
    }

    get startCell() {
        return this.#startCell;
    }

    get goalCell() {
        return this.#goalCell;
    }

    getCell(x, y, z) {
        return this.#cells[z][y][x];
    }

    setCell(x, y, z, cell) {
        this.#cells[z][y][x] = cell;
    }

    set cells(cells) {
        this.#cells = cells;
    }

    set startCell(cell) {
        this.#startCell = cell;
    }

    set goalCell(cell) {
        this.#goalCell = cell;
    }



    toString() {
        // Return a string representation of the maze
        // Example:
        // -----------
        // |G| |S|↑|↓|
        // | +-+ + + |
        // | |   | | |
        // | +   + +-|
        // | |       |
        // | +-+-+ + |
        // | |   | | |
        // | +-+-+ + |
        // |       | |
        // -----------

        let mazeStr = "";
        let stair = this.#cells.length;
        let row = this.#cells[0].length;
        let col = this.#cells[0][0].length;

        let topAndBottomBorderOfMaze = "-".repeat(col * 2 + 1);

        mazeStr += topAndBottomBorderOfMaze + "\n";
        for (let z = 0; z < stair; z++) {
            for (let y = 0; y < row; y++) {
                mazeStr += "|";
                for (let x = 0; x < col; x++) {
                    /** @type {Cell} */
                    let cell = this.#cells[z][y][x];

                    mazeStr += cell.content;

                    if (cell.walls["right"]) {
                        if (x === col - 1) {
                            mazeStr += "| ";
                        } else {
                            mazeStr += "|";
                        }
                    } else {
                        mazeStr += " ";
                    }

                }
                mazeStr += "\n";
                if (y < row - 1) {
                    for (let x = 0; x < col; x++) {
                        /** @type {Cell} */
                        let cell = this.#cells[z][y][x];
                        if (x === 0) {
                            mazeStr += "|";
                        }

                        if (cell.walls["backward"]) {
                            if (x === col - 1) {
                                mazeStr += "-";
                            } else {
                                mazeStr += "-+";
                            }
                        } else {
                            if (x === col - 1) {
                                mazeStr += " ";
                            } else {
                                mazeStr += " +";
                            }
                        }

                        if (x === col - 1) {
                            mazeStr += "|";
                        }
                    }
                    mazeStr += "\n";
                }
            }
            mazeStr += topAndBottomBorderOfMaze + "\n";
        }
        return mazeStr;
    }
}


export { Cell, Maze3d };