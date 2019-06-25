var FPS = 30; //frames per second
var SHIP_SIZE = 30; // ship size in pxl
var TURN_SPEED = 360; //turn speed in degrees per second
var SHIP_THRUST = 5; //accelearation pixel per second
var FRICTION = 0.2; //friction coeffcient of space(where  0 = no friction, 1 = lots of friction!)
var ROIDS_NUM = 3;
var ROIDS_JAG = 0.4; ///jajjedness of the asteriods (0 = none , 1 many)
var ROIDS_SIZE = 100; //starting size roid in  pixel
var ROIDS_SPD = 50; //starting speef of riod px/sec
var ROIDS_VERT = 10; //avg # verticies of each asteriod

/** @type{HTMLCanavasElement}*/
var can = document.getElementById("gameCanvas");
//context
var ctx = can.getContext("2d");

var ship = {
  x: can.width / 2, //x cordinate in the middle of the space!
  y: can.height / 2, // y cordinates in the middle of the space screen!
  r: SHIP_SIZE / 2, //ship raduis!
  a: (90 / 180) * Math.PI, // convert to raidians
  rot: 0, //rotation
  thrusting: false,
  shipStopping: false,
  thrust: {
    x: 0,
    y: 0
  }
};

// set up asteriod
var roids;
createAsteriodBelt();

//set up event listner
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

function createAsteriodBelt() {
  roids = [];

  var x, y;
  for (var i = 0; i < ROIDS_NUM; i++) {
    do {
      x = Math.floor(Math.random() * can.width);
      y = Math.floor(Math.random() * can.height);
    } while (distBetweenPoints(ship.x, ship.y, x, y) < ROIDS_SIZE * 2 + ship.r);
    roids.push(newAsteroid(x, y));
  }
}

function distBetweenPoints(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

//gameloop
setInterval(update, 1000 / FPS);

function keyDown(/** @type {keyboardEvent} */ ev) {
  switch (ev.keyCode) {
    case 37: //rotate ship left
      ship.rot = ((TURN_SPEED / 180) * Math.PI) / FPS;
      break;

    case 38: //up arrow move forward
      ship.thrusting = true;
      break;

    case 39: //rotate ship right
      ship.rot = ((-TURN_SPEED / 180) * Math.PI) / FPS;
      break;

    case 40:
      ship.shipStopping = true;
      break;
  }
}

function keyUp(/** @type {keyboardEvent} */ ev) {
  switch (ev.keyCode) {
    case 37: //stop rotate ship left
      ship.rot = 0;
      break;

    case 38: // stop up arrow move forward
      ship.thrusting = false;
      break;

    case 39: // stop rotate ship right
      ship.rot = 0;
      break;

    case 40:
      ship.shipStopping = false;
      break;

    case 77:
      SHIP_THRUST += 10;
      break;
  }
}

function newAsteroid(x, y) {
  var roid = {
    a: Math.random() * Math.PI * 2, // in radians
    r: ROIDS_SIZE / 2,
    vert: Math.floor(Math.random() * (ROIDS_VERT + 1) + ROIDS_VERT / 2),
    x: x,
    y: y,
    xv: ((Math.random() * ROIDS_SPD) / FPS) * (Math.random() < 0.5 ? 1 : -1),
    yv: ((Math.random() * ROIDS_SPD) / FPS) * (Math.random() < 0.5 ? 1 : -1),
    offs: []
  };
  //create the offset array
  for (var i = 0; i < roid.vert; i++) {
    roid.offs.push(Math.random() * ROIDS_JAG * 2 + 1 - ROIDS_JAG);
  }

  return roid;
}

function update() {
  //draw the background(cspace)
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, can.width, can.height);

  //Check if ship is stopping
  if (ship.shipStopping) {
    ship.thrust.y = 0;
    ship.thrust.x = 0;
  }

  //thrust the ship
  if (ship.thrusting) {
    ship.thrust.x += (SHIP_THRUST * Math.cos(ship.a)) / FPS;
    ship.thrust.y -= (SHIP_THRUST * Math.sin(ship.a)) / FPS;

    //flame graphic
    ctx.fillStyle = "red";
    ctx.strokeStyle = "yellow";
    ctx.lineWidth = SHIP_SIZE / 10;
    ctx.beginPath();
    ctx.moveTo(
      // rear left
      ship.x - ship.r * ((2 / 3) * Math.cos(ship.a) + 0.5 * Math.sin(ship.a)),
      ship.y + ship.r * ((2 / 3) * Math.sin(ship.a) - 0.5 * Math.cos(ship.a))
    );
    ctx.lineTo(
      // rear center ...behinf the ship
      ship.x - ship.r * ((8 / 3) * Math.cos(ship.a)),
      ship.y + ship.r * ((8 / 3) * Math.sin(ship.a))
    );
    ctx.lineTo(
      // rear right
      ship.x - ship.r * ((2 / 3) * Math.cos(ship.a) - 0.5 * Math.sin(ship.a)),
      ship.y + ship.r * ((2 / 3) * Math.sin(ship.a) + 0.5 * Math.cos(ship.a))
    );
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else {
    ship.thrust.x -= (FRICTION * ship.thrust.x) / FPS;
    ship.thrust.y -= (FRICTION * ship.thrust.x) / FPS;
  }

  //ship graphic
  ctx.strokeStyle = "white";
  ctx.lineWidth = SHIP_SIZE / 20;
  ctx.beginPath();
  ctx.moveTo(
    // nose of the ship
    ship.x + (4 / 3) * ship.r * Math.cos(ship.a),
    ship.y - (4 / 3) * ship.r * Math.sin(ship.a)
  );
  ctx.lineTo(
    // rear left
    ship.x - ship.r * ((2 / 3) * Math.cos(ship.a) + Math.sin(ship.a)),
    ship.y + ship.r * ((2 / 3) * Math.sin(ship.a) - Math.cos(ship.a))
  );
  ctx.lineTo(
    // rear right
    ship.x - ship.r * ((2 / 3) * Math.cos(ship.a) - Math.sin(ship.a)),
    ship.y + ship.r * ((2 / 3) * Math.sin(ship.a) + Math.cos(ship.a))
  );
  ctx.closePath();
  ctx.stroke();

  //draw assteriods
  ctx.strokeStyle = "slategrey";
  ctx.lineWidth = SHIP_SIZE / 20;

  var a, r, x, y, vert, offs;
  for (var i = 0; i < roids.length; i++) {
    // get the asteroid properties
    x = roids[i].x;
    y = roids[i].y;
    a = roids[i].a;
    r = roids[i].r;
    vert = roids[i].vert;
    offs = roids[i].offs;

    // draw the path
    ctx.beginPath();
    ctx.moveTo(x + r * offs[0] * Math.cos(a), y + r * offs[0] * Math.sin(a));

    // draw the polygon
    for (var j = 1; j < vert; j++) {
      ctx.lineTo(
        x + r * offs[j] * Math.cos(a + (j * Math.PI * 2) / vert),
        y + r * offs[j] * Math.sin(a + (j * Math.PI * 2) / vert)
      );
    }
    ctx.closePath();
    ctx.stroke();

    //move the asteriods
    roids[i].x += roids[i].xv;
    roids[i].y += roids[i].yv;

    //handle the edge of the screen
    if (roids[i].x < 0 - roids[i].r) {
      roids[i].x = can.width + roids[i].r;
    } else if (roids[i].x > can.width + roids[i].r) {
      roids[i].x = 0 - roids[i].r;
    }

    if (roids[i].y < 0 - roids[i].r) {
      roids[i].y = can.height + roids[i].r;
    } else if (roids[i].y > can.height + roids[i].r) {
      roids[i].y = 0 - roids[i].r;
    }
  }
  //move the ship
  ship.x += ship.thrust.x;
  ship.y += ship.thrust.y;

  //rotate ship
  ship.a += ship.rot;

  //handle edge of the screen
  if (ship.x < 0 - ship.r) {
    ship.x = can.width + ship.r;
  } else if (ship.x > can.width + ship.r) {
    ship.x = 0 - ship.r;
  }

  if (ship.y < 0 - ship.r) {
    ship.y = can.height + ship.r;
  } else if (ship.y > can.height + ship.r) {
    ship.y = 0 - ship.r;
  }

  //center dot
  ctx.fillStyle = "red";
  //ctx.fillRect(ship.x - 1, ship.y - 1, 2, 2);
}
