class Player {
	constructor(x, y) {
		this.sprite = new PIXI.Sprite(PIXI.loader.resources.player.texture);
		this.sprite.anchor.set(0.5);
		this.sprite.x = x;
		this.sprite.y = y;

		this.velocityX = 0;
		this.velocityY = 0;
		this.onGround = false;
		this.canJump = true;

		stage.addChild(this.sprite);
	}

	top() { return (this.sprite.y - (this.sprite.height / 2)); }
	bottom() { return (this.sprite.y + (this.sprite.height / 2)); }
	left() { return (this.sprite.x - (this.sprite.width / 2)); }
	right() { return (this.sprite.x + (this.sprite.width / 2)); }

	update(elapsedTimeS) {
		this.velocityX = 0;
		if (keyList.indexOf(37) != -1 && keyList.indexOf(39) == -1 && this.left() > SCREENWIDTH / 3) { this.velocityX = -200; }
		if (keyList.indexOf(37) == -1 && keyList.indexOf(39) != -1 && this.right () < SCREENWIDTH * (2 / 3)) { this.velocityX = 200; }

		if (this.bottom() < SCREENHEIGHT) {
			if (this.velocityY < 0 && keyList.indexOf(32) == -1) {
				this.velocityY += 9.8;
			}

			this.velocityY += 9.8;
		}
		else {
			this.velocityY = 0;
			this.sprite.y = SCREENHEIGHT - (this.sprite.height / 2);
			this.onGround = true;
			if (keyList.indexOf(32) == -1) { this.canJump = true; }
		}

		if (this.onGround && this.canJump) {
			if (keyList.indexOf(32) != -1) {
				this.canJump = false;
				this.onGround = false;
				this.velocityY = -350;
			}
		}

		this.sprite.x += this.velocityX * elapsedTimeS;
		this.sprite.y += this.velocityY * elapsedTimeS;
		if (this.velocityX > 0) { this.sprite.rotation += 3 * elapsedTimeS; }
		if (this.velocityX < 0) { this.sprite.rotation -= 3 * elapsedTimeS; }
	}
}