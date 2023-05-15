

var g_state = {
    controllable: false,
    frame: 0,
    header_timeout: null,
    par_timeout: null
}

function state_renderer() {
    
    switch (g_state.frame) {
        case 0:
            par_opacity(1.0);
            header_opacity(1.0)
            par_2_opacity(0.0);
            break;
        case 1:
            par_opacity(0.0);
            header_opacity(1.0);
            par_2_opacity(1.0);
            break;
        case 2:
            par_opacity(0.0);
            par_2_opacity(0.0);
            header_opacity(0.0);
            break;
        default:
            break;
    }
}

function e_keydown(e) {

    let k = e.key;

    if (!g_state.controllable)  {
        clearTimeout(g_state.header_timeout);
        clearTimeout(g_state.par_timeout);
        state_renderer();
        g_state.controllable = true;
        return;
    }

    if (k === "ArrowRight") {
        g_state.frame++;
    }
    if (k === "ArrowLeft") {
        g_state.frame--;
    }

    if (g_state.frame < 0) {
        g_state.frame = 0;
    }
    if (g_state.frame >= 3) {
        g_state.frame = 2;
    }


    state_renderer();
}


function par_2_opacity(opacity) {
    document.getElementById("float_par_2").style.opacity = opacity.toString();
}

function header_opacity(opacity) {
    document.getElementById("float_header").style.opacity = opacity.toString();
}

function par_opacity(opacity) {
    document.getElementById("float_par").style.opacity = opacity.toString();
}

function init() {
    
    g_state.header_timeout = setTimeout(() => {
        header_opacity(1.0)
    }, 1000)

    g_state.par_timeout = setTimeout(() => {
       par_opacity(1.0);
       g_state.controllable = true;
    }, 3000)

    window.nav_listener = e_keydown;
}

init()