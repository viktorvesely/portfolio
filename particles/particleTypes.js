
const ParticleTypes = [
  {
    name: "blue",
    color: "#3c4cff",
    radius: 5,
    frictionModificator: 1, 
    forceRadius: 200,
    maxForce: 0.4,
    behaviour: [
      {
        name: "yellow",
        forceModificator: -1
      },
      {
        name: "blue",
        forceModificator: -1.03
      },
      {
        name: "white",
        forceModificator: 1.1
      },
      {
        name: "repelent",
        forceModificator: 1
      },
      {
        name: "purple",
        forceModificator: 1
      }
    ]
  },
  {
    name: "yellow",
    color: "#ffef3c",
    radius: 6,
    frictionModificator: 1, 
    forceRadius: 100,
    maxForce: 0.7,
    behaviour: [
      {
        name: "repelent",
        forceModificator: 1
      },
      {
        name: "blue",
        forceModificator: 1 
      },
      {
        name: "white",
        forceModificator: -1
      }
    ]
  },
  {
    name: "repelent",
    color: "#ffaaef",
    radius: 4,
    frictionModificator: 0.5,
    forceRadius: 800,
    maxForce: 0.3,
    behaviour: [
      {
        name: "all",
        forceModificator: -1
      }
    ]
  },
  {
    name: "white",
    color: "#ff3c4c",
    radius: 6,
    frictionModificator: 1, 
    forceRadius: 180,
    maxForce: 0.8,
    behaviour: [
      {
        name: "yellow",
        forceModificator: -1.1
      }
    ]
  },
  {
    name: "purple",
    color: "#ff4cdb",
    radius: 6,
    frictionModificator: 1, 
    forceRadius: 350,
    maxForce: 0.5,
    behaviour: [
      {
        name: "white",
        forceModificator: 1.1
      },
      {
        name: "yellow",
        forceModificator: 1.1
      },
      {
        name: "blue",
        forceModificator: -0.1
      },
      {
        name: "repelent",
        forceModificator: 1
      },
      {
        name: "orange",
        forceModificator: -1.3
      }
    ]
  },
  {
    name: "orange",
    color: "#ffaa00",
    radius: 6,
    frictionModificator: 1, 
    forceRadius: 300,
    maxForce: 0.6,
    behaviour: [
      {
        name: "yellow",
        forceModificator: 1
      },
      {
        name: "orange",
        forceModificator: -0.4
      },
      {
        name: "purple",
        forceModificator: -1
      }
    ]
  },
  {
    name: "pink",
    color: "#4cff70",
    radius: 5,
    frictionModificator: 1, 
    forceRadius: 100,
    maxForce: 0.7,
    behaviour: [
      {
        name: "yellow",
        forceModificator: 1
      },
      {
        name: "orange",
        forceModificator: -0.4
      },
      {
        name: "purple",
        forceModificator: -1
      }
    ]
  },
  {
    name: "black",
    color: "#d439ff",
    radius: 5,
    frictionModificator: 1, 
    forceRadius: 200,
    maxForce: 0.8,
    behaviour: [
      {
        name: "yellow",
        forceModificator: 1
      },
      {
        name: "orange",
        forceModificator: -0.4
      },
      {
        name: "purple",
        forceModificator: -1
      }
    ]
  }
]



class Behaviour {
  constructor(pars) {
    
    this.pars = pars;
    this.types = this.shuffleBehaviour();
    
  }
    
  shuffleBehaviour() {

    let force_min = this.pars.force_min;
    let force_max = this.pars.force_max;
    let force_amplitude = this.pars.force_amplitude;
    let p_interactibility = this.pars.p_interactibility;
    let p_atractor = this.pars.p_atractor;

    if (force_min > force_max) {
      this.pars.force_min = force_max;
    }

    for (const type of ParticleTypes) {
      type.forceRadius = Math.random() * (force_max - force_min) + force_min;
      type.maxForce = Math.random() * force_amplitude;
      type.behaviour = [];
        for (const target of ParticleTypes) {

          let will_interact = Math.random() <= p_interactibility;
          let is_attractor = Math.random() <= p_atractor;

          if (!will_interact) {
            continue;
          } 

          type.behaviour.push({
            name: target.name,
            forceModificator: is_attractor ? -1 : 1
          })
        }
    }

    return ParticleTypes;
  }

  updateBehaviour() {
    let max_r = this.pars.radius_max;
    let min_r = Math.max(max_r - this.pars.radius_range, 2);
    
    for (const type of ParticleTypes) {
      type.radius = Math.round(Math.random() * (max_r - min_r) + min_r);
    }
  }
    
  exportBehaviour() {
    window.behaviour = this.types;
    let items = JSON.parse(localStorage.getItem("saved_behaviours")) || [];
    items.push(this.types);
    localStorage.setItem(items);
    console.log("The behaviour is stored in 'behaviour' variable and in localStorage");
  }
  
  
}
