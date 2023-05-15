
class Controller {

    constructor() {
        this.view = document.getElementById("view");

        let ctx = this;
        document.addEventListener("keydown", e => {ctx.e_keydown.call(ctx, e)});

        window.addEventListener("message", e => {ctx.e_msg.call(ctx, e)})

        this.main_shadow = null;

        this.projects = {}
        this.project_insertion_order = [];
        this.current_project_i = 0;
        this.animating_transition = false;
        this.current_iframe = null;
        this.loader = document.getElementById("loader");
        this.loader_timeout = 0;
    }

    project_name() { return this.project_insertion_order[this.current_project_i] }

    project_obj() { return this.projects[this.project_name()] }

    register_project(folder, entry_html="index.html") {
        this.projects[folder] = {
            folder: folder,
            entry_html: entry_html
        }
        this.project_insertion_order.push(folder);
        return this;
    }

    load_project(direction=0) {

        this.animating_transition = true;
        let old_iframe = null;
        if (this.view.childNodes.length > 1) {
            throw "Too many htmlchildren in view!"
        }
        if (this.view.childNodes.length == 1) {
            old_iframe = this.view.childNodes[0];
        }

        let project = this.project_obj()

        let url = `/${project.folder}/${project.entry_html}`;
        
        let iframe = document.createElement("iframe");
    
        iframe.setAttribute("width", "100%");
        iframe.setAttribute("height", "100%");
        iframe.setAttribute("frameborder", "0");
        iframe.setAttribute("src", url);

        if (old_iframe !== null) {
            let class_suffix = direction === -1 ? "down" : "up";
            var initial_class_name = `frame_shifted_${class_suffix}`
            iframe.classList.add(initial_class_name);
        }

        let ctx = this;
        iframe.addEventListener("load", () => {
            iframe.contentWindow.eval('let _scr = document.createElement("script"); _scr.setAttribute("src", "__common.js"); document.body.append(_scr);')
            
            clearTimeout(this.loader_timeout);
            ctx.loader.style.display = "none";

            if (old_iframe === null) {
                ctx.animating_transition = false;
               
                return;
            }
    
            let anim_dir = direction == -1 ? "up" : "down"
            let anim_out = `anim_out_${anim_dir}`
            let anim_in = `anim_in_${anim_dir}`
    
            iframe.classList.remove(initial_class_name);
            iframe.classList.add(anim_in);
            old_iframe.classList.add(anim_out);
    
            setTimeout(() => {
                old_iframe.remove();
                iframe.classList.remove(anim_in);
                ctx.animating_transition = false;

            }, 400);
    
        });
       
        this.loader_timeout = setTimeout(() => {
            ctx.loader.style.display = "inline-block";
        }, 1000)
        this.view.appendChild(iframe);
        this.current_iframe = iframe;

    
        return this;
    }

    e_msg(e) {
        let msg = e.data;

        if (msg.src !== "__common") return;
        
        if (msg.type === "keydown") {
            this.e_keydown(msg.payload);
        }
    }
      
    e_keydown(e) {
        
        let k = e.key;

        if (k === "ArrowRight") {
            this.nav_horizontal(k);
        }
        if (k === "ArrowLeft") {
            this.nav_horizontal(k);
        }
        if (k === "ArrowDown") {
            this.nav_vertical(1)
        }
        if (k == "ArrowUp") {
            this.nav_vertical(-1)
        }
    }

    nav_vertical(direction) {

        if (this.animating_transition) {
            return;
        }

        this.current_project_i += direction;
    
        let n_projects = this.project_insertion_order.length;
        if (this.current_project_i < 0) {
            this.current_project_i = n_projects - 1;
        }
        if (this.current_project_i >= n_projects) {
            this.current_project_i = 0;
        }

        this.load_project(direction);
    }

    nav_horizontal(k) {
        this.current_iframe.contentWindow.postMessage({src: "top", type: "keydown", payload: {key: k}}, "*");
    }
}

var controller = new Controller(
    ).register_project(
        "particles",
        "index.html"
    ).register_project(
        "durko",
        "index.html"
    ).register_project(
        "sda",
        "index.html"
    ).register_project(
        "chaos",
        "index.html"
    ).load_project()

