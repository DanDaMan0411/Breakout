var menuState = {
	makeNameLabel: function(){
		var nameLabel = game.add.text(game.world.centerX, 100, "Brick Smash!");
		nameLabel.anchor.setTo(.5, .5);
		nameLabel.fill = "#fff";
		nameLabel.font = "Russo One";
		nameLabel.fontSize = 100;
		nameLabel.stroke = "#000";
		nameLabel.strokeThickness = 1;
	},
	
	makeStartLabel: function(){
		var startLabel = game.add.text(game.world.centerX, game.world.centerY, "Start");
		startLabel.anchor.setTo(.5, .5);
		startLabel.fill = "#FFF";
		startLabel.font = "Russo One";
		startLabel.fontSize = 75;
		startLabel.stroke = "#000";
		startLabel.strokeThickness = 1;
		
		startLabel.inputEnabled = true;
		
		startLabel.events.onInputOver.add(function(){startLabel.fill = "#CDCDCD"}, this);
		startLabel.events.onInputOut.add(function(){startLabel.fill = "#FFF"}, this);
		startLabel.events.onInputDown.add(this.start, this);
	},
	
	create: function(){
		var background = game.add.sprite(0, 0, 'background1');
		background.scale.setTo(2, 2)
		
		this.makeNameLabel()
		this.makeStartLabel()
		
		var wKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
		
		wKey.onDown.addOnce(this.start, this);
	},
	
	start: function(){
		game.state.start('play');
	}
}
