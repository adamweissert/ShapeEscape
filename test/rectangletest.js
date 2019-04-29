var list = [];
var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

var randomRectangle = function() {
  this.init = function() {
    this.speed = 4;
    this.x = canvas.width - 50;
    this.y = Math.floor(Math.random() * 280) + 40;
    this.w = Math.floor(Math.random() * 200) + 50;
    this.h = Math.floor(Math.random() * 150) + 20;
    this.col = "#b5e61d";
  }
  this.move = function() {
    this.x -= this.speed;
    // restart x position to reuse rectangles
    // you can change the y value here to a new random value
    // or you can just remove with array.splice
    if (this.x < -50) this.x = canvas.width - 50;
  }

  this.draw = function(num) {
    draw.rectangles(this.x, this.y, this.w, this.h, this.col);
  }
};

function loop() {
  draw.clear();

  //player.draw();
  //player.move();

  //wall1.draw();
  //wall2.draw();

  // call the methods draw and move for each rectangle on the list
  for (var i=0; i<list.length; i++) {
    rec = list[i];
    rec.draw();
    rec.move();
  }
}

// spawn any number of new rects in a specific interval
var rectsPerSpawn = 1;
function addRects() {
  for (var i=0; i<rectsPerSpawn; i++) {
    if (list.length < 100) {
      var rec = new randomRectangle();
      list.push(rec);
      rec.init();
    }
  }
}
// every half second will spawn a new rect
var spawn = setInterval(addRects, 500);

var draw = {
  clear: function () {
    ctx.clearRect(0,0,canvas.width,canvas.height);
  },
  rectangles: function (x, y, w, h, col) {
    ctx.fillStyle = col;
    ctx.fillRect(x,y,w,h);
  }
}

var handle = setInterval(loop, 30);