var loadState = {
	preload: function(){
		var loadingLabel = game.add.text(80, 150, 'loading...');
		
		game.load.image('paddle', 'assets/paddle.png');
		game.load.image('ball', 'assets/ball.png');
		game.load.image('heart', 'assets/heart.png');
		game.load.image('background1', 'assets/background1.png');
		game.load.image('enlargePaddle', 'assets/enlargePaddle.png');
		game.load.spritesheet('block', 'assets/block.png', 176/4, 66/3, 12);
	},
	
	create: function(){
		game.state.start('menu');
	},
}
