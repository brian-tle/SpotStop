class Joiner {
	constructor() {
		this.spaceBackground = new SpaceBackground();
		this.container2 = new SecondPanel(SCREENWIDTH / 3);
		this.player = new Player(SCREENWIDTH / 3 + 50, SCREENHEIGHT - 85);
		this.container1 = new StaticRectangleOutlineFill(0, 0, SCREENWIDTH / 3, SCREENHEIGHT, 0x505050, 0x000000, 10);
		this.container3 = new StaticRectangleOutlineFill(SCREENWIDTH * (2 / 3), 0, SCREENWIDTH / 3, SCREENHEIGHT, 0x505050, 0x000000, 10);
		this.container4 = new StaticRectangleOutlineFill(SCREENWIDTH * 0.3, 0, (SCREENWIDTH * 0.7) - (SCREENWIDTH * 0.3), 95, 0x505050, 0x000000, 10);
		this.containerText1 = new TextObject("Top", 50, 0xFF7FBF, this.container1.x + (this.container1.width / 2), 48);
		this.containerText3 = new TextObject("Rising", 50, 0xFF7FBF, this.container3.x + (this.container3.width / 2), 48);
		this.leaderboardText = new TextObject("Leaderboard", 96, 0xFF7FB6, SCREENWIDTH / 2, 48);
		this.containerOutline = new StaticRectangleOutline(0, 0, SCREENWIDTH, SCREENHEIGHT, 0x000000, 20);

		this.initializeIntro();
	}

	update(elapsedTimeS) {
		this.updateIntro(elapsedTimeS);

		if (this.introStep == -2 || this.introStep == 3) {
			this.spaceBackground.update(elapsedTimeS);
			this.player.update(elapsedTimeS);
		}
	}

	draw() { }

	initializeIntro() {
		this.confetti = new Confetti();
		this.confetti.generate(15, SCREENWIDTH / 2, SCREENHEIGHT + 150);
		this.confettiLeft = new Confetti();
		this.confettiLeft.generate(15, SCREENWIDTH / 4, SCREENHEIGHT + 150);
		this.confettiRight = new Confetti();
		this.confettiRight.generate(15, SCREENWIDTH * (3 / 4), SCREENHEIGHT + 150);

		this.doorLeft = new Door(1, 0);
		this.gearLeftTop = new Gear(5, 0);
		this.gearLeftBottom = new Gear(5, SCREENHEIGHT);

		this.doorRight = new Door(2, SCREENWIDTH / 2);
		this.gearRightTop = new Gear(SCREENWIDTH - 5, 0);
		this.gearRightBottom = new Gear(SCREENWIDTH - 5, SCREENHEIGHT);

		this.vaultBarLeft = new VaultBar((SCREENWIDTH / 2) - 80, 0);
		this.vaultBarRight = new VaultBar((SCREENWIDTH / 2) + 50, 0);

		this.vaultLockLeftTop = new VaultLock(1, (SCREENWIDTH / 2) - 85, 0);
		this.vaultLockLeftTop2 = new VaultLock(2, (SCREENWIDTH / 2) - 85, 40);
		this.vaultLockLeftBottom = new VaultLock(1, (SCREENWIDTH / 2) - 85, SCREENHEIGHT - 40);
		this.vaultLockRightTop = new VaultLock(1, (SCREENWIDTH / 2) + 45, 0);
		this.vaultLockRightBottom = new VaultLock(1, (SCREENWIDTH / 2) + 45, SCREENHEIGHT - 40);
		this.vaultLockRightBottom2 = new VaultLock(3, (SCREENWIDTH / 2) + 45, SCREENHEIGHT - 80);

		this.valve = new Valve(SCREENWIDTH / 2, SCREENHEIGHT / 2);

		this.introStep = -1;
		this.introTimer = 0;
	}

	updateIntro(elapsedTimeS) {
		if (this.introStep != -2) {
			if (this.introStep == -1) {
				if (this.introTimer > 0.8) {
					this.introStep += 1;
					this.introTimer = 0;
				}
				else {
					this.introTimer += elapsedTimeS;
				}
			}

			if (this.introStep == 0) {
				if (this.introTimer > 1.035) {
					this.introStep += 1;
					this.introTimer = 0;
				}
				else {
					this.introTimer += elapsedTimeS;
					this.valve.spinCounterClockwise(elapsedTimeS, 6);
				}
			}

			if (this.introStep == 1) {
				if (this.vaultBarLeft.sprite.y + this.vaultBarLeft.sprite.height > 135) {
					this.vaultBarLeft.slideUp(elapsedTimeS, 1000);
					this.vaultBarRight.slideDown(elapsedTimeS, 1000);
				}
				else {
					this.introStep += 1;
				}
			}

			if (this.introStep == 2) {
				if (this.introTimer > 0.3) {
					this.introStep += 1;
					this.introTimer = 0;
				}
				else {
					this.introTimer += elapsedTimeS;
				}
			}

			if (this.introStep == 3) {
				this.spaceBackground.update(elapsedTimeS);
				if (this.confetti.spriteList.length == 0 && this.confettiLeft.spriteList.length == 0 && this.confettiRight.spriteList.length == 0) {
					this.introStep = -2;
				}

				this.confetti.update(elapsedTimeS);
				this.confettiLeft.update(elapsedTimeS);
				this.confettiRight.update(elapsedTimeS);

				if (this.doorLeft.sprite.x + this.doorLeft.sprite.width > 0) {
					this.doorLeft.slideLeft(elapsedTimeS, 500);
					this.vaultBarLeft.slideLeft(elapsedTimeS, 500);
					this.vaultLockLeftBottom.slideLeft(elapsedTimeS, 500);
					this.vaultLockLeftTop.slideLeft(elapsedTimeS, 500);
					this.vaultLockLeftTop2.slideLeft(elapsedTimeS, 500);
					this.doorRight.slideRight(elapsedTimeS, 500);
					this.vaultBarRight.slideRight(elapsedTimeS, 500);
					this.vaultLockRightBottom.slideRight(elapsedTimeS, 500);
					this.vaultLockRightBottom2.slideRight(elapsedTimeS, 500);
					this.vaultLockRightTop.slideRight(elapsedTimeS, 500);
				}

				if (this.valve.sprite.x + this.valve.sprite.width > 0) {
					this.gearLeftTop.spinClockwise(elapsedTimeS, 2.5);
					this.gearLeftBottom.spinCounterClockwise(elapsedTimeS, 2.5);
					this.gearRightTop.spinCounterClockwise(elapsedTimeS, 2.5);
					this.gearRightBottom.spinClockwise(elapsedTimeS, 2.5);
					this.valve.slideLeft(elapsedTimeS, 500);
				}
			}
		}
	}
}