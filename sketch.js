/* Generative art sketch: a colorful N-Möbius strip
   Semidan Robaina Estevez
*/

let suelo, glauca, cardon, tabaiba, plantImg;
let squarePositions = [];
let plants = [];
let squareSideLength;
const squaresPerSide = 10;
let screenTouched = false;

const n_init_suelo = 60;
const n_init_glauca = 6;
const n_init_cardon = 15;
const n_init_tabaiba = 15;

const glauca_fitness = 1;

function preload() {
  suelo = loadImage("imgs/suelo.png");
  glauca = loadImage("imgs/glauca.png");
  cardon = loadImage("imgs/cardon.png");
  tabaiba = loadImage("imgs/tabaiba.png");
}

function setup() {
  const canvasSideLength = min(windowWidth, windowHeight);
  const numberOfSquares = squaresPerSide ** 2;
  squareSideLength = canvasSideLength / squaresPerSide;
  const offset = 0; //squareSideLength / 2;
  let cnv = createCanvas(canvasSideLength, canvasSideLength);
  cnv.parent('cnv_container');
  frameRate(30);
  noLoop();
  rectMode(CENTER);

  for (let i = 0; i < (squaresPerSide - 0); i++) {
    for (let j = 0; j < (squaresPerSide - 0); j++) {
      squarePositions.push({
        x: offset + i * squareSideLength,
        y: offset + j * squareSideLength
      });
    }
  }


  for (let n = 0; n < numberOfSquares; n++) {
    let randInt = Math.floor(Math.random() * 75);
    let plantPos = squarePositions[n];
    if (randInt < 25) {
      plantImg = suelo;
    } else if (randInt >= 25 & randInt < 50) {
      plantImg = cardon;
    } else if (randInt >= 50 & randInt < 75) {
      plantImg = tabaiba;
    }
    plants[n] = new Plant(id=n, pos=plantPos, img=plantImg, fitness=1);
  }

  let randSample = getRandomSample(0, numberOfSquares, n_init_glauca);
  for (rand_id of randSample) {
    plants[rand_id].img = glauca;
    plants[rand_id].fitness = glauca_fitness;
  }


};

function draw() {
  background('black');

  for (plant of plants) {
    plant.show();
  };

}

class Plant {

  constructor(id, pos, img, fitness) {
    this.id = id;
    this.pos = pos;
    this.img = img;
    this.fitness = fitness;
  }

  show() {
    image(this.img, this.pos.x, this.pos.y, squareSideLength, squareSideLength);
  }

}

// helper functions
function updateScreenEvent() {
  screenTouched = !screenTouched;
  button.innerHTML = "Pause";
  if (!screenTouched) {
    button.style['background-color'] = "rgb(208, 165, 37)";
  } else {
    button.style['background-color'] = "rgb(120, 120, 120)";
  }
}

function updateSize(){
  resizeCanvas(windowWidth, windowHeight);
  fullscreen();
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
