/* Una simulación sencilla del proceso de invasión de Nicotiana glauca en un ecosistema de cardones y tabaibas desarrollada para alumnado de 4º de ESO.
   Semidan Robaina Estevez
*/

let suelo, glauca, cardon, tabaiba, plantImg, images;
let gridElements = [];
let plants = [];
let plantTypeData;
let squareSideLength;
let numberOfSquares;
const squaresPerSide = 20;
let canvasSideLength = document.getElementById("cnv_container").offsetWidth;
const backgroundColor = getComputedStyle(document.documentElement)
    .getPropertyValue("--backgroundColor");
const fontColor = getComputedStyle(document.documentElement)
    .getPropertyValue("--fontColor");
let sim_started, sim_reseted;

let n_plants_init = {
  glauca: 1,
  cardon: 5,
  tabaiba: 5
};

let plantParameters = {
  glauca: {
    energy_gain_rate: 0.25,
    reproductive_energy_threshold: 2,
    max_life: 15,
    life_dev: 5,
    seed_success: 0.01,
    max_seed_production: 300,
    seed_production_dev: 10,
    max_seed_dispersal: 2,
    toxicity_to_neighbors: 0.005,
    life_loss_rate: 1,
  },
  cardon: {
    energy_gain_rate: 0.20,
    reproductive_energy_threshold: 3,
    max_life: 20,
    life_dev: 5,
    seed_success: 0.01,
    max_seed_production: 100,
    seed_production_dev: 10,
    max_seed_dispersal: 5,
    toxicity_to_neighbors: 0.005,
    life_loss_rate: 1,
  },
  tabaiba: {
    energy_gain_rate: 0.18,
    reproductive_energy_threshold: 2,
    max_life: 20,
    life_dev: 5,
    seed_success: 0.01,
    max_seed_production: 200,
    seed_production_dev: 10,
    max_seed_dispersal: 2,
    toxicity_to_neighbors: 0.005,
    life_loss_rate: 1,
  },
  suelo: {
    energy_gain_rate: 0.25,
    reproductive_energy_threshold: 2,
    max_life: 20,
    life_dev: 5,
    seed_success: 0.01,
    max_seed_production: 100,
    seed_production_dev: 10,
    max_seed_dispersal: 0,
    toxicity_to_neighbors: 0.005,
    life_loss_rate: 1,
  }
};

function preload() {
  suelo = loadImage("imgs/suelo.png");
  glauca = loadImage("imgs/glauca.png");
  cardon = loadImage("imgs/cardon.png");
  tabaiba = loadImage("imgs/tabaiba.png");
}

function setup() {
  images = {suelo: suelo, glauca: glauca, cardon: cardon, tabaiba:tabaiba};
  plantTypeData = {glauca: [], tabaiba: [], cardon: []};
  numberOfSquares = squaresPerSide ** 2;
  squareSideLength = canvasSideLength / squaresPerSide;

  let cnv = createCanvas(canvasSideLength, canvasSideLength);
  cnv.parent('cnv_container');
  frameRate(4);

  for (let i = 0; i < (squaresPerSide - 0); i++) {
    for (let j = 0; j < (squaresPerSide - 0); j++) {
      gridElements.push({
        x: i * squareSideLength,
        y: j * squareSideLength,
        coord: [i, j],
      });
    }
  }

  for (let n = 0; n < numberOfSquares; n++) {
    let plantPos = gridElements[n];
    plants[n] = new Plant(id="suelo", img=images["suelo"], pos=plantPos,
      plantParameters["suelo"]);
  }

  // populate grid with seed plants
  let plantIDs = ["cardon", "tabaiba", "glauca"];
  for (let plantID of plantIDs) {
    let randSample = getRandomSample(
      0, numberOfSquares, n_plants_init[plantID]);
    for (rand_idx of randSample) {
      plants[rand_idx].id = plantID;
      plants[rand_idx].img = images[plantID];
      plants[rand_idx].p = plantParameters[plantID];
    }
  }

  for (plant of plants) {
    plant.initialize();
    plant.show();
  }

  // Initialize interface
  setSliderDefaultValues();
  plotDataFraction(plantTypeData);
  sim_started = false;
  sim_reseted = false;

}

function draw() {

  if (!sim_started) {
  } else {
    background('black');
    for (plant of plants) {
      plant.updateState();
      if (plant.id !== "suelo" & plant.reproduce === true) {
        reproducePlant(plant);
      }
    }

    for (plant of plants) {
      plant.show();
    }

    let plant_type_count = countPlantTypes(plants);
    plantTypeData.glauca.push(plant_type_count.glauca);
    plantTypeData.cardon.push(plant_type_count.cardon);
    plantTypeData.tabaiba.push(plant_type_count.tabaiba);
    plotDataFraction(plantTypeData);

    if (plant_type_count.glauca === numberOfSquares) {
      noLoop();
    }
  }

}


class Plant {
  constructor(id, img, pos, params) {
    this.id = id;
    this.img = img;
    this.pos = pos;
    this.p = params;
    this.energy = 0;
    this.life = 0;
    this.seeds = 0;
    this.reproduce = false;
  }

  initialize() {
    this.life = getRandomInt(this.p.max_life - this.p.life_dev, this.p.max_life + this.p.life_dev);
    this.energy = 0;
    this.seeds = 0;
    this.reproduce = false;
  }

  updateState() {
    this.energy += this.p.energy_gain_rate;
    if (this.life <= 0) {
      this.img = suelo;
      this.id = "suelo";
      this.seeds = 0;
      this.energy = 0;
      this.p = plantParameters["suelo"];
    }
    if (this.energy >= this.p.reproductive_energy_threshold) {
      this.seeds = getRandomInt(this.p.max_seed_production - this.p.seed_production_dev, this.p.max_seed_production + this.p.seed_production_dev);
      this.energy = 0;
    }
    if (Math.round(this.seeds * this.p.seed_success) > 0) {
      this.reproduce = true;
    } else {
      this.reproduce = false;
    }
    this.life -= this.p.life_loss_rate;
  }

  show() {
    image(
      this.img, this.pos.x, this.pos.y, squareSideLength, squareSideLength);
  }

}

function reproducePlant(plant) {

  let available_spots = plants.filter(
    spot => (spot.id === "suelo") & (computeDistance(spot.pos.coord, plant.pos.coord) <= plant.p.max_seed_dispersal)
  );

  if (available_spots.length > 0) {
    let successful_seeds = Math.round(plant.seeds * plant.p.seed_success);
    let random_idxs = getRandomSample(0, available_spots.length - 1,
      Math.min(available_spots.length, successful_seeds));
    for (let i=0; i<random_idxs.length; i++) {
      available_spots[i].id = plant.id;
      available_spots[i].img = plant.img;
      available_spots[i].p = plantParameters[plant.id];
      available_spots[i].initialize();
    }
  }
  // Plant gets depleted of seeds and energy once reproduces
  plant.reproduce = false;
  plant.seeds = 0;
}

function computeDistance([a, b], [c, d]) {
  return Math.max(Math.abs(a - c), Math.abs(b - d))
}

function countPlantTypes(plants) {
  let plant_types = {glauca:0, tabaiba:0, cardon:0};
  for (plant of plants) {
    if (plant.id === "glauca") {
      plant_types.glauca += 1;
    } else if (plant.id === "cardon") {
      plant_types.cardon += 1;
    } else if (plant.id === "tabaiba") {
      plant_types.tabaiba += 1;
    }
  }
  return plant_types
}

function plotDataFraction(data) {

  let plant_fraction = {glauca:[], tabaiba:[], cardon:[]};
  for (let i=0; i<data.glauca.length; i++) {
     let total = data.glauca[i] + data.tabaiba[i] + data.cardon[i];
     plant_fraction.glauca.push(100 * (data.glauca[i]/total));
     plant_fraction.tabaiba.push(100 * (data.tabaiba[i]/total));
     plant_fraction.cardon.push(100 * (data.cardon[i]/total));
  }
  let x_array = [...Array(data.glauca.length).keys()];

  let glauca_fraction = {
    x: x_array,
    y: plant_fraction.glauca,
    name: "Tabaco moro",
    showlegend: true,
    line: {
      color: "rgb(219, 185, 5)"
    }
  };
  let cardon_fraction = {
    x: x_array,
    y: plant_fraction.cardon,
    name: "Cardón",
    showlegend: true,
    line: {
      color: "rgb(8, 184, 10)"
    }
  };
  let tabaiba_fraction = {
    x: x_array,
    y: plant_fraction.tabaiba,
    name: "Tabaiba",
    showlegend: true,
    line: {
      color: "rgb(227, 44, 177)"
    }
  };

  plot_data = [glauca_fraction, cardon_fraction, tabaiba_fraction];

  let layout = {
	 title: `Evolución de poblaciones`,
   mode: "lines",
   font: {
     color: fontColor
   },
   xaxis: {
     title: "Tiempo"
     // tickfont: {
     //   size: 10
     // }
   },
   yaxis: {title: "Frecuencia (%)"},
   plot_bgcolor: backgroundColor,
   paper_bgcolor: backgroundColor,
   legend: {
    x: 1,
    xanchor: 'right',
    y: 1
   },
   // margin: {
   //   l: 0,
   //   t: 0,
   //   b: 0
   // }
  };
  let config = {responsive: true};
  Plotly.newPlot("plot_container", plot_data, layout);//, config);
}

// CONTROLS
function startSimulation() {
  let button = document.getElementById("start-button");
  // sim_started = !sim_started;
  if (!sim_started) {
    button.innerHTML = "<i class='fas fa-pause'></i>";
  } else {
    button.innerHTML = "<i class='fas fa-play'></i>";
  }
  sim_started = !sim_started;
}

function resetSimulation() {
  let button = document.getElementById("start-button");
  button.innerHTML = "<i class='fas fa-play'></i>";
  setup();
}

function setSliderDefaultValues() {
  document.getElementById('ninit_slider_text').innerHTML = n_plants_init.glauca;
  document.getElementById('dispersal_slider_text').innerHTML = plantParameters.glauca.max_seed_dispersal;
  document.getElementById('seed_production_slider_text').innerHTML = plantParameters.glauca.max_seed_production;
  document.getElementById('rep_eficiency_slider_text').innerHTML = plantParameters.glauca.energy_gain_rate;
}

function updateNinitSliderText(value) {
  document.getElementById('ninit_slider_text').innerHTML = value;
  n_plants_init.glauca = value;
  resetSimulation();
}

function updateDispersalSliderText(value) {
  document.getElementById('dispersal_slider_text').innerHTML = value;
  plantParameters.glauca.max_seed_dispersal = value;
  resetSimulation();
}

function updateSeedProductionSliderText(value) {
  document.getElementById('seed_production_slider_text').innerHTML = value;
  plantParameters.glauca.max_seed_production = value;
  resetSimulation();
}

function updateRepEficiencySliderText(value) {
  document.getElementById('rep_eficiency_slider_text').innerHTML = value;
  plantParameters.glauca.energy_gain_rate = value;
  resetSimulation();
}

// function updateSize(){
//   resizeCanvas(windowWidth, windowHeight);
// }

function getRandomInt(min, max) {
  return Math.floor((max - min) * Math.random() + min);
}

function getRandomSample(minInt, maxInt, size) {
  /* Draw random sample of specified size, without repetition,
     from a sequence of numbers between minInt and maxInt
  */
  let numbers = []
  for (i = minInt; i < maxInt + 1; i++) {
    numbers.push(i);
  }
  randomSample = [];
  for (let i = 0; i < size; i++) {
    let sampledNumber = numbers.splice(
      Math.floor(Math.random() * numbers.length), 1)[0];
    randomSample.push(sampledNumber);
  }
  return randomSample
}
