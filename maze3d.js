class DirectionHelper {
    stair
    row
    col
    direction
    oppositeDirection

    static oppositeDirections = new Map([
        ["left", "right"],
        ["right", "left"],
        ["forward", "backward"],
        ["backward", "forward"],
        ["up", "down"],
        ["down", "up"],
    ]);


    constructor(stair, row, col, direction) {
        this.stair = stair;
        this.row = row;
        this.col = col
        this.direction = direction;
        this.oppositeDirection = DirectionHelper.oppositeDirections.get(direction);
    }

    get arrFormat() {
        return [this.stair, this.row, this.col];
    }

    /** Alias of direction property */
    get name() {
        return this.direction;
    }
}

class Cell {

    /** @type {Map<String, String} */
    static availableContents = new Map([
        ["empty", " "],
        ["startPosition", "S"],
        ["goal", "G"],
        ["elevatorUp", "↑"],
        ["elevatorDown", "↓"],
        ["elevatorUpAndDown", "↕"],
    ]);

    /** @type {Array<DirectionHelper>} */
    static availableDirections = [
        new DirectionHelper(0, 0, -1, "left"),
        new DirectionHelper(0, 0, 1, "right"),
        new DirectionHelper(0, -1, 0, "forward"),
        new DirectionHelper(0, 1, 0, "backward"),
        new DirectionHelper(-1, 0, 0, "down"),
        new DirectionHelper(1, 0, 0, "up"),
    ];

    /** @type {Map<String, String} */
    static contentNameFromDirectionName = new Map([
        ["left", "empty"],
        ["right", "empty"],
        ["forward", "empty"],
        ["backward", "empty"],
        ["up", "elevatorUp"],
        ["down", "elevatorDown"],
    ]);

    /**
     * 
     * @param {String} name of the direction (e.g. left)
     * @returns {String} the content of the direction (e.g. elevatorUp for the up direction)
     */
    static getCellContentFromDirectionName(name) {
        return Cell.availableContents.get(Cell.contentNameFromDirectionName.get(name));
    }

    static createCellFromJSON(walls, position, content) {
        const cell = new Cell();
        cell.walls = walls;
        cell.position = position;
        cell.content = content;
        return cell;
    }

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
            up: true,
            down: true
        };
        this.content = " "; // NOTE: Init at empty cell, can be one of the following: empty -> " ", startPosition -> "S", goal -> "G", elevatorUp -> "↑", elevatorDown -> "↓", elevatorUpAndDown -> "↕"

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

    get position() {
        return this.#position;
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

    set position(position) {
        this.#position = position;
    }

    toString() {
        let cellStrFormatted = "";
        cellStrFormatted += "Position of the cell: stair: " + this.stair + ", row: " + this.row + ", col: " + this.col + ".\n";
        cellStrFormatted += "Walls of the cell: " + JSON.stringify(this.#walls) + "\n";
        cellStrFormatted += 'Content of the cell: "' + this.content + '".\n';
        return cellStrFormatted;
    }

    toJSON() {
        return {
            walls: this.walls,
            position: this.position,
            content: this.content,
        }
    }
}

class Maze3d {
    /** @type {Array<Array<Array<Cell>>>} */
    #cells
    /** @type {Cell} */
    #startCell // NOTE: The start cell of the maze
    /** @type {Cell} */
    #goalCell // NOTE: The exit cell of the maze is the goalCell
    /** @type {Cell} */
    #playerCell // NOTE: The current location of the player. (initialy at the start position of the maze)

    static createMaze3dFromJSON(mazeJSON) {
        const cellsJSON = mazeJSON.cells;
        const startCellJSON = mazeJSON.startCell;
        const playerCellJSON = mazeJSON.playerCell;
        const goalCellJSON = mazeJSON.goalCell;
        const limitMazeJSON = mazeJSON.limitMaze;

        let cells = [];
        let cellsFormatted = [];
        let startCell;
        let playerCell = false;
        let goalCell;
        for (let cell of cellsJSON) {
            const newCell = Cell.createCellFromJSON(cell.walls, cell.position, cell.content);
            cells.push(newCell);

            if (JSON.stringify(playerCellJSON.position) === JSON.stringify(newCell.position)) {
                playerCell = newCell;
            }

            if (JSON.stringify(startCellJSON.position) === JSON.stringify(newCell.position)) {
                startCell = newCell;
            } else if (JSON.stringify(goalCellJSON.position) === JSON.stringify(newCell.position)) {
                goalCell = newCell;
            }
        }

        // NOTE: Create the cells in a z, y, x formatted way
        const stairs = limitMazeJSON.stairs;
        const rows = limitMazeJSON.rows;
        const cols = limitMazeJSON.cols;
        for (let z = 0; z < stairs; z++) {
            cellsFormatted[z] = [];
            for (let y = 0; y < rows; y++) {
                cellsFormatted[z][y] = [];
                for (let x = 0; x < cols; x++) {
                    cellsFormatted[z][y][x] = cells.shift();
                }
            }
        }

        return new Maze3d(cellsFormatted, startCell, goalCell, playerCell);
    }

    constructor(cells, startCell, goalCell, playerCell = false) {
        // NOTE: z,y,x array of cell objects where z represent the stair, y the row and x the column. Example : cells[1][2][3] contain the cell at z=1, y=2, x=3 position in the maze
        this.cells = cells;
        this.startCell = startCell
        this.goalCell = goalCell;
        if (playerCell) {
            this.playerCell = playerCell;
        } else {
            this.playerCell = startCell;
        }
    }

    get cells() {
        return this.#cells;
    }

    /** @type {Array<Cell>} */
    get allCells() {
        let allCells = [];
        for (let z = 0; z < this.stairs; z++) {
            for (let y = 0; y < this.rows; y++) {
                for (let x = 0; x < this.cols; x++) {
                    allCells.push(this.#cells[z][y][x])
                }
            }
        }
        return allCells;
    }

    get startCell() {
        return this.#startCell;
    }

    get goalCell() {
        return this.#goalCell;
    }

    /** @type {Cell} */
    get playerCell() {
        return this.#playerCell;
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

    set playerCell(cell) {
        this.#playerCell = cell;
    }

    get stairs() {
        return this.cells.length;

    }

    get rows() {
        return this.cells[0].length;

    }

    get cols() {
        return this.cells[0][0].length;
    }

    get numberOfCells() {
        return this.stairs * this.rows * this.cols;
    }

    getCellIndexFromAllCells(cell) {
        const stairCount = cell.stair * (this.rows * this.cols);
        const rowCount = cell.row * this.cols;
        const colCount = cell.col;
        return stairCount + rowCount + colCount;
    }

    /**
     * 
     * @param {DirectionHelper} position 
     * @returns {bool} true if the given position is valid inside this maze.
     */
    isValidPosition(position) {
        // NOTE: A valid position is when one of these conditions is meet:
        //       the cell is going down and there is no down stair,
        //       or if the cell is going up and there is no up stair,
        //       or if the cell is going left and the cell is at the border left of the maze,
        //       or if the cell is going right and the cell is at the border right of the maze,
        //       or if the cell is going forward and the cell is at the border top of the maze,
        //       or if the cell is going backward and the cell is at the border bottom of the maze,
        if (position.stair >= 0 && position.stair < this.stairs &&
            position.row >= 0 && position.row < this.rows &&
            position.col >= 0 && position.col < this.cols) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 
     * @returns {String} Return a string representation of the maze
     *   Example:
     *   -----------
     *   |G| |S|↑|↓|
     *   | +-+ + + |
     *   | |   | | |
     *   | +   + +-|
     *   | |       |
     *   | +-+-+ + |
     *   | |   | | |
     *   | +-+-+ + |
     *   |       | |
     *   -----------
     */
    toString() {
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


    toJSON() {
        let cellsJSON = [];
        for (let cell of this.allCells) {
            cellsJSON.push(cell.toJSON());
        }


        return {
            cells: cellsJSON,
            startCell: this.startCell.toJSON(),
            goalCell: this.goalCell.toJSON(),
            playerCell: this.playerCell.toJSON(),
            limitMaze: { stairs: this.stairs, rows: this.rows, cols: this.cols },
        }
    }
}


export { DirectionHelper, Cell, Maze3d };