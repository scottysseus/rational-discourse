import * as PIXI from 'pixi.js';
import sound from 'pixi-sound';

export function initCity() {
    const HEIGHT = 300;
    const WIDTH = 800;

    PIXI.settings.FAIL_IF_MAJOR_PERFORMANCE_CAVEAT = false;
    let app = new PIXI.Application({ width: WIDTH, height: HEIGHT });
    // document.body.appendChild(app.view);

    app.renderer.backgroundColor = 0x33ccff;

    const loader = PIXI.Loader.shared;

    loader.add('bunny', 'assets/bunny-sheet.png');

    let player;

    let letter = createLetter('A', { x: 100, y: 10 });

    loader.load((loader, resources) => {
        let frames = [];
        for (let i = 0; i < 3; ++i) {
            frames.push(new PIXI.Texture(resources.bunny.texture, new PIXI.Rectangle(i * 28, 0, 28, 29)));
        }
        player = new PIXI.AnimatedSprite(frames);

        app.stage.addChild(player);
        player.animationSpeed = 0.2;
        player.scale.set(-1, 1);
        player.anchor.set(0.5, 0.5);
        player.x = 100;
        player.y = HEIGHT - 80;

        app.stage.addChild(letter.sprite);

        app.ticker.add(delta => render(delta));
    });

    function render(delta) {
        letter.sprite.position.x += letter.speed;
    }

    function setupKeyboard() {
        document.addEventListener('keydown', (event) => {
            const keyName = event.key;
            switch (keyName) {
                case "ArrowLeft":
                    playerQueue.push({ type: EventTypes.LEFT_PRESSED });
                    break;
                case "ArrowRight":
                    playerQueue.push({ type: EventTypes.RIGHT_PRESSED });
                    break;
            }
        }, false);

        document.addEventListener('keyup', (event) => {
            const keyName = event.key;
            switch (keyName) {
                case "ArrowLeft":
                    playerQueue.push({ type: EventTypes.LEFT_RELEASED });
                    break;
                case "ArrowRight":
                    playerQueue.push({ type: EventTypes.RIGHT_RELEASED });
                    break;
                case "ArrowUp":
                    playerQueue.push({ type: EventTypes.UP_RELEASED });
                    break;
            }
        }, false);
    }
}