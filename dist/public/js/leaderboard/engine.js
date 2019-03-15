const SCREENWIDTH = 1500;
const SCREENHEIGHT = 800;

var renderer;
var stage;
var graphics;

var frameStart = Date.now(), frameEnd = 0;
var elapsedTimeMS = 0;

initialize();

function resize() {
	renderer.view.style.position = 'absolute';
	renderer.view.style.left = ((window.innerWidth - renderer.width) / 2) + 'px';
	renderer.view.style.top = ((window.innerHeight + renderer.height) / 4) + 'px';
}

function initialize() {
	renderer = PIXI.autoDetectRenderer(SCREENWIDTH, SCREENHEIGHT, {backgroundColor : 0x000000});
	document.body.appendChild(renderer.view);

	stage = new PIXI.Container();
	graphics = new PIXI.Graphics();
	stage.addChild(graphics);

	resize();
	window.addEventListener('resize', resize);

	update();
}

function update() {
    frameEnd = Date.now();
    elapsedTimeMS = frameEnd - frameStart;
    frameStart = frameEnd;

    requestAnimationFrame(update);
    draw();
}

function draw() {	
	graphics.beginFill(0xFFFF00);
	graphics.lineStyle(5, 0xFF0000);
	graphics.drawRect(0, 0, 300, 200);


	renderer.render(stage);
	graphics.clear();
}

function getElapsedTimeS() {
	return elapsedTimeMS / 1000.0;
}