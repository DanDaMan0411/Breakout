//////////////////////////////////////////////
//Sets up the blocks into different formations
//////////////////////////////////////////////

setUpRectangle = function(blockWidth, blockHeight){
	var numCols = 12;
	var numRows = 8;
	var blockYPos = 2;
	
	for (var row = 0; row < numRows; row ++){
		for (var col = 0; col < numCols; col++)
		{
			var centerBlock = (game.world.width - numCols*blockWidth)/2;

			var block = blocks.create(col * blockWidth + centerBlock, blockYPos * blockHeight, 'block');
			block.enableBody = true;
			block.body.immovable = true;
			
			//This makes a rainbow design with the blocks
			block.frame = row
			
			blocksOnScreen ++;
		}
		blockYPos ++
	}
}

setUpSmileyFace = function(blockWidth, blockHeight){
	var blocksInRow = 10
	var numRows = 14;
	var blockYPos = 2;
	
	this.drawBlock = function(frameNumber){
		var block = blocks.create(row * blockWidth + centerBlock, blockYPos * blockHeight, 'block');
		block.enableBody = true;
		block.body.immovable = true;
		
		block.frame = frameNumber
		
		blocksOnScreen ++;
	}
	
	var eyeColor = getRandomInt(0, blocksAmount);
	var mouthColor = getRandomInt(0, blocksAmount);
	
	for (var col = 0; col < numRows; col ++){
		for (var row = 0; row < blocksInRow; row++)
		{
			var centerBlock = (game.world.width - blocksInRow*blockWidth)/2;
			
			//Makes the eyes
			if (row < 3 || row > blocksInRow - 4){
				if (col < 5){
					self.drawBlock(eyeColor)
				}
			}
			
			//Makes the mouth
			if (row < 2 || row > blocksInRow -3){
				if (col > 7 && col < 11){
					self.drawBlock(mouthColor)
				}
			}
			
			//Makes the mouth
			if (col > 10){
				self.drawBlock(mouthColor)
			}
			
		}
		blockYPos ++
	}
}
