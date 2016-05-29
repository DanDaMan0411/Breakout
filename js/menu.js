var menuState = {
	getRandomInt: function(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
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
	
	makeStartLabel: function(){
		startLabel = game.add.text(game.world.centerX, game.world.centerY, "Start");
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
	
	makeInfoLabel: function(){
		infoLabel = game.add.text(game.world.centerX, game.world.centerY, "Start");
		infoLabel.anchor.setTo(.5, .5);
		infoLabel.fill = "#FFF";
		infoLabel.font = "Russo One";
		infoLabel.fontSize = 75;
		infoLabel.stroke = "#000";
		infoLabel.strokeThickness = 1;
		
		infoLabel.inputEnabled = true;
		
		infoLabel.events.onInputOver.add(function(){startLabel.fill = "#CDCDCD"}, this);
		infoLabel.events.onInputOut.add(function(){startLabel.fill = "#FFF"}, this);
		infoLabel.events.onInputDown.add(this.start, this);
	},
	
	makeMenuBricks: function(){
		menuBlocks = game.add.group();
		for (var i = 0; i < 7; i ++){
			var block = menuBlocks.create(this.getRandomInt(game.world.centerX - 100, game.world.centerX + 100), this.getRandomInt(game.world.centerY - 100, game.world.centerY + 100), "block");
			block.scale.setTo(1.3, 1.3)
			
			block.anchor.setTo(.5, .5);
			
			game.physics.arcade.enable(block);
			
			block.enableBody = true;
			
			block.body.velocity.setTo(this.getRandomInt(-400, 400), this.getRandomInt(-400, 400));
			
			block.body.bounce.setTo(1, 1)
			
			block.body.collideWorldBounds = true;
			
			block.frame = i;
		}
	},
	
	create: function(){
		var background = game.add.sprite(0, 0, 'background1');
		background.scale.setTo(3, 3)
		
		this.makeMenuBricks();
		this.makeNameLabel();
		this.makeStartLabel();
		
		var wKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
		
		wKey.onDown.addOnce(this.start, this);
	},
	
	update: function(){
		game.physics.arcade.collide(menuBlocks, menuBlocks);
	},
	
	start: function(){
		game.state.start('play');
	}
}
