//////////////////////////////////////////////
//Sets up the blocks into different formations
//////////////////////////////////////////////

var rectangleMap = [
		["R", "R", "R", "R", "R", "R", "R", "R", "R", "R"],
		["O", "O", "O", "O", "O", "O", "O", "O", "O"],
		["Y", "Y", "Y", "Y", "Y", "Y", "Y", "Y", "Y", "Y"],
		["G", "G", "G", "G", "G", "G", "G", "G", "G"],
		["LB", "LB", "LB", "LB", "LB", "LB", "LB", "LB", "LB", "LB"],
		["DB", "DB", "DB", "DB", "DB", "DB", "DB", "DB", "DB"],
		["P", "P", "P", "P", "P", "P", "P", "P", "P", "P"],
		["W", "W", "W", "W", "W", "W", "W", "W", "W"]
]

var smileyMap = [
	["W", "W", "W", "X", "X", "X", "X", "W", "W", "W"],
	["W", "W", "W", "X", "X", "X", "X", "W", "W", "W"],
	["W", "BL", "W", "X", "X", "X", "X", "W", "BL", "W"],
	["W", "W", "W", "X", "X", "X", "X", "W", "W", "W"],
	["W", "W", "W", "X", "X", "X", "X", "W", "W", "W"],
	["X", "X", "X", "X", "X", "X", "X", "X", "X", "X"],
	["X", "X", "X", "X", "X", "X", "X", "X", "X", "X"],
	["X", "X", "X", "X", "X", "X", "X", "X", "X", "X"],
	["R", "R", "X", "X", "X", "X", "X", "X", "R", "R"],
	["R", "R", "X", "X", "X", "X", "X", "X", "R", "R"],
	["X", "R", "R", "X", "X", "X", "X", "R", "R", "X"],
	["X", "R", "R", "X", "X", "X", "X", "R", "R", "X"],
	["X", "X", "R", "R", "R", "R", "R", "R", "X", "X"],
	["X", "X", "R", "R", "R", "R", "R", "R", "X", "X"],
	["X", "X", "X", "X", "G", "G", "X", "X", "X", "X"],
	["X", "X", "X", "X", "G", "G", "X", "X", "X", "X"],
	["X", "X", "X", "X", "G", "G", "X", "X", "X", "X"],
]

var poptartMap = [
	[]
]

drawMap = function(blockWidth, blockHeight, blockMap){
	
	frameKey = {"R": 0,
				"O": 1,
				"Y": 2,
				"W": 3,
				"G": 4,
				"LB": 5,
				"DB": 6,
				"P": 7,
				"BL": 8,
				"X": 11}
	
	var numRows = blockMap.length;
	var blockYPos = 2;
	
	for (var row = 0; row < blockMap.length; row ++){
		for (var col = 0; col < blockMap[row].length; col++){
			if (frameKey[blockMap[row][col]] != 11){
				var numCols = blockMap[row].length
				
				var centerBlock = (game.world.width - numCols*blockWidth)/2;

				var block = blocks.create(col * blockWidth + centerBlock, blockYPos * blockHeight, 'block');
				block.enableBody = true;
				block.body.immovable = true;
				
				//This makes a rainbow design with the blocks
				block.frame = frameKey[blockMap[row][col]]
				
				blocksOnScreen ++;
			}
		}
		blockYPos ++
	}
}
