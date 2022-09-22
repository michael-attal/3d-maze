import AldousbroderMaze3dGenerator from '../generators/aldousbroder-maze3d-generator.js';
import DfsMaze3dGenerator from '../generators/dfs-maze3d-generator.js';
import AdapterMaze3dToSearchable from './adapter-maze3d-to-searchable.js';
import BreadthFirstSearch from './breadth-first-search.js';

class SearchDemo {

    run() {
        // let dfsMaze3dGenerator = new DfsMaze3dGenerator();
        // let maze = dfsMaze3dGenerator.generate(3, 5, 5); // NOTE: 3 stairs, 5 rows, 5 cols with DfsMaze3dGenerator
        let breadthFirstSearch = new BreadthFirstSearch();
        let aldousbroderMaze3dGenerator = new AldousbroderMaze3dGenerator();
        let maze = aldousbroderMaze3dGenerator.generate(3, 5, 5); // NOTE: 3 stairs, 5 rows, 5 cols with AldousbroderMaze3dGenerator
        console.log(maze.toString());

        let adapterMaze3dToSearchable = new AdapterMaze3dToSearchable(breadthFirstSearch, maze);

        let searchResult = adapterMaze3dToSearchable.search();
        if (searchResult === "failure") {
            console.log("There is no solution for this maze!");
        } else {
            console.log("Optimal number of moves to find the goal in this maze : " + searchResult.solution.length + 1); // NOTE: Don't forget to add the last step to the goal cell.
            console.log("Number of cell visited to find the solution to this maze : " + searchResult.stateVisited);
        }
    }
}

export default SearchDemo;