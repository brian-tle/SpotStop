class Rectangle {
	constructor(x, y, width, height) {
		this.x = x;
		this.y = y;

		this.width = width;
		this.height = height;
	}

	draw(color = 0x000000) { drawRect(this.x, this.y, this.width, this.height, color); }
	drawOutline(color = 0x000000, thickness = 1) { drawRectOutline(this.x, this.y, this.width, this.height, color, thickness); }
	drawOutlineFill(color = 0x000000, outlineColor = 0x000000, thickness = 1) { drawRectOutlineFill(this.x, this.y, this.width, this.height, color, outlineColor, thickness); }
}

class StaticRectangleOutlineFill {
	constructor(x, y, width, height, color, outlineColor, thickness) {
		this.x = x;
		this.y = y;

		this.width = width;
		this.height = height;

		this.graphics = new PIXI.Graphics();
		this.graphics.beginFill(color);
		this.graphics.lineStyle(thickness, outlineColor);
		this.graphics.drawRect(x, y, width, height);
		this.graphics.endFill();
		stage.addChild(this.graphics);
	}
}

class StaticRectangleOutline {
	constructor(x, y, width, height, outlineColor, thickness) {
		this.x = x;
		this.y = y;

		this.width = width;
		this.height = height;

		this.graphics = new PIXI.Graphics();
		this.graphics.lineStyle(thickness, outlineColor);
		this.graphics.drawRect(x, y, width, height);
		stage.addChild(this.graphics);
	}
}

class TextObject {
	constructor(text, size, color, x, y) {
		this.text = new PIXI.Text(text, {fontFamily : 'Arial', fontSize: size, fill : color, align : 'center'});
		this.text.anchor.set(0.5);
		this.text.x = x;
		this.text.y = y;

		stage.addChild(this.text);
	}
}

class SpaceBackground {
	constructor() {
		this.sprite1 = new PIXI.Sprite(PIXI.loader.resources.space.texture);
		this.sprite2 = new PIXI.Sprite(PIXI.loader.resources.space.texture);
		this.sprite1.x = SCREENWIDTH / 3; this.sprite1.y = 75;
		this.sprite2.x =  SCREENWIDTH * (2 / 3); this.sprite2.y = 75;

		stage.addChild(this.sprite1);
		stage.addChild(this.sprite2);
	}

	update(elapsedTimeS) {
		this.sprite1.x -= 150 * elapsedTimeS;
		this.sprite2.x -= 150 * elapsedTimeS;

		if (this.sprite1.x <= 0) { this.sprite1.x = SCREENWIDTH * (2 / 3); this.sprite2.x = SCREENWIDTH * (1 / 3); }
		if (this.sprite2.x <= 0) { this.sprite2.x = SCREENWIDTH * (2 / 3); this.sprite1.x = SCREENWIDTH * (1 / 3); }
	}
}

class SecondPanel {
	constructor(x) {
		this.sprite = new PIXI.Sprite(PIXI.loader.resources.panel_2.texture);
		this.sprite.x = x;
		this.sprite.y = 0;

		stage.addChild(this.sprite);
	}
}

class Door {
	constructor(index, x) {
		if (index == 1) { this.sprite = new PIXI.Sprite(PIXI.loader.resources.door_left.texture); }
		if (index == 2) { this.sprite = new PIXI.Sprite(PIXI.loader.resources.door_right.texture); }

		this.sprite.x = x;
		this.sprite.y = 0;

		stage.addChild(this.sprite);
	}

	slideRight(elapsedTimeS, speed) { this.sprite.x += speed * elapsedTimeS; }
	slideLeft(elapsedTimeS, speed) { this.sprite.x -= speed * elapsedTimeS; }
}

class Gear { 
	constructor(x, y) {
		this.sprite = new PIXI.Sprite(PIXI.loader.resources.door_gear.texture);
		this.sprite.anchor.set(0.5);
		this.sprite.x = x;
		this.sprite.y = y;

		stage.addChild(this.sprite);
	}

	spinClockwise(elapsedTimeS, speed) { this.sprite.rotation += speed * elapsedTimeS; }
	spinCounterClockwise(elapsedTimeS, speed) { this.sprite.rotation -= speed * elapsedTimeS; }
}

class Valve {
	constructor(x, y) {
		this.sprite = new PIXI.Sprite(PIXI.loader.resources.valve.texture);
		this.sprite.anchor.set(0.5);
		this.sprite.x = x;
		this.sprite.y = y;

		stage.addChild(this.sprite);
	}

	spinCounterClockwise(elapsedTimeS, speed) { this.sprite.rotation -= speed * elapsedTimeS; }
	slideLeft(elapsedTimeS, speed) { this.sprite.x -= speed * elapsedTimeS; }
}

class VaultBar {
	constructor(x, y) {
		this.sprite = new PIXI.Sprite(PIXI.loader.resources.vault_bar.texture);
		this.sprite.x = x;
		this.sprite.y = y;

		stage.addChild(this.sprite);
	}

	slideDown(elapsedTimeS, speed) { this.sprite.y += speed * elapsedTimeS; }
	slideUp(elapsedTimeS, speed) { this.sprite.y -= speed * elapsedTimeS; }
	slideRight(elapsedTimeS, speed) { this.sprite.x += speed * elapsedTimeS; }
	slideLeft(elapsedTimeS, speed) { this.sprite.x -= speed * elapsedTimeS; }
}

class VaultLock {
	constructor(index, x, y) {
		if (index == 1) { this.sprite = new PIXI.Sprite(PIXI.loader.resources.vault_lock.texture); }
		if (index == 2) { this.sprite = new PIXI.Sprite(PIXI.loader.resources.vault_lock_2.texture); }
		if (index == 3) { this.sprite = new PIXI.Sprite(PIXI.loader.resources.vault_lock_3.texture); }

		this.sprite.x = x;
		this.sprite.y = y;

		stage.addChild(this.sprite);
	}

	slideRight(elapsedTimeS, speed) { this.sprite.x += speed * elapsedTimeS; }
	slideLeft(elapsedTimeS, speed) { this.sprite.x -= speed * elapsedTimeS; }
}

class Confetti {
	constructor() {
		this.spriteList = [];
		this.velocityXList = [];
		this.velocityYList = [];
	}

	generate(count, posX, posY) {
		for (var x = 0; x < count; x++) {
			this.spriteList.push(new PIXI.Sprite(PIXI.loader.resources.confetti.texture));
			this.velocityYList.push(-(Math.floor(Math.random() * (1200 - 600 + 1) + 600)));
			this.velocityXList.push(Math.floor(Math.random() * (275 + 275 + 1) - 275));

			this.spriteList[x].anchor.set(0.5);
			this.spriteList[x].x = posX;
			this.spriteList[x].y = posY;

			stage.addChild(this.spriteList[x]);
		}
	}

	update(elapsedTimeS) {
		for (var x = 0; x < this.spriteList.length; x++) {
			this.velocityYList[x] += 9.8;

			this.spriteList[x].rotation += (this.velocityXList[x] / 12) * elapsedTimeS;
			this.spriteList[x].x += this.velocityXList[x] * elapsedTimeS;
			this.spriteList[x].y += this.velocityYList[x] * elapsedTimeS;

			if (this.spriteList[x].y >= SCREENHEIGHT + 200) {
				stage.removeChild(this.spriteList[x]);
				this.spriteList.splice(x, 1);
				this.velocityYList.splice(x, 1);
				this.velocityXList.splice(x, 1);

				x -= 1;
			}
		}
	}
}