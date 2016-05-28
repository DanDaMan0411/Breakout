var paddle;
var ball;
var blocks;
var blocksAmount = 12;
var spaceKey;
window.blocksOnScreen = 0;
var paddleVelocity = 800;
var level = 1;
var gameRun = false;
var enlargePaddle;
var EPPowerUps;
var enlargedPaddle;

var amntLives = 3;

var lastScore;

var paddleEnlarged = false;
//Paddle will stay enlarged for 10 seconds
var totalEnlargeTime = 10;
var enlargeTime = 0;

var score = 0;
var scoreText;

var ballVX = 400;
var playState = {
	gamePaddle: function(){
		paddle = game.add.sprite(game.world.centerX, game.world.centerY * 1.8, "paddle");
				
		//This makes the center of the paddle in the middle instead of the top left corner
		paddle.anchor.setTo(.5, .5);
		paddle.scale.setTo(.5, .5);
		
		paddle.enableBody = true;
		
		//This enables arcade physics and the body, this is really important
		game.physics.arcade.enable(paddle);
		
		paddle.body.immovable = true;

		paddle.body.collideWorldBounds = true;
	},

	getRandomInt: function(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	},

	gameBlocks: function(){
		var blockWidth = 176/4;
		var blockHeight = 66/3;
		
		var mapList = [
			smileyMap,
			rectangleMap,
			pyramidMap,
			coolPatternMap,
			xMap,
			butterflyMap,
		] 
		
		blocks = game.add.group();
		blocks.enableBody = true;
		levelChoice = this.getRandomInt(0, mapList.length - 1);
		
		drawMap(blockWidth, blockHeight, mapList[levelChoice], blocks);
		
	},

	gameBall: function(){
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
	},

	EPPowerUp: function(){
		EPPowerUps = game.add.group();
		EPPowerUps.enableBody = true;
	},

	updateScore: function(){
		if (scoreText != null){
			scoreText.destroy();
		}
		scoreText = game.add.text(10, 0, "Score: " + score);
		scoreText.font = "Russo One";
		scoreText.fill = "#FFF";
		scoreText.stroke = "#000";
		scoreText.strokeThickness = 1;
	},
	
	configLives: function(){
		lives = game.add.group();
		lives.enableBody = true;
	},
	
	updateLives: function(){
		lives.removeAll();
		for (var i = 0; i < amntLives; i ++){
			var life = lives.create( game.world.width - (i + 1) * 50, 10, "heart");
			life.scale.setTo(.25, .25)
			lives.add(life);
		}
	},
	
	makeHUD: function(){
		this.updateScore();
		this.updateLives();
	},

	create: function(){
		//Gets the keyboard input of up down left right
		cursors = game.input.keyboard.createCursorKeys();
		
		gameBackground = game.add.sprite(0, 0, "background1")
		gameBackground.scale.setTo(2, 2)
		game.physics.startSystem(Phaser.Physics.ARCADE);

		this.gamePaddle();
		this.gameBall();
		
		this.gameBlocks();
		
		this.EPPowerUp();
		this.configLives();
		
		this.makeHUD();
		
		this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		
		game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR])
		
	},

	levelComplete: function(){
		console.log("Level complete");
		level ++;
		this.gameBlocks();
		console.log(level)
		gameRun = false;
	},

	//Creates the hamburger power up
	generateEnlargePaddle: function(ball, block){	
		var enlargePaddle = EPPowerUps.create(block.x, block.y, "enlargePaddle")
			
		var scaleFactor = enlargePaddle.height/50
			
		enlargePaddle.enableBody = true;
		enlargePaddle.scale.setTo(1/scaleFactor, 1/scaleFactor);
		enlargePaddle.body.height = 50;
		enlargePaddle.body.width = 50;
		enlargePaddle.body.velocity.setTo(0, 100);
	},

	breakBlock: function(ball, block){
		score += 500
		this.updateScore();
		
		game.physics.arcade.collide(block, ball);
		block.kill()
		blocksOnScreen --;
		
		var powerUpOdds = this.getRandomInt(1, 10);
		
		if (powerUpOdds == 1){
			this.generateEnlargePaddle(ball, block);
		}
		
		if (blocksOnScreen == 0){
			this.levelComplete();
		}
	},

	enlargeTimer: function(){
		enlargeTime ++;
		if (enlargeTime > totalEnlargeTime){
			clearInterval(startEnlargeTimer);
			paddleEnlarged = false;
			
			enlargedPaddle.kill();
			
			//This is done to make ball follow normal paddle again
			enlargedPaddle = null;
			
			paddle.alpha = 1;
			enlargeTime = 0;
		}
	},

	makeEnlargePaddle: function(){
		paddleEnlarged = true;
		
		enlargedPaddle = game.add.sprite(paddle.x, paddle.y, "paddle");
		enlargedPaddle.scale.setTo(.8, .5);
		enlargedPaddle.anchor.setTo(.5, .5);
		
		enlargedPaddle.enableBody = true;
		
		game.physics.arcade.enable(enlargedPaddle);
		
		enlargedPaddle.body.collideWorldBounds = true;
		
		var paddles = game.add.group();
		
		paddles.add(paddle);
		paddles.add(enlargedPaddle);
		
		//This hides the orginal paddle so it doesn't overlap
		paddle.alpha = 0;
		
		enlargedPaddle.body.immovable = true;
	},

	gotEnlargePaddle: function(paddle, enlargePaddle){
		//This kills the hamburger
		enlargePaddle.kill();

		score += 1000;
		this.updateScore();
		
		if (!paddleEnlarged){
			startEnlargeTimer = setInterval(this.enlargeTimer, 1000);
			if (enlargedPaddle != null){
				enlargedPaddle.kill();
			}
			
			this.makeEnlargePaddle();	
		}else{
			enlargeTime = 0;
		}
	},

	ballVelocity: function(ball, paddle){
		game.physics.arcade.collide(ball, paddle);
		
		if (enlargedPaddle == null){
			var distanceDif = Math.abs(ball.x - paddle.x);
			var velocityChange = distanceDif/(paddle.body.width/2)
		}else{
			var distanceDif = Math.abs(ball.x - enlargedPaddle.x);
			var velocityChange = distanceDif/(enlargedPaddle.body.width/2)
		}
		
		//ballVX = 0;
		
		if (ball.x < paddle.x){
			velocityChange *= -1
		}
		
		ball.body.velocity.x = velocityChange*ballVX;
	},

	startGame: function(){
		ball.body.velocity.setTo(500, -400);
		//ball.body.velocity.y = 500;
	},

	//This puts the ball back into position if it hits the bottom of the screen
	restartBall: function(){
		//Resets the ball position
		ball.body.velocity.setTo(0, 0);
		if (enlargedPaddle != null){
			ball.body.x = enlargedPaddle.x - ball.body.width/2;
		}else{
			ball.body.x = paddle.x - ball.body.width/2
		}
		ball.body.y = (game.world.centerY*1.8) - paddle.body.height;
	},

	update: function(){
		//Controls for the paddle	
		paddle.body.velocity.x = 0;
		if (enlargedPaddle != null){
			enlargedPaddle.body.velocity.x = 0;
		}
		if (cursors.left.isDown){
			paddle.body.velocity.x = -1 * paddleVelocity;
			if (enlargedPaddle != null){
				enlargedPaddle.body.velocity.x = -1 * paddleVelocity;
			}
		}else if (cursors.right.isDown){
			paddle.body.velocity.x = paddleVelocity;
			if (enlargedPaddle != null){
				enlargedPaddle.body.velocity.x = paddleVelocity;
			}
		}
		
		//Runs when the game is not running
		if (!gameRun){
			this.restartBall();
		}
		
		//This starts the game where the ball starts moving
		if (this.spaceKey.isDown){
			if (!gameRun){
				gameRun = true;
				this.startGame();
			}
		}
		
		game.physics.arcade.overlap(paddle, EPPowerUps, this.gotEnlargePaddle, null, this);
		game.physics.arcade.overlap(enlargedPaddle, EPPowerUps, this.gotEnlargePaddle, null, this);
		
		if (gameRun){
			//Hit AI
			game.physics.arcade.overlap(ball, blocks, this.breakBlock, null, this);
			game.physics.arcade.overlap(ball, paddle, this.ballVelocity, null, this);
			game.physics.arcade.overlap(ball, enlargedPaddle, this.ballVelocity, null, this);
			

			//Sees if the ball hit the bottom of the screen		
			if (ball.body.y + ball.body.height >= game.world.height){
				gameRun = false;
				amntLives --;
				if (amntLives <= 0){
					lastScore = score;
					this.restartGameInfo();
					game.state.start("end");
				}
				this.updateLives();
				
				//This prevents people who hold down the space bar to mess up the beginning of the next round
				this.spaceKey.isDown = false;
			};
		};
	},
	
	//Resets variables to ave prepared in case player wants to play again
	restartGameInfo: function(){
		amntLives = 3;
		this.updateLives();
		score = 0;
		this.updateScore();
		this.gameBlocks();
	},
	
	render: function(){

	},
}
