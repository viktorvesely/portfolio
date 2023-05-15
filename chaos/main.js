
var canvas = document.getElementById("screen");
var ctx = canvas.getContext("2d");
var width = -1, height = -1;


const titleFont = "34px Verdana";
const otherFont = "24px Verdana";
const legendFont = "18px Verdana";

// const primaryColor = "#ffffff";
// var backgroundColor = "#000000";
const primaryColor = "#ffffff";
var backgroundColor = "#000000";
const yColor = "#07db3f";
const invertImgColors = true;

var el_body = document.getElementsByTagName("body")[0];

el_body.style.backgroundColor = backgroundColor;

const omega = 3.37015;
const dt = 0.02;
const a = 5, b = 5;

function updateMultiple(states, trails, trailSize, t, dt, nCycles, omega) {
    for (let s = 0; s < states.length; ++s) {
        let state = states[s];
        let local_t = t;
        for (let i = 0; i < nCycles; i++) {
            let delta = dsdt(state, local_t, a, b, omega, 0);
            local_t += dt;
            state = update(state, delta, dt);
        }

        states[s] = state;
        trails[s].push(state);

        if (trails[s].length > trailSize) {
            trails[s].shift();
        }
    }

    return t + dt * nCycles;

}

function update(state, delta, dt) {
    return [
        state[0] + delta[0] * dt,
        state[1] + delta[1] * dt
    ]
}

function dsdt(state, t, a, b, omega, action) {
    let x = state[0];
    let y = state[1];
    let delta = [
        y - a * ((x * x * x) / 3 - x),
        - x + b * Math.cos(t * omega) + action
    ]
    return delta

}

function resize() {
    height = window.innerHeight - 5;
    width = window.innerWidth - 5;
    canvas.width = width;
    canvas.height = height;
}

function updateTooltip() {
    let tooltip = tooltips[activeFrame];
    let el = document.getElementById("tooltip");
    if (tooltip === "") {
        el.style.display = "none";
        return;
    }

    
    el.style.display = "block";
    
    let explanation_view = document.getElementById("explanation");
    let explanation = document.getElementById(`e_${tooltip}`);

    if (explanation.hasAttribute("style")) {
        explanation_view.style.cssText = explanation.getAttribute("style");
    }
    else {
        explanation_view.style.cssText = "";
    }

    explanation_view.innerHTML = explanation.innerHTML;

}

resize();

var keys = {
    "a": false, "d": false, "w": false, "s": false
};

var depressedKeys = {};

var entry = new HtmlSlide(width, height, 0, 0, "entry_container");
var intro = new IntroGraph(width, height, 0, 0);
var extendIntro = new ExtendIntro(width, height, 0, 0, intro);
var compareGraph = new CompGraphs(width, height, 0, 0);
var phaseTime = new PhaseTime(width, height, 0, 0);
var chaos = new Chaos(width, height, 0, 0);
var heart = new Heart(width, height, 0, 0, h_v_data, rho);
var twoHearts = new TwoHearts(width, height, 0, 0, h_v_data, c_v_data, rho);
var simpleController = new ImageSlide(width, height, 0, 0, "controller_simple.png");
var actor = new Actor(width, height, 0, 0, a_v_data);
var explanation= new ImageSlide(width, height, 0, 0, "con_explanation.png");
var equations = new ImageSlide(width, height, 0, 0, "equations.png");
var con_exploit = new ImageSlide(width, height, 0, 0, "controller_exploit.png");
var arch_heart = new ImageSlide(width, height, 0, 0, "arch_heart.png");
var arch_local = new ImageSlide(width, height, 0, 0, "arch_local.png");
var arch_pca = new ImageSlide(width, height, 0, 0, "arch_pca.png");
var disscussion = new Disscussion(width, height, 0, 0);
var metric = new ImageSlide(width, height, 0, 0, "metric.png");
var results = new ImageSlide(width, height, 0, 0, "results.png");
var val_graph = new ImageSlide(width, height, 0, 0, "val_graph.png");
var test_graph = new ImageSlide(width, height, 0, 0, "test_graph.png");
var dis_text = new ImageSlide(width, height, 0, 0, "dis_text.png");
var title = new ImageSlide(width, height, 0, 0, "title.png");


var frames = [
    entry,
    title,
    intro,
    extendIntro,
    compareGraph,
    phaseTime,
    new SlideEvent(direction => {
        if (direction > 0) {
            chaos.init();
        }
    }),
    chaos,
    new SlideEvent(direction => {
        if (direction > 0) {
            chaos.faster();
        } else {
            chaos.slower();
        }
    
    }),
    chaos,
    new SlideEvent(direction => {
        if (direction > 0) {
            chaos.slower();
        } else {
            chaos.faster();
        }
    }),
    chaos,
    twoHearts,
    new SlideEvent(direction => { 
        if (direction > 0) {
            twoHearts.showMasks();
        } else {
            twoHearts.hideMasks();
        }
    }),
    twoHearts,
    equations,
    simpleController,
    explanation,
    actor,
    con_exploit,
    arch_heart,
    arch_local,
    arch_pca,
    metric,
    results,
    val_graph,
    test_graph,
    dis_text,
    disscussion
]

var tooltips = [
    "showcase",
    "title", // title,
    "intro", // intro,
    "intro_extended", // extendIntro,
    "compare_2d", // compareGraph,
    "phase", // phaseTime,
    "", // new SlideEvent,
    "chaos", // chaos,
    "chaos", // new SlideEvent,
    "chaos", // chaos,
    "chaos", // new SlideEvent,
    "chaos", // chaos,
    "complex", // twoHearts,
    "", // new SlideEvent,
    "scarred", // twoHearts,
    "eqs", // equations,
    "c_normal", // simpleController,
    "why", // explanation,
    "actions", // actor,
    "exploitation", // con_exploit,
    "arch_heart", // arch_heart,
    "arch_local", // arch_local,
    "arch_pca", // arch_pca,
    "errors", // metric,
    "results", // results,
    "val", // val_graph,
    "test", // test_graph,
    "dis", // dis_text,
    "end" // disscussion
]


var activeFrame = 0;
frames[activeFrame].start();
updateTooltip();

function updateDepress() {
    for (const [key, value] of Object.entries(keys)) {
        if (value === false) {
            depressedKeys[key] = true;
        }
        else {
            depressedKeys[key] = false;
        }
    }
}

function press(key) {
    return keys[key] && depressedKeys[key];
}

function e_keydown(e) {
    let k = e.key;
    if (k === "ArrowRight") {
        frames[activeFrame].end();
        activeFrame++;
        if (activeFrame >= frames.length) {
            activeFrame = 0;
        }
        frames[activeFrame].start(1);
    } 

    if (k == "ArrowLeft") {
        frames[activeFrame].end();
        activeFrame--;
        if (activeFrame < 0) {
            activeFrame = frames.length - 1;
        }
        frames[activeFrame].start(-1);
    }
    updateTooltip();
}

function draw() {

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    frames[activeFrame].draw(ctx);

    requestAnimationFrame(draw);
}

// window.addEventListener("click", e => {
//     frames[activeFrame].end();
//     activeFrame++;
//     if (activeFrame >= frames.length) {
//         activeFrame = 0;
//     }
//     frames[activeFrame].start(1);
// })

// window.oncontextmenu = function ()
// {
//     frames[activeFrame].end();
//     activeFrame--;
//     if (activeFrame < 0) {
//         activeFrame = frames.length - 1;
//     }

//     frames[activeFrame].start(-1);
//     return false;     // cancel default menu
// }

window.nav_listener = e_keydown;

requestAnimationFrame(draw);