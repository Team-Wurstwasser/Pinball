class PinballPreloader extends Phaser.Scene {
    constructor() {
        super({ key: 'Preloader' });
    }

    init() {
        this.input.addPointer(1); 
    }

    preload() {
    this.load.image("imageMenuBackground", "img/MenuBackground.jpg");
    this.load.image("imageMenuAppIcon", "img/MenuAppIcon.png");
    this.load.image("imageMenuPlay", "img/MenuPlay.png");
    this.load.image("imageMenuButton", "img/MenuButton.png");
    this.load.image("imageGameBackground", "img/GameBackground.jpg");
    this.load.image("imageGameBoard", "img/GameBoard.jpg");
    this.load.image("imageGameBall", "img/GameBall.png");
    this.load.image("imageGameLargeCircle", "img/GameLargeCircle.png");
    this.load.image("imageGameMediumCircle", "img/GameMediumCircle.png");
    this.load.image("imageGameLauncher", "img/GameLauncher.png");
    this.load.image("imageGameHighScore", "img/GameHighScore.png");
    this.load.image("imageGameButtonANormal", "img/GameButtonANormal.png");
    this.load.image("imageGameButtonAPressed", "img/GameButtonAPressed.png");
    this.load.image("imageGameButtonBNormal", "img/GameButtonBNormal.png");
    this.load.image("imageGameButtonBPressed", "img/GameButtonBPressed.png");
    this.load.image("imageGameBlock", "img/GameBlock.png");
    }

	create() {
        this.scene.start('Menu');
    }
}

class PinballMainMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'Menu' });
    }

    create() {
        const gameWidth = this.sys.game.config.width;
        const gameHeight = this.sys.game.config.height;

        this.add.image(0, 0, "imageMenuBackground").setOrigin(0, 0);

        this.menuMainAppIcon = this.add.image(0, 50, "imageMenuAppIcon").setOrigin(0, 0);
        this.menuMainAppIcon.setScale(0.7);
        this.menuMainAppIcon.x = gameWidth / 2 - this.menuMainAppIcon.displayWidth / 2;

        this.menuMainPlayButton = this.add.image(0, 470, "imageMenuButton").setOrigin(0, 0).setInteractive({ cursor: 'pointer' });
        this.menuMainPlayButton.x = gameWidth / 2 - this.menuMainPlayButton.width / 2;

        this.menuMainPlayButtonIcon = this.add.image(0, this.menuMainPlayButton.y + 19, "imageMenuPlay").setOrigin(0, 0).setInteractive({ cursor: 'pointer' });
        this.menuMainPlayButtonIcon.x = this.menuMainPlayButton.x + this.menuMainPlayButton.width / 2 - this.menuMainPlayButtonIcon.width / 2 + 2;
        
        this.menuMainPlayButton.on('pointerup', this.playGame, this);
		this.menuMainPlayButtonIcon.on('pointerup', this.playGame, this);
    }

    playGame() {
        this.scene.start("Game");
    }
}

class PinballGame extends Phaser.Scene {
    constructor() {
        super({ key: 'Game' });

        this.outlineVertices = [1440,-3687,1023,-2194,1365,-1961,1365,-663,638,-480,160,-154,150,971,-330,970,-335,-153,-800,-480,-1540,-619,-1540,-1988,-1147,-2175,-1429,-3152,-1500,-3195,-1492,-3399,-1438,-3867,-1309,-4132,-1112,-4351,-787,-4540,-389,-4670,139,-4778,655,-4846,872,-4837,1067,-4792,1236,-4700,1374,-4584,1480,-4440,1557,-4271,1601,-3992,1601,-3712,1600,-171,1442,-169,1440,-3687];
        this.launcherVertices = [1401,-500,1631,-500];
        this.guide1Vertices = [-825,-746,-771,-853,-1280,-1120,-1280,-1759,-1360,-1759,-1360,-959,-825,-746];
        this.guide2Vertices = [663,-743,614,-855,1119,-1121,1123,-1760,1200,-1759,1200,-959,663,-743];
        this.guide3Vertices = [-1116,-1753,-1118,-1277,-838,-1110,-1116,-1753];
        this.guide4Vertices = [671,-1110,956,-1282,956,-1762,671,-1110];
        this.gutterVertices1 = [-480,650,293,650];
        this.gutterVertices2 = [-480,750,293,750];
        this.mediumCircles = [-1500,-3132,-866,-3163,-290,-3074,187,-3415,614,-3074,-451,-2232,396,-2242];
        this.largeCircles = [-446,-3704,309,-4133,990,-3750];
        this.leftFlipperVertices = [560,32,560,-32,0,-40,0,94];
        this.rightFlipperVertices = [0,94,0,-40,-560,-32,-560,32];
        this.ballStart = [152, -300];
        this.flipperSpeed = 15;
    }

    init() {
        this.scoreValue = 0;
        this.gameOver = false;
        this.launcherIsMoving = false;
    }

    create() {
        this.cameras.main.setBounds(-435, -540, 600, 335);

        const arrays = [
            this.outlineVertices, this.launcherVertices, this.guide1Vertices, this.guide2Vertices,
            this.guide3Vertices, this.guide4Vertices, this.gutterVertices1, this.gutterVertices2,
            this.mediumCircles, this.largeCircles, this.leftFlipperVertices,
            this.rightFlipperVertices, this.ballStart
        ];
        arrays.forEach(arr => {
            for (let i = 0; i < arr.length; i++) arr[i] *= 0.95;
        });

        this.add.tileSprite(-170, -555, 600, 835, "imageGameBoard").setOrigin(0, 0);
        this.gameGameBackground = this.add.tileSprite(-170, -555, 600, 835, "imageGameBackground").setOrigin(0, 0);

        const backgroundMask = this.add.graphics();
        backgroundMask.fillStyle(0xffffff, 1);
        this.drawVerticesToGraphics(backgroundMask, this.outlineVertices, true);
        backgroundMask.setVisible(false);

        if (this.renderer.type === Phaser.WEBGL) {
            this.gameGameBackground.enableFilters();
            this.gameGameBackground.filters.external.addMask(backgroundMask);
        } else {
            const bgGeometryMask = backgroundMask.createGeometryMask();
            this.gameGameBackground.setMask(bgGeometryMask);
        }

        this.boardOverlay = this.add.tileSprite(-170, -555, 600, 835, "imageGameBoard").setOrigin(0, 0);

        const overlayMask = this.add.graphics();
        overlayMask.fillStyle(0xffffff, 1);

        this.drawVerticesToGraphics(overlayMask, this.guide1Vertices, true);
        this.drawVerticesToGraphics(overlayMask, this.guide2Vertices, true);
        this.drawVerticesToGraphics(overlayMask, this.guide3Vertices, true);
        this.drawVerticesToGraphics(overlayMask, this.guide4Vertices, true);
        overlayMask.setVisible(false);

        if (this.renderer.type === Phaser.WEBGL) {
            this.boardOverlay.enableFilters();
            this.boardOverlay.filters.external.addMask(overlayMask);
        } else {
            const overlayGeometryMask = overlayMask.createGeometryMask();
            this.boardOverlay.setMask(overlayGeometryMask);
        }

        this.createEdgeBodies(this.outlineVertices, {
            thickness: 1,
            friction: 0.05,
            restitution: 0.5,
            label: 'outline'
        }, true);

        this.pinballBoardLine = this.add.graphics();
        this.pinballBoardLine.lineStyle(2.05, 0x343434, 1);
        this.drawVerticesToGraphics(this.pinballBoardLine, this.outlineVertices);

        this.leftBorderLine = this.add.graphics().lineStyle(2, 0x343434, 1);
        this.drawVerticesToGraphics(this.leftBorderLine, this.guide1Vertices);

        this.rightBorderLine = this.add.graphics().lineStyle(2, 0x343434, 1);
        this.drawVerticesToGraphics(this.rightBorderLine, this.guide2Vertices);

        this.leftBounceLine = this.add.graphics().lineStyle(2, 0x343434, 1);
        this.drawVerticesToGraphics(this.leftBounceLine, this.guide3Vertices);

        this.rightBounceLine = this.add.graphics().lineStyle(2, 0x343434, 1);
        this.drawVerticesToGraphics(this.rightBounceLine, this.guide4Vertices);

        [this.guide1Vertices, this.guide2Vertices, this.guide3Vertices, this.guide4Vertices].forEach((verts, idx) => {
            this.createEdgeBodies(verts, {
                thickness: 1,
                friction: 0.05,
                restitution: 0.5,
                label: 'guide' + (idx + 1)
            }, true);
        });

        this.gutterBody1 = this.matter.add.rectangle(
            (this.gutterVertices1[0] + this.gutterVertices1[2]) / 2,
            this.gutterVertices1[1],
            Math.abs(this.gutterVertices1[2] - this.gutterVertices1[0]),
            4,
            { isStatic: true, isSensor: true, label: 'gutter1' }
        );
        this.gutterBody2 = this.matter.add.rectangle(
            (this.gutterVertices2[0] + this.gutterVertices2[2]) / 2,
            this.gutterVertices2[1],
            Math.abs(this.gutterVertices2[2] - this.gutterVertices2[0]),
            4,
            { isStatic: true, isSensor: true, label: 'gutter2' }
        );

        const fontStyle = {
            fontFamily: '"Arial Black", Gadget, sans-serif',
            fontSize: '25px',
            fill: '#ffffff',
            fontStyle: 'bold'
        };

        this.scoreBackground = this.add.graphics();
        this.scoreBackground.fillStyle(0x000000, 0.7);
        this.scoreBackground.lineStyle(2, 0x383838, 1);
        this.scoreBackground.fillRoundedRect(-145, -530, 104, 40, 10);

        this.scoreLabel = this.add.text(-138, -523.25, "0", fontStyle);

        this.highScoreBackground = this.add.graphics();
        this.highScoreBackground.fillStyle(0x022C5C, 1);
        this.highScoreBackground.lineStyle(2, 0x0046A9, 1);
        this.highScoreBackground.fillRoundedRect(30.5, -530, 124, 40, 10);

        this.highScoreIcon = this.add.sprite(47, -510, "imageGameHighScore");
        this.highScoreLabel = this.add.text(66, -523.25, this.getHighscore(), fontStyle);

        this.leftFlipperSprite = this.add.graphics();
        this.leftFlipperSprite.fillStyle(0xffffff, 1).lineStyle(2, 0x343434, 1);
        this.drawVerticesToGraphics(this.leftFlipperSprite, this.leftFlipperVertices, true);
        this.leftFlipperSprite.setPosition(-80, -80);

        this.leftFlipperCentroidLocal = this.getCentroid(this.leftFlipperVertices);
        this.leftFlipperBody = this.matter.add.fromVertices(
            -80 + this.leftFlipperCentroidLocal.x,
            -80 + this.leftFlipperCentroidLocal.y,
            [this.toPointList(this.leftFlipperVertices)],
            { friction: 0.1, restitution: 0.3, density: 0.02, label: 'leftFlipper' },
            true
        );
        this.leftFlipperConstraint = this.matter.add.worldConstraint(this.leftFlipperBody, 0, 1, {
            pointA: { x: -80, y: -80 },
            pointB: { x: -this.leftFlipperCentroidLocal.x, y: -this.leftFlipperCentroidLocal.y }
        });

        this.rightFlipperSprite = this.add.graphics();
        this.rightFlipperSprite.fillStyle(0xffffff, 1).lineStyle(2, 0x343434, 1);
        this.drawVerticesToGraphics(this.rightFlipperSprite, this.rightFlipperVertices, true);
        this.rightFlipperSprite.setPosition(64, -80);

        this.rightFlipperCentroidLocal = this.getCentroid(this.rightFlipperVertices);
        this.rightFlipperBody = this.matter.add.fromVertices(
            64 + this.rightFlipperCentroidLocal.x,
            -80 + this.rightFlipperCentroidLocal.y,
            [this.toPointList(this.rightFlipperVertices)],
            { friction: 0.1, restitution: 0.3, density: 0.02, label: 'rightFlipper' },
            true
        );
        this.rightFlipperConstraint = this.matter.add.worldConstraint(this.rightFlipperBody, 0, 1, {
            pointA: { x: 64, y: -80 },
            pointB: { x: -this.rightFlipperCentroidLocal.x, y: -this.rightFlipperCentroidLocal.y }
        });

        for (let i = 0; i < this.mediumCircles.length / 2; i++) {
            let cx = Math.floor(this.mediumCircles[2 * i] * 0.10);
            let cy = Math.floor(this.mediumCircles[2 * i + 1] * 0.10);
            const sprite = this.add.sprite(cx, cy, "imageGameMediumCircle");
            this.matter.add.circle(cx, cy, sprite.width / 2, { isStatic: true, restitution: 0.9, label: 'mediumCircle' });
        }

        for (let i = 0; i < this.largeCircles.length / 2; i++) {
            let cx = Math.floor(this.largeCircles[2 * i] * 0.10);
            let cy = Math.floor(this.largeCircles[2 * i + 1] * 0.10);
            const sprite = this.add.sprite(cx, cy, "imageGameLargeCircle");
            this.matter.add.circle(cx, cy, sprite.width / 2, { isStatic: true, restitution: 0.9, label: 'largeCircle' });
        }

        this.ball = this.matter.add.sprite(0, 0, "imageGameBall");
        this.ball.setCircle(this.ball.width / 2);
        this.ball.setBounce(0.5);

        this.launcherContainer = this.add.container(140, 51);
        this.launcherSprite = this.add.sprite(0, -100, "imageGameLauncher");
        this.launcherContainer.add(this.launcherSprite);

        this.launcherBody = this.matter.add.rectangle(140, 51 - 100, 20, 60, {
            isStatic: true,
            label: 'launcher'
        });

        this.cursors = this.input.keyboard.createCursorKeys();
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        this.setBallStartPosition();
    }

    update() {
        if (this.gameOver == true) {
            this.setBallStartPosition();
            this.gameOver = false;
        }

        if (this.cursors.left.isDown || this.keyA.isDown) {
            if (this.leftFlipperSprite.angle > -25) this.leftFlipperSprite.angle -= this.flipperSpeed;
        } else {
            if (this.leftFlipperSprite.angle < 27) this.leftFlipperSprite.angle += this.flipperSpeed;
        }

        if (this.cursors.right.isDown || this.keyD.isDown) {
            if (this.rightFlipperSprite.angle < 25) this.rightFlipperSprite.angle += this.flipperSpeed;
        } else {
            if (this.rightFlipperSprite.angle > -27) this.rightFlipperSprite.angle -= this.flipperSpeed;
        }

        if (this.leftFlipperBody) {
            const rad = Phaser.Math.DegToRad(this.leftFlipperSprite.angle);
            const c = this.leftFlipperCentroidLocal;
            const rotX = c.x * Math.cos(rad) - c.y * Math.sin(rad);
            const rotY = c.x * Math.sin(rad) + c.y * Math.cos(rad);
            this.matter.body.setAngle(this.leftFlipperBody, rad);
            this.matter.body.setPosition(this.leftFlipperBody, {
                x: this.leftFlipperSprite.x + rotX,
                y: this.leftFlipperSprite.y + rotY
            });
        }
        if (this.rightFlipperBody) {
            const rad = Phaser.Math.DegToRad(this.rightFlipperSprite.angle);
            const c = this.rightFlipperCentroidLocal;
            const rotX = c.x * Math.cos(rad) - c.y * Math.sin(rad);
            const rotY = c.x * Math.sin(rad) + c.y * Math.cos(rad);
            this.matter.body.setAngle(this.rightFlipperBody, rad);
            this.matter.body.setPosition(this.rightFlipperBody, {
                x: this.rightFlipperSprite.x + rotX,
                y: this.rightFlipperSprite.y + rotY
            });
        }

        if (this.launcherIsMoving) {
            if (this.launcherGoingUp) {
                this.launcherSprite.y -= 10;
                if (this.launcherSprite.y <= -160) this.launcherGoingUp = false;
            } else {
                this.launcherSprite.y += 10;
                if (this.launcherSprite.y >= -100) this.launcherIsMoving = false;
            }
            if (this.launcherBody) {
                this.matter.body.setPosition(this.launcherBody, {
                    x: this.launcherContainer.x,
                    y: this.launcherContainer.y + this.launcherSprite.y
                });
            }
        }
    }

    setBallStartPosition() {
        const startX = this.ballStart[0];
        const startY = this.ballStart[1];
        this.ball.setPosition(startX, startY);
        this.ball.setVelocity(0, 0);
    }

    createEdgeBodies(vertices, options = {}, closed = true) {
        const points = this.toPointList(vertices);
        const bodies = [];
        const count = closed ? points.length : points.length - 1;

        for (let i = 0; i < count; i++) {
            const p1 = points[i];
            const p2 = points[(i + 1) % points.length];

            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const length = Math.sqrt(dx * dx + dy * dy);
            if (length === 0) continue;

            const angle = Math.atan2(dy, dx);
            const cx = (p1.x + p2.x) / 2;
            const cy = (p1.y + p2.y) / 2;

            const body = this.matter.add.rectangle(cx, cy, length, options.thickness || 4, {
                isStatic: true,
                angle: angle,
                friction: options.friction ?? 0.05,
                restitution: options.restitution ?? 0.5,
                label: options.label || 'edge'
            });
            bodies.push(body);
        }
        return bodies;
    }

    getCentroid(vertices) {
        let sumX = 0, sumY = 0;
        const count = vertices.length / 2;
        for (let i = 0; i < vertices.length; i += 2) {
            sumX += vertices[i] * 0.10;
            sumY += vertices[i + 1] * 0.10;
        }
        return { x: sumX / count, y: sumY / count };
    }

    toPointList(vertices) {
        const points = [];
        for (let i = 0; i < vertices.length; i += 2) {
            points.push({ x: vertices[i] * 0.10, y: vertices[i + 1] * 0.10 });
        }
        return points;
    }

    drawVerticesToGraphics(graphics, vertices, fill = false) {
        graphics.beginPath();
        for (let i = 0; i < vertices.length; i += 2) {
            if (i === 0) graphics.moveTo(vertices[i] * 0.10, vertices[i + 1] * 0.10);
            else graphics.lineTo(vertices[i] * 0.10, vertices[i + 1] * 0.10);
        }
        if (fill) graphics.closePath().fillPath().strokePath();
        else graphics.strokePath();
    }

    updateScore(newScore) {
        if (newScore > 9999) newScore = 9999;
        this.scoreValue = newScore;

        this.scoreLabel.setText(newScore);

        if (this.scoreValue > parseInt(this.getHighscore())) {
            this.setHighscore(this.scoreValue);
            this.highScoreLabel.setText(newScore);
        }
    }

    getHighscore() {
        try {
            const nameEQ = "highscorepinball=";
            const ca = document.cookie.split(';');
            for (let i = 0; i < ca.length; i++) {
                let c = ca[i].trim();
                if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
            }
        } catch (err) {}
        return "0";
    }

    setHighscore(newHighscore) {
        try {
            let date = new Date();
            date.setTime(date.getTime() + (999 * 24 * 60 * 60 * 1000));
            document.cookie = `highscorepinball=${newHighscore}; expires=${date.toUTCString()}; SameSite=Lax; Secure; path=/`;
        } catch (err) {}
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'content',
    width: 320,
    height: 608,
	physics: {
        default: 'matter',
        matter: {
            gravity: { y: 2 },
            debug: true 
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [PinballPreloader, PinballMainMenu, PinballGame]
};

const game = new Phaser.Game(config);