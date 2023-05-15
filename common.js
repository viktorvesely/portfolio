
class __Common {

    constructor() {
        let ctx = this;
        document.addEventListener("keydown", e => {ctx.e_keydown.call(ctx, e)});

        window.addEventListener("message", e => {ctx.e_msg.call(ctx, e)})
    }


    e_msg(e) {
        let msg = e.data;

        if (msg.src !== "top") return;
        
        if (msg.type === "keydown") {
            if (window.nav_listener instanceof Function) {
                window.nav_listener(msg.payload)
            }
        }
    }

    e_keydown(e) {
        let k = e.key;

        if (k == "ArrowUp" || k == "ArrowDown") {
            window.top.postMessage({src: "__common", type: "keydown", payload: {key: k}}, "*");
        }
        else {
            if (window.nav_listener instanceof Function) {
                window.nav_listener(e);
            }
        }
    }

    
}

window.__common = new __Common();