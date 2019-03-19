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

	centerX() { return this.sprite.x; }
	centerY() { return this.sprite.y; }

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
				this.velocityY = -360;
			}
		}

		this.sprite.x += this.velocityX * elapsedTimeS;
		this.sprite.y += this.velocityY * elapsedTimeS;
		if (this.velocityX > 0) { this.sprite.rotation += 3 * elapsedTimeS; }
		if (this.velocityX < 0) { this.sprite.rotation -= 3 * elapsedTimeS; }
		this.onGround = false;
	}

	checkCollision(platform) {
		if (this.right() >= platform.left() && this.left() <= platform.right() &&
			this.bottom() >= platform.top() && this.top() <= platform.bottom()) {

			return true;
		}

		return false;
	}

	handleCollision(platform) {
		var overlapX = 0.0, overlapY = 0.0;
		if (this.centerX() > platform.centerX()) { overlapX = platform.right() - this.left(); }
		else { overlapX = -(this.right() - platform.left()); }
		if (this.centerY() > platform.centerY()) { overlapY = platform.bottom() - this.top(); }
		else { overlapY = -(this.bottom() - platform.top()); }

		if (overlapX != 0 && overlapY != 0) {
			if (Math.abs(overlapY) < Math.abs(overlapX)) {
				if (overlapY < 0.0) {
					if (this.velocityY > 0.0) {
						if (keyList.indexOf(32) == -1) { this.canJump = true; }
						this.onGround = true;
						this.sprite.y += overlapY;
						this.velocityY = 0;
					}
				}
				else {
					if (this.velocityY < 0) {
						this.sprite.y += overlapY;
						this.velocityY = 0;
					}
				}
			}
			else {
				this.sprite.x += overlapX;
				this.velocityX = 0;
			}
		}
	}
}

class Platform {
	constructor(x, y, width, height) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

	top() { return this.y; }
	bottom() { return this.y + this.height; }
	left() { return this.x; }
	right() { return this.x + this.width; }

	centerX() { return this.x + (this.width / 2.0); }
	centerY() { return this.y + (this.height / 2.0); }
}

class Chair {
	constructor(x, y) {
		this.sprite = new PIXI.Sprite(PIXI.loader.resources.chair.texture);
		this.sprite.x = x;
		this.sprite.y = y;

		this.platformList = []
		this.platformList.push(new Platform(x, (y + this.sprite.height / 2) - 10, this.sprite.width, 20));
		this.platformList.push(new Platform(x, y, 25, (this.sprite.height / 2) - 10));

		stage.addChild(this.sprite);
	}
}

class Table {
	constructor(x, y) {
		this.sprite = new PIXI.Sprite(PIXI.loader.resources.table.texture);
		this.sprite.x = x;
		this.sprite.y = y;

		this.platformList = [];
		this.platformList.push(new Platform(x, y, this.sprite.width, 20));
		
		stage.addChild(this.sprite);
	}
}