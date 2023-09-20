const {
    Engine,
    World,
    Bodies,
    Body,
    Composite,
    Constraint,
    Mouse,
    MouseConstraint
} = Matter;

let engine;
let world;
//create snow..........

let snow = [];
let gravity;
let windSlider;
let customSlider; //styled in css file



//............
let particles = [];
//let particles2 = [];
let boundaries = [];
let mConstraint;
let ball;
//let gravity = 0.001; //don't need this
let stringLength;
let increment;
let bounceFactor = -0.5;
let ballForceScale = 0.02;
let windScale = 0.001;
let windXoff = 0;
let windYoff = 0;
let mass;
let boxes = [];
let lastBoxTime = 0; // Initialize a variable to keep track of the last box creation time
let minBoxInterval = 3000; // Minimum time interval (3 seconds) in milliseconds
let maxBoxInterval = 5000; // Maximum time interval (5 seconds) in milliseconds

let streetlight;

//part of the clef function
let bassclef;
let wobble = 0;
let size = 70;

//Create the lines for the stave.................

let line1;
let line2;
let line3;
let line4;
let line5;

let line1Particles = []; // Array to store line1 particles
let line2Particles = []; // Array to store line2 particles
let line3Particles = []; // Array to store line3 particles
let line4Particles = []; // Array to store line4 particles
let line5Particles = []; // Array to store line5 particles

//............................................................


function preload(){
  bassclef = loadImage('bassclef.png');
  // streetlight = loadImage('streetlight.png');
  // streetlight2 = loadImage('streetlight.png');
  // streetlight3 = loadImage('streetlight.png');
  // bassclef.resize(0, 40);
}

function setup() {
    let canvas = createCanvas(720, 400);

    //windSlider = createSlider(0, 0.0005, 0.0001, 0.0001);
    //windSlider.position(10, height + 10);
  
    customSlider = select('#windSlider');
    
    // Listen for the input event on the slider and call a function when it changes
    customSlider.changed(updateSliderValue);

    
    lastBoxTime = millis();
  
    bassclef.resize(0, 50);
    // streetlight.resize(0, 150);
    // streetlight2.resize(0, 120);
    // streetlight3.resize(0, 75);

    engine = Engine.create();

    stringLength = 732;
    increment = 12; // the increment must be a divisor of stringLength
    world = engine.world;
    mass = 1;
  
  
  //arguments for line are: (y position, length, stiffness, radius)
    line1 = new staveLine(100, 0, 0.85, 7);
    line1.createParticlesAndConstraints(line1Particles);
  
    line2 = new staveLine(115, 0, 0.85, 7);
    line2.createParticlesAndConstraints(line2Particles);
  
    line3 = new staveLine(130, 0, 0.85, 7);
    line3.createParticlesAndConstraints(line3Particles);
  
    line4 = new staveLine(145, 0, 0.85, 7);
    line4.createParticlesAndConstraints(line4Particles);
  
    line5 = new staveLine(160, 0, 0.85, 7);
    line5.createParticlesAndConstraints(line5Particles);
    
  
  
    boundaries.push(new Boundary(width / 2, 400, width, 20, 0));

    let canvasMouse = Mouse.create(canvas.elt);
    let options = {
        mouse: canvasMouse,
    }

    canvasMouse.pixelRatio = pixelDensity();
    mConstraint = MouseConstraint.create(engine, options);
    World.add(world, mConstraint);
  
  //     for (let flake of snow) {
  //   World.add(world, flake.body);
  // }
  engine.gravity.y = 0.4;
}

function draw() {
    background(255, 253, 253);
    //background(100, 253, 253);
    // bgGradient.show();
    Engine.update(engine);
  
    let sliderValue = customSlider.value();
    let wind = calculateWind(sliderValue);
 
    //      for (let i = 0; i < boxes.length; i++) {
    //     boxes[i].show();
    // }
  
    let currentTime = millis();
    let elapsedTime = currentTime - lastBoxTime;
  
    if (elapsedTime >= minBoxInterval && boxes.length < 10) {
        // Create a new box
        boxes.push(new Box(random(70, width-20), random(-30, 50), random(10, 40)));

        // Reset the lastBoxTime and generate a new random interval
        lastBoxTime = currentTime;
        minBoxInterval = random(3000, 8000); // Randomize the interval for the next box
    }
  
    for (let i = boxes.length - 1; i >= 0; i--) {
    boxes[i].show();
    boxes[i].fadeOut(); // Decrease opacity
    if (boxes[i].body.position.y > 300 && boxes[i].fade <= 0) {
      // Remove the box from the array
      boxes.splice(i, 1);
    }
  }
  

  
  
  applyForcesAndShowParticles(line1Particles);
  applyForcesAndShowParticles(line2Particles);
  applyForcesAndShowParticles(line3Particles);
  applyForcesAndShowParticles(line4Particles);
  applyForcesAndShowParticles(line5Particles);
  
  applyForcesToBoxes(boxes);
  
  
  

    for (let i = 0; i < boundaries.length; i++) {
        boundaries[i].show();
    }
  
  //pass line1Particles array to drawLine function to draw the lines of the stave
  
//   bgGradient.show();
  drawLine(line1Particles);
  drawLine(line2Particles);
  drawLine(line3Particles);
  drawLine(line4Particles);
  drawLine(line5Particles);
  //drawLine2();
  clef();
  

}

function drawLine(particles){
  
    beginShape();
    noFill();
    stroke(50);
    strokeWeight(2);
  
  //must connnect the first particle
    curveVertex(particles[0].body.position.x, particles[0].body.position.y);

    for (let p of particles) {
        curveVertex(p.body.position.x, p.body.position.y);
    }
   curveVertex(particles[particles.length - 1].body.position.x, particles[particles.length - 1].body.position.y);

    endShape();
}



function applyForcesAndShowParticles(particles) {
  let wind = calculateWind();
  
  for (let i = 0; i < particles.length; i++) {
    let particle = particles[i];
    // Apply forces to the particle
    Body.applyForce(particle.body, particle.body.position, wind);
    
    // Show the particle
    particle.show();
  }
}

function applyForcesToBoxes(boxes) {
  let wind = calculateWind();
  
  for (let i = 0; i < boxes.length; i++) {
    let box = boxes[i];
    // Apply forces to the particle
    Body.applyForce(box.body, box.body.position, wind);
    
    // Show the particle
    //particle.show();
  }
}

function calculateWind() {
  let windX = map(noise(windXoff), 0, 1, -0.02, 0.05);
  let windY = map(noise(windYoff), 0, 1, -0.07, 0.04);
  let wind = createVector(windX, windY);
  wind.mult(customSlider.value()); // Use the slider value for wind scaling
  windXoff += 0.04;
  windYoff += 0.01;
  return wind;
}

  
function clef(){
  let pos = createVector(35, 125);
  rectMode(CENTER);
  imageMode(CENTER);
  push()
  translate(pos.x, pos.y-size/2)
  rotate(map(sin(wobble), -1, 1, -QUARTER_PI/3, QUARTER_PI/3));
  translate(0, size/2)
  image(bassclef, 0, 0);
  //rect(0, 0, size, size);
  pop()
  wobble += 0.05
  
  
  
}
  

function mousePressed() {
    boxes.push(new Box(mouseX, mouseY, random(10, 40)));
}


function keyPressed() {
  
}

function updateSliderValue(){
  
  
}
  



