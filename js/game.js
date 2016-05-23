var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', {
	preload: preload,
	create: create, 
	update: update,
	render: render,
});

var paddle;
var ball;
var blocks;
var blocksAmount = 8;
var spaceKey;
var blocksOnScreen = 0;
var paddleVelocity = 800;
var level = 1;
var gameRun = false;
var enlargePaddle;
var EPPowerUps;
var enlargedPaddle;

function preload(){
	game.load.image('paddle', 'assets/paddle.png');
	game.load.image('ball', 'assets/ball.png');
	game.load.image('background1', 'assets/background1.png');
	game.load.image('enlargePaddle', 'assets/enlargePaddle.png');
	game.load.spritesheet('block', 'assets/block.png', 176/4, 66/3, blocksAmount);
}

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
	ball = game.add.sprite(game.world.centerX, (game.world.centerY*1.8) - paddle.body.height, "ball");
	
	//Scales down the ball
	ball.anchor.setTo(.5, .5);
	
	//Huge ball
	//ball.scale.setTo(2, 2);
	
	//Regular ball
	ball.scale.setTo(.035, .035);
	
	game.physics.arcade.enable(ball);
	
	ball.enableBody = true;
		
	//This enables arcade physics and the body, this is really important
	game.physics.arcade.enable(ball);
	
	ball.body.collideWorldBounds = true;
	
	ball.body.bounce.setTo(1, 1);
}

var EPPowerUp = function(){
	EPPowerUps = game.add.group();
	EPPowerUps.enableBody = true;
}

function create(){
	//Gets the keyboard input of up down left right
	cursors = game.input.keyboard.createCursorKeys();
	
	gameBackground = game.add.sprite(0, 0, "background1")
	gameBackground.scale.setTo(2, 2)
	game.physics.startSystem(Phaser.Physics.ARCADE);

	gamePaddle();
	gameBall();
	
	gameBlocks();
	
	EPPowerUp();
	
	this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	
	game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR])
	
}

function levelComplete(){
	console.log("Level complete");
	level ++;
	gameBlocks();
	console.log(level)
	gameRun = false;
}

function generateEnlargePaddle(ball, block){	
	var enlargePaddle = EPPowerUps.create(block.x, block.y, "enlargePaddle")
	
	//console.log(EPPowerUps.children.length)
	
	var scaleFactor = enlargePaddle.height/50
		
	enlargePaddle.enableBody = true;
	enlargePaddle.scale.setTo(1/scaleFactor, 1/scaleFactor);
	enlargePaddle.body.height = 50;
	enlargePaddle.body.width = 50;
	enlargePaddle.body.velocity.setTo(0, 100);
}

function breakBlock(ball, block){
	game.physics.arcade.collide(block, ball);
	block.kill()
	blocksOnScreen --;
	
	var powerUpOdds = getRandomInt(1, 1);
	
	if (powerUpOdds == 1){
		generateEnlargePaddle(ball, block)
	}
	
	if (blocksOnScreen == 0){
		levelComplete()
	}
}

function makeEnlargePaddle(){
	enlargedPaddle = game.add.sprite(paddle.x, paddle.y, "paddle");
	enlargedPaddle.scale.setTo(1.7, .5);
	enlargedPaddle.anchor.setTo(.5, .5);
	
	enlargedPaddle.enableBody = true;
	
	game.physics.arcade.enable(enlargedPaddle);
	var paddles = game.add.group();
	
	paddles.add(paddle);
	paddles.add(enlargedPaddle);
	
	enlargedPaddle.body.immovable = true;
}

function gotEnlargePaddle(paddle, enlargePaddle){
	enlargePaddle.kill();
	if (enlargedPaddle != null){
		enlargedPaddle.kill();
	}
	makeEnlargePaddle();	
}

function ballVelocity(ball, paddle){
	game.physics.arcade.collide(ball, paddle);
	var velocityChange = Math.abs(ball.x - paddle.x)
	
	ball.body.velocity.x += velocityChange*2
	
}

var startGame = function(){
	ball.body.velocity.setTo(500, -400);
}

//This puts the ball back into position if it hits the bottom of the screen
function restartBall(){
	//Resets the ball position
	ball.body.velocity.setTo(0, 0);
	ball.body.x = paddle.x - ball.body.width/2
	ball.body.y = (game.world.centerY*1.8) - paddle.body.height;
	  
}

function update(){
	if (enlargedPaddle != null){
		enlargedPaddle.body.x = paddle.body.x;
	}
	//Controls for the paddle	
	paddle.body.velocity.x = 0;
	if (cursors.left.isDown){
		paddle.body.velocity.x = -1 * paddleVelocity;
	}else if (cursors.right.isDown){
		paddle.body.velocity.x = paddleVelocity;
	}
	
	//Runs when the game is not running
	if (!gameRun){
		restartBall();
	}
	
	//This starts the game where the ball starts moving
	if (this.spaceKey.isDown){
		if (!gameRun){
			gameRun = true;
			startGame();
		}
	}
	
	game.physics.arcade.overlap(paddle, EPPowerUps, gotEnlargePaddle, null, this);
	
	if (gameRun){
		//Hit AI
		game.physics.arcade.overlap(ball, blocks, breakBlock, null, this);
		game.physics.arcade.overlap(ball, paddle, ballVelocity, null, this);
		game.physics.arcade.collide(enlargedPaddle, ball);

		//Sees if the ball hit the bottom of the screen		
		if (ball.body.y + ball.body.height >= game.world.height){
			gameRun = false;
			
			//This prevents people who hold down the space bar to mess up the beginning of the next round
			this.spaceKey.isDown = false;
		}
	}
}

function render(){

}
