const SCREENWIDTH = 1500;
const SCREENHEIGHT = 700;

//1920:884

var renderer;
var stage;
var graphics;

var frameStart = Date.now(), frameEnd = 0;
var elapsedTimeMS = 0;

var joiner;
var scaleX = 1.0;
var scaleY = 1.0;

initialize();

function resize() {
	stage.setTransform(0, 0, scaleX, scaleY);
	renderer.view.width = renderer.view.width * scaleX;
	renderer.view.height = renderer.view.height * scaleY;

	renderer.view.style.position = 'absolute';
	renderer.view.style.left = ((window.innerWidth - renderer.width) / 2) + 'px';
	renderer.view.style.top = ((window.innerHeight + renderer.height) / 8) + 'px';
}

function initialize() {
	renderer = PIXI.autoDetectRenderer(SCREENWIDTH, SCREENHEIGHT, {backgroundColor : 0x6495ed});
	document.body.appendChild(renderer.view);

	stage = new PIXI.Container();
	graphics = new PIXI.Graphics();
	stage.addChild(graphics);

	resize();
	window.addEventListener('resize', resize);

	joiner = new Joiner();

	update();
}

function update() {
    frameEnd = Date.now();
    elapsedTimeMS = frameEnd - frameStart;
    frameStart = frameEnd;

    joiner.update(getElapsedTimeS());

    requestAnimationFrame(update);
    draw();
}

function draw() {
	joiner.draw();

	renderer.render(stage);
	graphics.clear();
}

function getElapsedTimeS() {
	return elapsedTimeMS / 1000.0;
}