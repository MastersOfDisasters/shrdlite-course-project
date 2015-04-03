/// <reference path="grid_astar.ts" />

// create abstract grid representation (no nodes here)
var grid =
[[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
 [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
 [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
 [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
 [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 1, 1, 1],
 [1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
 [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
 [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
 [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
 [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
 [1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 1, 1, 1],
 [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
 [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
 [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
 [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
 [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]];

var tileSize = 20;
var start = [5,4];
var goal = [19,11];

window.onload = function() {
	var canvas = document.getElementById("gridCanvas");
	
	canvas.addEventListener("mousedown", function(event) {
		var x = event.pageX - canvas.offsetLeft;
		var y = event.pageY - canvas.offsetTop;
		var cellX = Math.floor(x / tileSize);
		var cellY = Math.floor(y / tileSize);

		toggleGridCell(cellX, cellY);
		drawGrid([],[]);
	}, false);

	drawGrid([],[]);
};

function toggleGridCell(x, y) {
	if ((x == start[0] && y == start[1]) ||
		(x == goal[0] && y == goal[1])) {
		return
	}

	if (grid[y][x] == 0) {
		grid[y][x] = 1;
	} else {
		grid[y][x] = 0;
	}
}

function drawGrid(path, visited) {
	var canvas = <HTMLCanvasElement>document.getElementById("gridCanvas");
	var context = canvas.getContext("2d");

	var h = grid.length;
	var w = grid[0].length;

	for (var x = 0; x < w; x++) {
		for (var y = 0; y < h; y++) {
			if (grid[y][x] == 0) {
				context.fillStyle = "#999";
			} else {
				context.fillStyle = "black";
			}

			context.fillRect(x*tileSize, y*tileSize, tileSize-1, tileSize-1);
		}
	}

	for (var i = 0; i < visited.length; i++) {
		var current = visited[i];
		context.fillStyle = "lightgreen";
		context.fillRect(current.data.x*tileSize, current.data.y*tileSize, tileSize-1, tileSize-1)
	}

	for (var i = 0; i < path.length; i++) {
		var current = path[i];
		context.fillStyle = "green";
		context.fillRect(current.data.x*tileSize, current.data.y*tileSize, tileSize-1, tileSize-1)
	}

	context.fillStyle = "yellow";
	context.fillRect(start[0]*tileSize, start[1]*tileSize, tileSize-1, tileSize-1);

	context.fillStyle = "red";
	context.fillRect(goal[0]*tileSize, goal[1]*tileSize, tileSize-1, tileSize-1);
}

function testHeuristic(heuristic) {
	var gridGraph = grid_astar.createGraphFromGrid(grid, heuristic);
	var startNode = gridGraph.nodes[start[1]][start[0]];
	var goalNode = gridGraph.nodes[goal[1]][goal[0]];
	var result = gridGraph.graph.searchPath(startNode, goalNode);

	drawGrid(result.path, result.visited);

	var resultString = document.getElementById("info");
	if (result.found) {
		resultString.innerHTML = "Length of path found: " + result.path.length;
	} else {
		resultString.innerHTML = "No path found.";
	}
}

function testEuclidean(){
	//test graph with Euclidean distance
	testHeuristic(new grid_astar.EuclidianHeuristic());
}

function testManhattan(){
	//test graph with Manhattan distance
	testHeuristic(new grid_astar.ManhattanHeuristic());
}

function testDijkstra(){
	//test graph with no heuristics
	testHeuristic(new grid_astar.DijkstraHeuristic());
}