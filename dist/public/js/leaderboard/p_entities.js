class Player {
	constructor(x, y) {
		this.sprite = new PIXI.Sprite(PIXI.loader.resources.player.texture);
		this.sprite.x = x;
		this.sprite.y = y;

		stage.addChild(this.sprite);
	}
}