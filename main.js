import SimpleMaze3dGenerator from './generators/simple-maze3d-generator.js';
import DfsMaze3dGenerator from './generators/dfs-maze3d-generator.js';
import AldousbroderMaze3dGenerator from './generators/aldousbroder-maze3d-generator.js';
import SearchDemo from './search-algorithms/search-demo.js';
import MazeGui from './gui/maze-gui.js';


// SECTION: Uncomment to see results
// let maze;
// let simpleMaze3dGenerator = new SimpleMaze3dGenerator();
// maze = simpleMaze3dGenerator.generate(3, 5, 5); // NOTE: 3 stairs, 5 rows, 5 cols with SimpleMaze3dGenerator
// console.log(maze.toString());

// let dfsMaze3dGenerator = new DfsMaze3dGenerator();
// maze = dfsMaze3dGenerator.generate(3, 5, 5); // NOTE: 3 stairs, 5 rows, 5 cols with DfsMaze3dGenerator
// console.log(maze.toString());

// let aldousbroderMaze3dGenerator = new AldousbroderMaze3dGenerator();
// maze = aldousbroderMaze3dGenerator.generate(3, 5, 5); // NOTE: 3 stairs, 5 rows, 5 cols with AldousbroderMaze3dGenerator
// console.log(maze.toString());

// console.log("Search demo :");
// let searchDemo = new SearchDemo();
// searchDemo.run();
// !SECTION: End: Uncomment to see results



// SECTION: Gui section
const mazeGuiSettings = {
    mazeGenerator: new AldousbroderMaze3dGenerator(), // NOTE: Or DfsMaze3dGenerator
    playerImage: "./assets/images/hercule.webp",
    wallImage: "./assets/images/wall.jpg",
    freeCaseImage: "./assets/images/transparent_background.png",
    elevatorUpImage: "./assets/images/elevator_up.png",
    elevatorDownImage: "./assets/images/elevator_down.png",
    elevatorUpAndDownImage: "./assets/images/elevator_up_and_down.png",
    goalImage: "./assets/images/exit.png",
    elemWhereToInsertTheGui: document.getElementById("maze-gui"),
}
let mazeGui = new MazeGui(...Object.values(mazeGuiSettings));

mazeGui.printMenu();
// !SECTION: End: Gui section



// SECTION Measure algorithm in time section
// console.log(simpleMaze3dGenerator.measureAlgorithmTime([30, 50, 50])); // NOTE: Uncomment this line to see the time it take to generate a 30x50x50 maze with SimpleMaze3dGenerator class.
// console.log(dfsMaze3dGenerator.measureAlgorithmTime([30, 50, 50])); // NOTE: Uncomment this line to see the time it take to generate a 30x50x50 maze with DfsMaze3dGenerator class.
// console.log(aldousbroderMaze3dGenerator.measureAlgorithmTime([30, 50, 50])); // NOTE: Uncomment this line to see the time it take to generate a 30x50x50 maze with AldousbroderMaze3dGenerator class.
// SECTION End: Measure algorithm in time section




