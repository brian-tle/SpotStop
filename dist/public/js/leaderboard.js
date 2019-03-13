var leaderboard1;
var leaderboard2;
var leaderboard3;

function initialize() {
	leaderboard1 = document.getElementById('leaderboard1');
	leaderboard2 = document.getElementById('leaderboard2');
	leaderboard3 = document.getElementById('leaderboard3');

	leaderboard1.width = window.innerWidth / 4;
	leaderboard2.width = window.innerWidth / 4;
	leaderboard3.width = window.innerWidth / 4;

	leaderboard1.height = window.innerHeight / 2;
	leaderboard2.height = window.innerHeight / 2;
	leaderboard3.height = window.innerHeight / 2;
}