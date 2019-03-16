function drawRect(x, y, width, height, color = 0x000000FF) {
	graphics.beginFill(color);
	graphics.lineStyle(0, color);
	graphics.drawRect(x, y, width, height);
	graphics.endFill();
}

function drawRectOutline(x, y, width, height, outlineColor = 0x000000, thickness = 1) {
	graphics.lineStyle(thickness, outlineColor);
	graphics.drawRect(x, y, width, height);
}

function drawRectOutlineFill(x, y, width, height, color = 0x000000, outlineColor = 0x000000, thickness = 1) {
	graphics.beginFill(color);
	graphics.lineStyle(thickness, outlineColor);
	graphics.drawRect(x, y, width, height);
	graphics.endFill();
}

function drawLine(x1, y1, x2, y2, color = 0x000000, thickness = 1) {
	graphics.lineStyle(thickness, color);
	graphics.moveTo(x1, y1);
	graphics.lineTo(x2, y2);
}