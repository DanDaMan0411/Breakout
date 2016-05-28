var endState = {
	makeScoreLabel: function(){
		var scoreLabel = game.add.text(game.world.centerX, game.world.centerY- 100, "Score: " + lastScore)
		scoreLabel.anchor.setTo(.5, .5);
		scoreLabel.font = "Russo One"
		scoreLabel.fontSize = 65;
		scoreLabel.fill = "#fff";
		scoreLabel.stroke = "#000";
		scoreLabel.strokeThickness = 1;
	},
	
	makePlayAgainLabel: function(){
		var playAgainLabel = game.add.text(game.world.centerX, game.world.centerY + 50, "Play Again")
		playAgainLabel.anchor.setTo(.5, .5);
		playAgainLabel.font = "Russo One"
		playAgainLabel.fontSize = 65;
		playAgainLabel.fill = "#fff";
		playAgainLabel.stroke = "#000";
		playAgainLabel.strokeThickness = 1;
		
		playAgainLabel.inputEnabled = true;
		
		playAgainLabel.events.onInputOver.add(function(){playAgainLabel.fill = "#CDCDCD"}, this);
		playAgainLabel.events.onInputOut.add(function(){playAgainLabel.fill = "#FFF"}, this);
		playAgainLabel.events.onInputDown.add(this.start, this);
	},
	
	makeNameLabel: function(){
		var nameLabel = game.add.text(game.world.centerX, 100, "Brick Smash!");
		nameLabel.anchor.setTo(.5, .5);
		nameLabel.fill = "#fff";
		nameLabel.font = "Russo One";
		nameLabel.fontSize = 100;
		nameLabel.stroke = "#000";
		nameLabel.strokeThickness = 1;
	},
	
	create: function(){
		var background = game.add.sprite(0, 0, 'background1');
		background.scale.setTo(2, 2)
		
		this.makeScoreLabel();
		this.makePlayAgainLabel();
		this.makeNameLabel();
		
		var wKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
		
		wKey.onDown.addOnce(this.start, this);
	},
	start: function(){
		game.state.start('play');
	}
}
