class SlideEvent {
    constructor(action) {
        this.action = action;
    }

    start(direction) {
        this.action(direction);
        frames[activeFrame].end();
        activeFrame += direction;

        if (activeFrame >= frames.length) {
            activeFrame = 0;
        }

        if (activeFrame < 0) {
            activeFrame = frames.length - 1;
        }

        frames[activeFrame].start();
    }

    draw() {

    }

    end() {

    }
}