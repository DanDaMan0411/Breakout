
var bootState = {
	preload: function(){
		game.load.image('background1', 'assets/background1.png');
	},
	
	create: function(){
		game.physics.startSystem(Phaser.Physics.ARCADE);
		
		game.scale.pageAlignVertically = true;
		game.scale.pageAlignHorizontally = true;
		game.scale.setShowAll();
		game.scale.refresh();
		game.state.start('load')
	},
}
