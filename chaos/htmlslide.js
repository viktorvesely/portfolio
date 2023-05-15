class HtmlSlide {
    constructor(width, height, x0, y0, id) {
        this.width = width;
        this.height = height;
        this.x0 = x0;
        this.y0 = y0;
        this.id = id;
        this.recover = backgroundColor;
        this.view = null;
    }


    start() {

        let element = document.getElementById(this.id);
        
        let view = document.createElement("div");

        view.style.height = `${this.height}px`;
        view.style.width = `${this.width}px`;
        view.style.position = 'absolute';
        view.style.top = `${this.x0}px`;
        view.style.left = `${this.y0}px`;
        view.style.zIndex = "3";
        
        view.innerHTML = element.innerHTML;

        document.body.appendChild(view);
        this.view = view;
    }

    draw() {

    }

    end() {
        this.view.remove();
    }
}