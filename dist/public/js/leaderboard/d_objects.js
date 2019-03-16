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

class TextObject {
	constructor(text, size, color, x, y) {
		this.text = new PIXI.Text(text, {fontFamily : 'Arial', fontSize: size, fill : color, align : 'center'});
		this.text.anchor.set(0.5);
		this.text.x = x;
		this.text.y = y;

		stage.addChild(this.text);
	}
}

class Door {
	constructor(image, x) {
		this.sprite = PIXI.Sprite.fromImage(image);
		this.sprite.x = x;
		this.sprite.y = 0;

		stage.addChild(this.sprite);
	}

	slideRight(elapsedTimeS, speed) {
		this.sprite.x += speed * elapsedTimeS;
	}

	slideLeft(elapsedTimeS, speed) {
		this.sprite.x -= speed * elapsedTimeS;
	}
}

class Gear { 
	constructor(image, x, y) {
		this.sprite = PIXI.Sprite.fromImage(image);
		this.sprite.anchor.set(0.5);
		this.sprite.x = x;
		this.sprite.y = y;

		stage.addChild(this.sprite);
	}

	spinClockwise(elapsedTimeS, speed) {
		this.sprite.rotation += speed * elapsedTimeS;
	}

	spinCounterClockwise(elapsedTimeS, speed) {
		this.sprite.rotation -= speed * elapsedTimeS;
	}
}

class Valve {
	constructor(image, x, y) {
		this.sprite = PIXI.Sprite.fromImage(image);
		this.sprite.anchor.set(0.5);
		this.sprite.x = x;
		this.sprite.y = y;

		stage.addChild(this.sprite);
	}

	spinCounterClockwise(elapsedTimeS, speed) {
		this.sprite.rotation -= speed * elapsedTimeS;
	}

	slideLeft(elapsedTimeS, speed) {
		this.sprite.x -= speed * elapsedTimeS;
	}
}

class VaultBar {
	constructor(image, x, y) {
		this.sprite = PIXI.Sprite.fromImage(image);
		this.sprite.x = x;
		this.sprite.y = y;

		stage.addChild(this.sprite);
	}

	slideDown(elapsedTimeS, speed) {
		this.sprite.y += speed * elapsedTimeS;
	}

	slideUp(elapsedTimeS, speed) {
		this.sprite.y -= speed * elapsedTimeS;
	}

	slideRight(elapsedTimeS, speed) {
		this.sprite.x += speed * elapsedTimeS;
	}

	slideLeft(elapsedTimeS, speed) {
		this.sprite.x -= speed * elapsedTimeS;
	}
}

class VaultLock {
	constructor(image, x, y) {
		this.sprite = PIXI.Sprite.fromImage(image);
		this.sprite.x = x;
		this.sprite.y = y;

		stage.addChild(this.sprite);
	}

	slideRight(elapsedTimeS, speed) {
		this.sprite.x += speed * elapsedTimeS;
	}

	slideLeft(elapsedTimeS, speed) {
		this.sprite.x -= speed * elapsedTimeS;
	}
}