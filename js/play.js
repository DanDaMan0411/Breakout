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
var powerUps;
var enlargedPaddle;

var amntLives = 3;
var maxLives = 5;

var lastScore;

var paddleEnlarged = false;
//Paddle will stay enlarged for 10 seconds
var totalEnlargeTime = 10;
var enlargeTime = 0;

var score = 0;
var scoreText;

var ballVX = 400;

var leftBtnDown = false;
var rightBtnDown = false;
var upBtnDown = false;

var playState = {
	gamePaddle: function(){
		paddle = game.add.sprite(game.world.centerX, game.world.centerY * 1.7, "paddle");
				
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
		var blockWidth = (176/4) * 1.3;
		var blockHeight = (66/3)* 1.3;
		
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
	
	makeNewBall: function(){
		var newBall = game.add.sprite(game.world.centerX, paddle.x - this.width/2, "ball")
		
		var desiredHeight = 23;
		var desiredWidth = 23;
		
		console.log(newBall.height)
		
		//Scales down the ball
		newBall.anchor.setTo(.5, .5);
		
		//Regular ball
		newBall.scale.setTo(desiredWidth/newBall.height, desiredHeight/newBall.width);

		//This enables arcade physics and the body, this is really important
		game.physics.arcade.enable(newBall);
		
		newBall.enableBody = true;
					
		newBall.body.collideWorldBounds = true;
		
		newBall.body.bounce.setTo(1, 1);
		
		newBall.body.velocity.setTo(ballVX, ballVX);
		
		balls.add(newBall);
	},
	
	gameBalls: function(){
		balls = game.add.group();
		balls.enableBody = true;
	},

	configPowerUps: function(){
		powerUps = game.add.group();
		powerUps.enableBody = true;
	},

	updateScore: function(){
		if (scoreText != null){
			scoreText.destroy();
		}
		scoreText = game.add.text(10, 0, "Score: " + score);
		scoreText.font = "Russo One";
		scoreText.fill = "#FFF";
		scoreText.stroke = "#000";
		scoreText.fontSize = 50;
		scoreText.strokeThickness = 1;
	},
	
	configLives: function(){
		lives = game.add.group();
		lives.enableBody = true;
	},
	
	updateLives: function(){
		lives.removeAll();
		for (var i = 0; i < amntLives; i ++){
			var life = lives.create( game.world.width - (i + 1) * 60, 10, "heart");
			life.scale.setTo(.3, .3)
						
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
		gameBackground.scale.setTo(3, 3)
		game.physics.startSystem(Phaser.Physics.ARCADE);

		this.gamePaddle();
		this.gameBalls();
		this.makeNewBall();
		
		this.gameBlocks();
		
		this.configPowerUps();
		this.configLives();
		
		this.makeHUD();
		
		this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		
		game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR])
		
	},

	levelComplete: function(){
		console.log("Level complete");
		level ++;
		this.gameBlocks();
		this.configPowerUps();
		game.input.activePointer.isDown = false;
		gameRun = false;
	},

	//Creates the hamburger power up
	generatePowerUp: function(ball, block, powerUpName){		
		var powerUp = powerUps.create(block.x, block.y, powerUpName)
		var powerUpHeight = 75;
		var powerUpWidth = 75;
		
		powerUp.scale.setTo(powerUpHeight/powerUp.height, powerUpWidth/powerUp.width)
		
		powerUp.name = powerUpName
		
		game.physics.arcade.enable(powerUp);
		
		powerUp.enableBody = true;
		powerUp.body.velocity.setTo(0, 100);
	},

	breakBlock: function(ball, block){
		score += 500
		this.updateScore();
		
		game.physics.arcade.collide(block, ball);
		block.kill()
		blocksOnScreen --;
		
		var powerUpOdds = this.getRandomInt(1, 1);
		var powerUpList = ["enlargePaddle"]//, "heart", "extraBall"] 
		if (powerUpOdds == 1){
			var pickPowerUp = this.getRandomInt(0, powerUpList.length-1);
			this.generatePowerUp(ball, block, powerUpList[pickPowerUp]);
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
			
			enlargedPaddle.destroy();
			
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

	gotPowerUp: function(paddle, powerUp){		
		//This kills the hamburger
		powerUp.kill();

		score += 1000;
		this.updateScore();
		
		if (powerUp.name == "enlargePaddle"){
			if (!paddleEnlarged){
				startEnlargeTimer = setInterval(this.enlargeTimer, 1000);
				if (enlargedPaddle != null){
					enlargedPaddle.kill();
				}
				
				this.makeEnlargePaddle();	
			}else{
				enlargeTime = 0;
			}
		}else if(powerUp.name == "heart"){
			if (amntLives <= maxLives){
				amntLives ++;
				this.updateLives();
			}
		}else if(powerUp.name == "extraBall"){
			this.makeNewBall();
		}
	},

	ballVelocity: function(paddle, ball){		
		game.physics.arcade.collide(paddle, ball);
		
		if (enlargedPaddle == null){
			var distanceDif = Math.abs(ball.x - paddle.x);
			var velocityChange = distanceDif/(paddle.body.width/2)
		}else{
			var distanceDif = Math.abs(ball.x - enlargedPaddle.x);
			var velocityChange = distanceDif/(enlargedPaddle.body.width/2)
		}
				
		if (ball.x < paddle.x){
			velocityChange *= -1;
		}
		
		ball.body.velocity.x = velocityChange*ballVX;
	},

	startGame: function(){
		var directionChoice = this.getRandomInt(0, 1)
		if (directionChoice == 1){
			balls.children[0].body.velocity.setTo(-ballVX, -400);
		}else{
			balls.children[0].body.velocity.setTo(ballVX, -400);
		}
		gameRun = true;
	},

	//This puts the ball back into position if it hits the bottom of the screen
	restartBall: function(){
		for (var i = 1; i < balls.children.length; i ++){
			balls.children[i].destroy();
		}
		
		balls.children[0].body.velocity.setTo(0, 0);
		
		//Resets the ball position
		if (enlargedPaddle != null){
			balls.children[0].body.x = enlargedPaddle.x - balls.children[0].body.width/2;
		}else{
			balls.children[0].body.x = paddle.x - balls.children[0].width/2;
		}
		balls.children[0].body.y = (game.world.centerY*1.7) - paddle.body.height - 7;
	},
	
	update: function(){				
		//Controls for the paddle	
		paddle.body.velocity.x = 0;
		if (enlargedPaddle != null){
			enlargedPaddle.body.velocity.x = 0;
		}
				
		//Follows mouse
		paddle.body.x = game.input.activePointer.x - paddle.width/2
		if (enlargedPaddle != null){
			enlargedPaddle.body.x = game.input.activePointer.x - enlargedPaddle.width/2
		}
		
		//Uses arrow keys
		/*if (cursors.left.isDown){
			paddle.body.velocity.x = -1 * paddleVelocity;
			if (enlargedPaddle != null){
				enlargedPaddle.body.velocity.x = -1 * paddleVelocity;
			}
		}else if (cursors.right.isDown){
			paddle.body.velocity.x = paddleVelocity;
			if (enlargedPaddle != null){
				enlargedPaddle.body.velocity.x = paddleVelocity;
			}
		}*/
		
		//This starts the game where the ball starts moving
		if (this.spaceKey.isDown || game.input.activePointer.isDown){
			if (!gameRun){
				this.startGame();
			}
		}
		
		//Runs when the game is not running
		if (!gameRun){
			this.restartBall();
		}
		
		game.physics.arcade.overlap(paddle, powerUps, this.gotPowerUp, null, this);
		game.physics.arcade.overlap(enlargedPaddle, powerUps, this.gotPowerUp, null, this);
		
		if (gameRun){
			//Hit AI
			game.physics.arcade.overlap(balls, blocks, this.breakBlock, null, this);
			game.physics.arcade.overlap(balls, paddle, this.ballVelocity, null, this);
			game.physics.arcade.overlap(balls, enlargedPaddle, this.ballVelocity, null, this);
			
			for (var ballId = 0; ballId < balls.children.length; ballId ++){
				//Sees if the ball hit the bottom of the screen	
				if (balls.children[ballId].body.y + balls.children[ballId].body.height >= game.world.height){					
					balls.children[ballId].kill();
					balls.remove(balls.children[ballId]);
					if (balls.children.length == 0){
						gameRun = false;
						this.makeNewBall();
												
						amntLives --;
						if (amntLives <= 0){
							lastScore = score;
							this.restartGameInfo();
							game.state.start("end");
						};
						this.updateLives();
						//This prevents people who hold down the space bar to mess up the beginning of the next round
						this.spaceKey.isDown = false;
						game.input.activePointer.isDown = false;
					};
				};
			};
		};
	},
	
	//Resets variables to ave prepared in case player wants to play again
	restartGameInfo: function(){
		amntLives = 3;
		this.updateLives();
		score = 0;
		console.log("Info restarted")
		
		//This is to get rid of enlarged paddle if player loses with it equipped
		if (enlargedPaddle != null){
			console.log("poopop")
			clearInterval(startEnlargeTimer);
			paddleEnlarged = false;
			
			enlargedPaddle.destroy();
			
			enlargedPaddle = null;
			
			paddle.alpha = 1;
			enlargeTime = 0;
		}
		
		this.updateScore();
		this.gameBlocks();
	},
	
	render: function(){

	},
}
