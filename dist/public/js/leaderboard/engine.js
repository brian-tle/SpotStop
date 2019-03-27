const SCREENWIDTH = 1500;
const SCREENHEIGHT = 700;

var renderer;
var stage;
var graphics;
var world;

var frameStart = Date.now(), frameEnd = 0;
var elapsedTimeMS = 0;

var joiner;
var scaleX = 1.0;
var scaleY = 1.0;
var scaleMin = 1.0;

var focused = true;

const loader = PIXI.loader;

loader.add('space', 'img/leaderboard/space.png');
loader.add('panel_2', 'img/leaderboard/panel_2.png');
loader.add('player', 'img/leaderboard/player.png');
loader.add('confetti', 'img/leaderboard/confetti.png');
loader.add('door_left', 'img/leaderboard/door_left.png');
loader.add('door_right', 'img/leaderboard/door_right.png');
loader.add('door_gear', 'img/leaderboard/door_gear.png');
loader.add('vault_bar', 'img/leaderboard/vault_bar.png');
loader.add('vault_lock', 'img/leaderboard/vault_lock.png');
loader.add('vault_lock_2', 'img/leaderboard/vault_lock_2.png');
loader.add('vault_lock_3', 'img/leaderboard/vault_lock_3.png');
loader.add('valve', 'img/leaderboard/valve.png');
loader.add('chair', 'img/leaderboard/chair.png');
loader.add('table', 'img/leaderboard/table.png');
loader.add('shelf', 'img/leaderboard/shelf.png');
loader.add('marker_1', 'img/leaderboard/marker_1.png');
loader.add('marker_1_g', 'img/leaderboard/marker_1_g.png');
loader.add('marker_1_s', 'img/leaderboard/marker_1_s.png');
loader.add('marker_1_b', 'img/leaderboard/marker_1_b.png');
loader.add('marker_2', 'img/leaderboard/marker_2.png');
loader.add('marker_2_g', 'img/leaderboard/marker_2_g.png');
loader.add('marker_2_s', 'img/leaderboard/marker_2_s.png');
loader.add('marker_2_b', 'img/leaderboard/marker_2_b.png');

window.addEventListener('focus', (event) => { focused = true; });
window.addEventListener('blur', (event) => { focused = false; });

loader.once('complete', function(loader, resources) {
	console.log("Assets loaded.");
	document.addEventListener('keydown', function(event) {
		if ([32, 37, 38, 39, 40].indexOf(event.keyCode) != -1) {
			event.preventDefault();
		}
		onKeyDown(event);
	});
	document.addEventListener('keyup', onKeyUp);
	document.addEventListener('mousedown', onMouseDown);
	document.addEventListener('mouseup', onMouseUp);
	getTopMarkers();
	getControversialMarkers();
    initialize();
})

loader.load();

function resize() {
	scaleX = window.innerWidth / 1920;
	scaleY = window.innerHeight / 964;
	scaleMin = Math.min(scaleX, scaleY);

	renderer.resize(1500 * scaleMin, 700 * scaleMin);
	renderer.view.style.position = 'absolute';
	renderer.view.style.left = ((window.innerWidth - renderer.width) / 2) + 'px';
	renderer.view.style.bottom = '15px';
	stage.scale.set(scaleMin);
}

function initialize() {
	world = new p2.World({ gravity:[0, -9.8] });

	renderer = PIXI.autoDetectRenderer(SCREENWIDTH, SCREENHEIGHT, {backgroundColor : 0x505050});
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

    if (focused) {
		joiner.update(getElapsedTimeS());
		draw();
	}

    requestAnimationFrame(update);
}

function draw() {
	joiner.draw();

	renderer.render(stage);
	graphics.clear();
}

function getElapsedTimeS() {
	return elapsedTimeMS / 1000.0;
}