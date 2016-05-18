var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', {
	preload: preload,
	create: create, 
	update: update,
	render: render,
});

function preload(){
	game.load.image('paddle', 'assets/paddle.png');
	game.load.image('ball', 'assets/ball.png');
	game.load.spritesheet('redBlock', 'assets/block.png', 176/4, 66/3, 6);
}

var paddle;
var ball;
var blocks;
var blocksAmount = 12

var gamePaddle = function(){
	paddle = game.add.sprite(game.world.centerX, game.world.centerY * 1.8, "paddle");
	
	//This makes the center of the paddle in the middle instead of the top left corner
	paddle.anchor.setTo(.5, .5);
	paddle.scale.setTo(.5, .5);
	
	paddle.enableBody = true;
	
	//This enables arcade physics and the body, this is really important
	game.physics.arcade.enable(paddle);
	
	paddle.body.immovable = true;

	paddle.body.collideWorldBounds = true;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Sets up the blocks into different formations
setUpRectangle = function(blockWidth, blockHeight){
	var blocksInRow = 10;
	var numRows = 10;
	var blockYPos = 1;
	
	for (var col = 0; col < numRows; col ++){
		for (var i = 0; i < blocksInRow; i++)
		{
			var centerBlock = (game.world.width - blocksInRow*blockWidth)/2;

			var block = blocks.create(i * blockWidth + centerBlock, blockYPos * blockHeight, 'redBlock');
			block.enableBody = true;
			block.body.immovable = true;
			
			block.frame = getRandomInt(0, blocksAmount)
		}
		blockYPos ++
	}
}

setUpSmileyFace = function(blockWidth, blockHeight){
	var blocksInRow = 10
	var numRows = 14;
	var blockYPos = 1;
	
	this.drawBlock = function(){
		var block = blocks.create(row * blockWidth + centerBlock, blockYPos * blockHeight, 'redBlock');
		block.enableBody = true;
		block.body.immovable = true;
		
		block.frame = getRandomInt(0, blocksAmount)
	}
	
	for (var col = 0; col < numRows; col ++){
		for (var row = 0; row < blocksInRow; row++)
		{
			var centerBlock = (game.world.width - blocksInRow*blockWidth)/2;
			
			//Makes the eyes
			if (row < 3 || row > blocksInRow - 4){
				if (col < 5){
					self.drawBlock()
				}
			}
			
			//Makes the mouth
			if (row < 2 || row > blocksInRow -3){
				if (col > 7 && col < 11){
					self.drawBlock()
				}
			}
			
			//Makes the mouth
			if (col > 10){
				self.drawBlock()
			}
			
		}
		blockYPos ++
	}
}


var gameBlocks = function(){
	var blockWidth = 176/4;
	var blockHeight = 66/3;
	
	blocks = game.add.group();
	blocks.enableBody = true;
	levelChoice = getRandomInt(0, 1);
	if (levelChoice == 0){
		setUpSmileyFace(blockWidth, blockHeight)
	}else if(levelChoice == 1){
		setUpRectangle(blockWidth, blockHeight)
	}
}

var gameBall = function(){
	ball = game.add.sprite(game.world.centerX, (game.world.centerY*1.8) - paddle.body.height - 100, "ball");
	
	//Scales down the ball
	ball.anchor.setTo(.5, .5);
	ball.scale.setTo(0.05, 0.05);
	
	game.physics.arcade.enable(ball);
	
	ball.enableBody = true;
		
	//This enables arcade physics and the body, this is really important
	game.physics.arcade.enable(ball);
	
	ball.body.collideWorldBounds = true;
	
	ball.body.bounce.setTo(1, 1);
}

var spaceKey;

function create(){
	//Gets the keyboard input of up down left right
	cursors = game.input.keyboard.createCursorKeys();
	
	game.physics.startSystem(Phaser.Physics.ARCADE);
	
	game.stage.backgroundColor = "#C0C0C0";

	gamePaddle();
	gameBall();
	
	gameBlocks();
	
	this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	
	game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR])
	
}

var paddleVelocity = 800;

function breakBlock(ball, block){
	game.physics.arcade.collide(block, ball);
	block.kill()
}

function ballVelocity(ball, paddle){
	game.physics.arcade.collide(ball, paddle);
	var velocityChange = Math.abs(ball.x - paddle.x)
	console.log(velocityChange)
	
	ball.body.velocity.x += velocityChange
	
}

gameRun = false;

var startGame = function(){
	ball.body.velocity.setTo(500, -500);
}

//This puts the ball back into position if it hits the bottom of the screen
function restartBall(){
	//Resets the ball position
	ball.body.velocity.setTo(0, 0);
	ball.body.x = paddle.x - ball.body.width/2
	ball.body.y = (game.world.centerY*1.8) - paddle.body.height - 8;
	  
}

function update(){
	//Controls for the paddle
	paddle.body.velocity.x = 0
	
	if (cursors.left.isDown){
		paddle.body.velocity.x = -1 * paddleVelocity;
	}else if (cursors.right.isDown){
		paddle.body.velocity.x = paddleVelocity;
	}
	
	//This starts the game where the ball starts moving
	if (this.spaceKey.isDown){
		if (!gameRun){
			gameRun = true;
			startGame();
		}
	}
	
	//Runs when the game is not running
	if (!gameRun){
		restartBall();
	}
	
	if (gameRun){
		//Hit AI
		game.physics.arcade.overlap(ball, blocks, breakBlock, null, this);
		game.physics.arcade.overlap(ball, paddle, ballVelocity, null, this);
		
		//Sees if the ball hit the bottom of the screen		
		if (ball.body.y + ball.body.height >= game.world.height){
			gameRun = false;
		}
	}
}

function render(){

}
