import AldousbroderMaze3dGenerator from '../generators/aldousbroder-maze3d-generator.js';
import DfsMaze3dGenerator from '../generators/dfs-maze3d-generator.js';
import AStar from './a-star.js';
import AdapterMaze3dToSearchable from './adapter-maze3d-to-searchable.js';
import BreadthFirstSearch from './breadth-first-search.js';
import DepthFirstSearch from './depth-first-search.js';

class SearchDemo {

    run() {
        // let dfsMaze3dGenerator = new DfsMaze3dGenerator();
        // let maze = dfsMaze3dGenerator.generate(2, 5, 5); // NOTE: 2 stairs, 5 rows, 5 cols with DfsMaze3dGenerator
        let breadthFirstSearch = new BreadthFirstSearch();
        let depthFirstSearch = new DepthFirstSearch();
        let aStar = new AStar();
        let aldousbroderMaze3dGenerator = new AldousbroderMaze3dGenerator();
        let maze = aldousbroderMaze3dGenerator.generate(10, 50, 50); // NOTE: 2 stairs, 5 rows, 5 cols with AldousbroderMaze3dGenerator
        console.log(maze.toString());

        let adapterMaze3dToSearchableBfs = new AdapterMaze3dToSearchable(breadthFirstSearch, maze);
        let adapterMaze3dToSearchableDfs = new AdapterMaze3dToSearchable(depthFirstSearch, maze);
        let adapterMaze3dToSearchableAStar = new AdapterMaze3dToSearchable(aStar, maze);

        // NOTE: Commented for the moment, BFS taking to much time to get result with big maze. Uncomment and change the size of maze if you want to test it.
        // NOTE: BFS Results :
        // let searchResultBfs = adapterMaze3dToSearchableBfs.search();
        // if (searchResultBfs === "failure") {
        //     console.log("There is no solution for this maze!");
        // } else {
        //     console.log("Optimal number of moves to go to the goal in this maze with BFS : " + (searchResultBfs.solution.length));
        //     console.log("Number of cell visited to find the solution to this maze with BFS : " + searchResultBfs.stateVisited);
        // }

        console.log("\n------------\n\n");

        // NOTE: DFS Results :
        let searchResultDfs = adapterMaze3dToSearchableDfs.search();
        if (searchResultDfs === "failure") {
            console.log("There is no solution for this maze!");
        } else {
            console.log("We can find at least one solution from start cell to goal cell by doing " + (searchResultDfs.solution.length) + " moves (calculated by DFS). If they was more than one way to find a solution to this maze this number may not be the optimal number of moves to find a solution.");
            console.log("Number of cell visited to find the solution to this maze with DFS : " + searchResultDfs.stateVisited);
        }

        console.log("\n------------\n\n");

        // NOTE: A* Results :
        let searchResultAStar = adapterMaze3dToSearchableAStar.search();
        if (searchResultAStar === "failure") {
            console.log("There is no solution for this maze!");
        } else {
            console.log("Optimal number of moves to go to the goal in this maze with A* : " + searchResultAStar.solution.length);
            console.log("Number of cell visited to find the solution to this maze with A* : " + searchResultAStar.stateVisited);
        }
    }
}

export default SearchDemo;