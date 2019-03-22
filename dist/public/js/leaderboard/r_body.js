class Marker {
	constructor(x, y, mass) {
		this.sprite = new PIXI.Sprite(PIXI.loader.resources.marker_1.texture);
		this.sprite.anchor.set(0.5);
		stage.addChild(this.sprite);

		this.boxShape = new p2.Box({ width: this.sprite.width / 100, height: this.sprite.height / 100 });
        this.boxBody = new p2.Body({
            mass: 1,
            position:[x / 100, (SCREENHEIGHT - y) / 100],
            angularVelocity: Math.floor(Math.random() * (10 + 10 + 1) - 10)
        });
        this.boxBody.addShape(this.boxShape);
        world.addBody(this.boxBody);

		this.sprite.x = this.boxBody.position[0] * 100;
		this.sprite.y = SCREENHEIGHT - (this.boxBody.position[1] * 100);
	}

	update() {
		this.sprite.x = this.boxBody.position[0] * 100;
		this.sprite.y = SCREENHEIGHT - (this.boxBody.position[1] * 100);
		this.sprite.rotation = -this.boxBody.angle;
	}
}