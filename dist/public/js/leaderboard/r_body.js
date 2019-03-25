class Marker {
	constructor(x, y, rank) {
		this.sprite = new PIXI.Sprite(PIXI.loader.resources.marker_1.texture);
		this.sprite.anchor.set(0.5);
		stage.addChild(this.sprite);
		this.sprite.width /= 2.0;
		this.sprite.height /= 2.0;
		this.sprite.width += Math.pow(rank, 1.75);
		this.sprite.height += Math.pow(rank, 1.75);

		this.boxShape = new p2.Box({ width: this.sprite.width / 100, height: this.sprite.height / 100 });
        this.boxBody = new p2.Body({
            mass: rank,
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

class MarkerRound {
	constructor(x, y, rank) {
		this.sprite = new PIXI.Sprite(PIXI.loader.resources.marker_2.texture);
		this.sprite.anchor.set(0.5);
		stage.addChild(this.sprite);
		this.sprite.width /= 2.0;
		this.sprite.height /= 2.0;
		this.sprite.width += Math.pow(rank, 1.75);
		this.sprite.height += Math.pow(rank, 1.75);

		this.boxShape = new p2.Circle({ radius: (this.sprite.width / 100) / 2 });
        this.boxBody = new p2.Body({
            mass: rank,
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