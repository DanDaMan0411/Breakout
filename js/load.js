var loadState = {
	makeNameLabel: function(){
		var nameLabel = game.add.text(game.world.centerX, 100, "Brick Smash!");
		nameLabel.anchor.setTo(.5, .5);
		nameLabel.fill = "#fff";
		nameLabel.font = "Russo One";
		nameLabel.fontSize = 100;
		nameLabel.stroke = "#000";
		nameLabel.strokeThickness = 1;
	},
	
	makeLoadingLabel: function(){
		var loadingLabel = game.add.text(game.world.centerX, game.world.centerY, "Loading...");
		loadingLabel.anchor.setTo(.5, .5);
		loadingLabel.fill = "#fff";
		loadingLabel.font = "Russo One";
		loadingLabel.fontSize = 100;
		loadingLabel.stroke = "#000";
		loadingLabel.strokeThickness = 1;
	},
	
	create: function(){
		var background = game.add.sprite(0, 0, "background1");
		background.scale.setTo(3, 3);
		this.makeNameLabel();
		this.makeLoadingLabel();

		game.state.start('menu');
	},
	
	preload: function(){
		game.load.image('paddle', 'assets/paddle.png');
		game.load.image('ball', 'assets/ball.png');
		game.load.image('heart', 'assets/heart.png');
		game.load.image('extraBall', 'assets/extraBall.png');
		game.load.image('enlargePaddle', 'assets/enlargePaddle.png');
		game.load.spritesheet('block', 'assets/block.png', 176/4, 66/3, 12);
	},
}
