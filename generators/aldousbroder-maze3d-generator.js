import Maze3DGenerator from './maze3d-generator.js';
import { Cell, Maze3d } from '../maze3d.js';

class AldousbroderMaze3dGenerator extends Maze3DGenerator {

    constructor() {
        super();
    }

    generate(stair, row, col) {
        // NOTE: Create the cells
        let cells = this.createCells(stair, row, col);

        // FIXME: Implement this method, see: https://en.wikipedia.org/wiki/Maze_generation_algorithm#Aldous-Broder_algorithm

    }

}

export default AldousbroderMaze3dGenerator;
