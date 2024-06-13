let firstShader;

function preload() {
  firstShader = loadShader("shader.vert", "shader.frag");
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  pixelDensity(1);
  noStroke();
}

function draw() {
  shader(firstShader);

  firstShader.setUniform("u_resolution", [width, height]);
  firstShader.setUniform("u_time", frameCount * 0.01);
  // firstShader.setUniform("u_mouse", map(mouseX, 0, width, 0, 20));

  rect(0, 0, width, height);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
