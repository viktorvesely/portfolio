const behaviour = {
  radius_range: 4,
  radius_max: 8,
  force_min: 80,
  force_max: 280,
  force_amplitude: 1.1,
  p_interactibility: 0.8,
  p_atractor: 0.5,
  shuffle() {
    world.shuffleBehaviour();
  }
}


class World {

  constructor(id, nParticles, mode="BEHAVIOUR", tickBase=60) {
    this.canvas = document.getElementById(id);
    this.mid = [];
    this.resize();
    
    this.ctx = this.canvas.getContext("2d");
    this.maxLines = Math.floor(this.canvas.height / this.lineSize);
    this.particlesOffset = this.canvas.width / this.nParticlesPerLine;
    this.shouldDraw = true;
    this.pause = false;
    this.tickBase = tickBase;
    this.ticks = 0;
    this.ticksToTime = 1000 / tickBase;
    
    this.behaviour = new Behaviour(behaviour);
    this.particles = [];
    this.switchMode(mode);
    window.wrapWorld = true;
    //this.initPopulation(nParticles);
    this.bigBang(nParticles);
    this.particles[0].goTo(new Vector(700, 400));
    
    this.collision = new CollisionManager(this.particles, this.canvas);
    this.positions = [];
    const xSegments = 10;
    const ySegments = 3;
    this.clusters = [];
    
    this.interval = setInterval(function(context) {
      context.tick.call(context, context.ticks);
    }, 1000 / this.tickBase, this);
    this.draw();
  }
  
  switchMode (mode) {
    let nMode = this.MODE[mode] || this.MODE.BEHAVIOUR;
    let nextFriction = this.FRICTION[nMode] || this.FRICTION[this.DEFAULT_FRICTION];
    this.frictionCoefficient = nextFriction;
    this.mode = nMode;
  }
  
  shuffleBehaviour() {
    this.behaviour.shuffleBehaviour();
  }
  
  updateBehaviour() {
    this.behaviour.updateBehaviour();
  }
  
  destroy() {
    clearInterval(this.interval);
    this.shouldDraw = false;
  }

  resize() {
    let realSize = this.canvas.getBoundingClientRect();
    this.canvas.width = realSize.width;
    this.canvas.height = realSize.height;
    this.mid = [
      this.canvas.width / 2,
      this.canvas.height / 2
    ];
  }
  
  wrap() {
    window.wrapWorld = !window.wrapWorld;
  }

  countOnRadius(radius) {
    const maxRadius = 6;
    const offset = maxRadius + 2;
    let circumference = 2 * Math.PI * radius; 
    let count = Math.floor(circumference / offset);
    return Math.max(1, count);
  }
  
  bigBang(nParticle) {
    const radiusStep = 20;
    let radius = -radiusStep;
    let currentCount = 0, maxCurrent = 0, count = 0;
    while (count != nParticle) {
      if (currentCount == maxCurrent) {
        radius += radiusStep;
        maxCurrent = this.countOnRadius(radius);
        currentCount = 0;
      }
      
      let currentAngle = Math.PI * 2 * (currentCount / maxCurrent);
      let x, y;
      
      x = Math.cos(currentAngle) * radius + this.mid[0];
      y = Math.sin(currentAngle) * radius + this.mid[1];
      x = Math.round(x);
      y = Math.round(y);
      
      this.particles.push(new Particle(new Vector(x , y), this.particles.length, this.behaviour));
      
      currentCount++;
      count++;
    }
  }
  
  initPopulation(nParticles) {
    let finalPopulationSize = nParticles
    let lines = Math.ceil(nParticles / this.nParticlesPerLine);
    if (lines > this.maxLines) {
      finalPopulationSize = this.maxLines * this.nParticlesPerLine;
    }
    for (let i = 0; i < finalPopulationSize; ++i) {
      let currentLine = Math.floor(i / this.nParticlesPerLine) + 1;
      let currentIndex = i % this.nParticlesPerLine;
      let currentXPos = (currentIndex * this.particlesOffset) + (this.particlesOffset / 2);
      this.particles.push(new Particle(new Vector(currentXPos , currentLine * this.lineSize), this.particles.length, this.behaviour));
    }
  }

  tick(ticks) {
    if (this.pause) return;
    
    if (ticks === 1000000) this.ticks = 0;
    this.ticks++;
    
    this.collision.collide();
    
    this.positions = [];
    this.particles.forEach(particle => {
      let friction = new Vector(particle.speed)
        .negative()
        .multiply(this.frictionCoefficient)
        .multiply(particle.type.frictionModificator);
      particle.speed.add(friction);
      particle.behave(this.particles, this.mode, this.MODE);
      particle.pos.add(particle.speed);
      this.positions.push([particle.pos.x, particle.pos.y]);
    });
    
    /*this.clusters = clusterfck.kmeans(this.positions, 10);
    let temp = [];
    let current = [];
    this.clusters.forEach(cluster => {
        clusterfck.kmeans(this.positions, 30).forEach(c => {
            temp.push(c);
        });
    });
    this.clusters = temp;*/
  }

  draw() {
    if (!this.shouldDraw) { return; }
    requestAnimationFrame(() => {
      this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
      this.ctx.beginPath();
      this.ctx.fillStyle = "#060719";
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.particles.forEach(particle => {
        particle.draw(this.ctx);
      });
      
      this.clusters.forEach(cluster => {
        if (cluster.length < 10) return;
          let pivot = cluster[0];
          for (let i = 1; i < cluster.length; i++) {
            let p = cluster[i];
            this.ctx.beginPath();
            this.ctx.moveTo(pivot[0], pivot[1]);
            this.ctx.lineTo(p[0], p[1]);
            this.ctx.strokeStyle = "#FFFFFF";
            this.ctx.stroke();
          }
      });
      this.draw();
    })
  }
}

World.prototype.nParticlesPerLine = 30;
World.prototype.lineSize = 35;
World.prototype.frictionCoefficient = 0.1;
World.prototype.MODE = {};
World.prototype.FRICTION = [];
World.prototype.MODE.BEHAVIOUR = 0;
World.prototype.MODE.HOLLOW = 1;
World.prototype.MODE.FOLLOW = 2;
World.prototype.DEFAULT_FRICTION = -1;
World.prototype.FRICTION[World.prototype.DEFAULT_FRICTION] = 0.1;
World.prototype.FRICTION[World.prototype.MODE.HOLLOW] = 0.04;


window.tickBase = 45;
window.debugTime = 0;
window.nPopulation = 350;

let world = new World("world", window.nPopulation, "BEHAVIOUR" , window.tickBase);


window.addEventListener("resize", () => {
  world.resize();
})

window.onkeyup = function(e) {
  var key = e.keyCode ? e.keyCode : e.which;
  
  return;

  if (key == 83) { // S
    world.shuffleBehaviour();
  } else if (key == 87) { // W
    world.wrap();
  } else if (key == 38) { // KEY_UP
    world.destroy();
    window.nPopulation += 20;
    world = new World("world", window.nPopulation, "BEHAVIOUR" , window.tickBase);
  } else if (key == 40) { // KEY_DOWN
    world.destroy();
    window.nPopulation -= 20;
    world = new World("world", window.nPopulation, "BEHAVIOUR" , window.tickBase);
  } else if (key == 49) { // 1
    world.switchMode("BEHAVIOUR");
  } else if (key == 50) { // 2
    world.switchMode("HOLLOW");
  } else if (key == 51) { // 3
    world.switchMode("FOLLOW");
  } else if (key == 80) { // P
    world.pause = !world.pause;
  }
}

function updateBehaviour() {
  world.updateBehaviour.call(world);
}

function resetWorld() {
  world.destroy();
  world = new World(
    "world",
    Math.round(window.nPopulation),
    "BEHAVIOUR",
    Math.round(window.tickBase)
  );
}

function initMenu() {
  let gui = new dat.GUI({width: 300});
  gui.add(window, 'nPopulation', 2, 600, 1).onFinishChange(resetWorld).name("N of particles");
  gui.add(window, 'tickBase', 30, 90, 1).onFinishChange(resetWorld).name("Simulation speed");
  
  let behFolder = gui.addFolder('Particles');
  
  behFolder.add(behaviour, 'shuffle').name("Shuffle behaviour");
  behFolder.add(behaviour, 'radius_max', 5, 40, 1).name("Max size").onFinishChange(updateBehaviour);
  behFolder.add(behaviour, 'radius_range', 2, 30, 1).name("Size range").onFinishChange(updateBehaviour);
  behFolder.add(behaviour, 'force_amplitude', 0.1, 6, 0.05).name("Force amplitude").onFinishChange(behaviour.shuffle);
  behFolder.add(behaviour, 'p_interactibility', 0.0, 1.0, 0.05).name("Interactivity").onFinishChange(behaviour.shuffle);
  behFolder.add(behaviour, 'p_atractor', 0.0, 1.0, 0.05).name("Attractivity").onFinishChange(behaviour.shuffle);
  behFolder.add(behaviour, 'force_min', 5, 300, 1).name("Min force radius").onFinishChange(behaviour.shuffle);
  behFolder.add(behaviour, 'force_max', 5, 300, 1).name("Max force radius").onFinishChange(behaviour.shuffle);
  
  behFolder.open();
  
  gui.close();
}

initMenu();
