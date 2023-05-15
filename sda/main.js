
class Animator {
    constructor(duration, interval, callback, end_callback) {
        this.duration = duration;
        this.interval = interval;
        this.id = null;
        this.callback = callback;
        this.end_callback = end_callback;
        this.start = null;
        this.end = null;
        this.promise = null;
    }

    tick() {
        let travelled = performance.now() - this.start;
        let t = travelled / this.duration;

        if (t >= 1) {
            clearInterval(this.id);
            t = 1;
        }
        
        this.callback(t);

        if (t == 1) {
            this.end_callback();
        }
    }

    do() {
        let ctx = this;
        this.start = performance.now();
        this.end = this.start + this.duration;
        this.id = setInterval(() => {
            ctx.tick.call(ctx);
        }, this.interval);
    }
    
}

const text = "Hardystonite is a rare calcium zinc silicate mineral first described from the Franklin, New Jersey, U.S. zinc deposits. It often contains lead, which was detrimental to the zinc smelting process, so it was not a useful ore mineral. Like many of the famous Franklin minerals, hardystonite responds to short wave ultraviolet (254 nm wavelength) light, emitting a fluorescence from dark purple to bright violet blue. In daylight, it is white to gray to light pink in color, sometimes with a vitreous or greasy luster. It is very rarely found as well formed crystals, and these are usually rectangular in appearance and rock-locked."

class Controller {
    constructor() {

        this.iFrame = 0;
        this.maxFrame = 10;
        this.view = document.getElementById("view");
        this.words = null;
        this.animating = false;

        this.event_q = [];
        this.performing = false;
    }


    update_text(text) {
        let el = this.view.getElementsByClassName("p1")[0];
        const s = 0.4;
        el.style.transition = `opacity ${s}s`;
        return new Promise(acc => {
            el.style.opacity = "0";

            setTimeout(() => {
                el.innerHTML = text;
                el.style.opacity = "1";
                setTimeout(() => {acc()}, s * 1000);
            }, s * 1000);
        });
    }

    perform() {
        if (this.event_q.length === 0) {
            this.performing = false;
            return;
        }

        let task = this.event_q.shift();

        let ctx = this;
        task().then(() => {
            ctx.perform.call(ctx);
        })
    }

    wait(time) {
        return new Promise(acc => {
            setTimeout(() => {acc()}, time);
        });
    }

    add(promiser, ...args) {
        let ctx = this;
        this.event_q.push(
            () => {return promiser.apply(ctx, args)}
        )
    }

    promisize(callback) {
        let ctx = this;
        return new Promise(acc => {
            callback.call(this);
            acc();
        });
    }

    frame_0() {
        this.load_frame("training");
        this.add(this.wait, 2000);
        this.add(this.update_text, "To begin the presentation press the <img src='arrow-up.svg' style='transform: rotate(90deg); height: 25pt; width: 25pt; position: relative; top: 4px'></img> key")
        this.perform();
    }

    frame_1() {
        this.add(this.update_text, "The AI models learn to represent text in so called <u>embeddings</u>")
        this.perform();
    }

    frame_2() {
        this.add(this.update_text, "<u>Embeddings</u> are nothing more than bunch of numbers");
        this.perform();
    }

    frame_3() {
        this.add(this.update_text, "For example this [0.8, 0.3, -0.4, 0.2] is an <u>embedding</u>");
        this.perform();
    }

    frame_4() {
        this.add(this.update_text, "Good <u>embeddings</u> capture the essence of the underlining text");
        this.perform();
    }

    frame_5() {
        this.add(this.update_text, "But how are these <u>embeddings</u> created?");
        this.perform();
    }

    frame_6() {
        this.add(this.update_text, "For that, the AI models needs a ton of text");
        this.perform();
    }

    frame_7() {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
        this.add(this.update_text, "To illustrate, let us take some random text from wikipedia:")
        this.add(this.wait, 3500);

        this.add(this.promisize, this.populate_words);
        this.add(this.wait, 1500);
        this.add(this.scroll_to_word, 0);
        this.add(this.wait, 1500);
        this.add(this.scroll_to_word, text.split(" ").length - 1, 0.4);

        this.perform();
    }

    frame_8() {
        this.add(this.update_text, "Unfortunately I did not have enough time to finish the portfolio before the deadline. There is still, however, a bit of content <img src='arrow-up.svg' style='transform: rotate(90deg); height: 25pt; width: 25pt; position: relative; top: 4px'></img>.")
        this.perform();
    }

    frame_9() {
        this.add(this.update_text, "I can finish this presentation verbally in the interview (<img src='arrow-up.svg' style='transform: rotate(90deg); height: 25pt; width: 25pt; position: relative; top: 4px'></img>).");
        this.perform();
    }

    frame_10() {
        this.add(this.update_text, "There is one more project (my bachelor thesis defense) that you can watch by pressing the <img src='arrow-up.svg' style='transform: rotate(180deg); height: 25pt; width: 25pt; position: relative; top: 4px'></img> key.");
        this.perform();
    }


    scroll_to_word(n, slowness=1.2) {

        let word = this.words.getElementsByClassName("word")[n];
        let w_pos = word.getBoundingClientRect();
        let center = window.innerWidth / 2;
        
        let w_center = w_pos.x + w_pos.width / 2

        let dx = center - w_center;
        
    
        let left = parseFloat(this.words.style.left.replace("px", ""));

        if (isNaN(left)) {
            left = 0;
        }

        this.animating = true;
        let ctx = this;
        let time = Math.abs(dx) * slowness;

        return new Promise(acc => {
            new Animator(time, 5, t => {
                let now = left + t * dx;
                ctx.words.style.left = `${now}px`;
            }, () => {ctx.animating = false; acc();}).do();
        });
        
        

    }

    populate_words() {
        let span =  this.view.getElementsByTagName("span")[0];

        const words = text.split(" ");
        for (const word of words) {
            let el = document.createElement("div");
            el.classList.add("word");
            el.innerText = word;
            span.appendChild(el);
        }


        this.words = span;
    }

    nav (e) {
        let k = e.key;

        if (this.animating) {
            return;
        }

        if (k === "ArrowLeft") {
            this.nav_horizontal(-1);
        }
        if (k === "ArrowRight") {
            this.nav_horizontal(1);
        }
    }

    load_frame(name) {
    
        let frame = document.getElementById(name);

        this.view.innerHTML = frame.innerHTML;
        
        return this;
    }
 
    resolve_frame() {
        let frame = this[`frame_${this.iFrame}`];
        frame.call(this);
        return this;
    }
    

    nav_horizontal(direction) {
        let i = this.iFrame + direction;

        if (i < 0) {
            i = 0;
            return;
        }
        if (i > this.maxFrame) {
            i = this.maxFrame;
            return;
        }
    
        this.iFrame = i;
        this.resolve_frame();
    
    }
    
}

const controller = new Controller().resolve_frame();


window.nav_listener = e => {controller.nav.call(controller, e)};