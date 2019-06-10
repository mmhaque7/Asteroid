const FPS = 30;//frames per second
const SHIP_SIZE = 30; // ship size in pxl
const TURN_SPEED = 360; //turn speed in degrees per second
const SHIP_THRUST = 5; //accelearation pixel per second
const FRICTION = 0.3; //friction coeffcient of space(where  0 = no friction, 1 = lots of friction!)
const ROIDS_NUM = 4;
const ROIDS_JAG = 0.4 ///jajjedness of the asteriods (0 = none , 1 many)
const ROIDS_SIZE = 100;//starting size roid in  pixel
const ROIDS_SPD = 50;//starting speef of riod px/sec 
const ROIDS_VERT = 10; //avg # verticies of each asteriod
const SHOW_BOUNDING = false;//show or hide collsion
const SHOW_CENTRE_DOT = false;//show or hide the centre dot on spaceship
const SHIP_EXPLODE_DUR = 0.3;//duration of ship explosion
const SHIP_INV_DUr = 3 //ship invisibility in seconds
const SHIP_BLINK_DUR = 0.1//duration of ship's blink during invisibility in seconds




/** @type{HTMLCanavasElement}*/
var can = document.getElementById("gameCanvas");
//context
var ctx = can.getContext("2d");

var ship = newShip();

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

function explodeShip() {
    ship.explodeTime = Math.ceil(SHIP_EXPLODE_DUR * FPS);
}

//gameloop
setInterval(update, 1000 / FPS);



function keyDown(/** @type {keyboardEvent} */ev) {
    switch (ev.keyCode) {
        case 37://rotate ship left
            ship.rot = TURN_SPEED / 180 * Math.PI / FPS;
            break;

        case 38://up arrow move forward
            ship.thrusting = true;
            break;

        case 39://rotate ship right
            ship.rot = -TURN_SPEED / 180 * Math.PI / FPS;

            break;
    }
}


function keyUp(/** @type {keyboardEvent} */ ev) {
    switch (ev.keyCode) {
        case 37://stop rotate ship left
            ship.rot = 0;

            break;

        case 38:// stop up arrow move forward
            ship.thrusting = false;
            break;

        case 39:// stop rotate ship right
            ship.rot = 0;

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
        xv: Math.random() * ROIDS_SPD / FPS * (Math.random() < 0.5 ? 1 : -1),
        yv: Math.random() * ROIDS_SPD / FPS * (Math.random() < 0.5 ? 1 : -1),
        offs: []
    };
    //create the offset array
    for (var i = 0; i < roid.vert; i++) {
        roid.offs.push(Math.random() * ROIDS_JAG * 2 + 1 - ROIDS_JAG);
    }

    return roid;
}

function newShip() {
    return {
        x: can.width / 2, //x cordinate in the middle of the space!
        y: can.height / 2, // y cordinates in the middle of the space screen!
        r: SHIP_SIZE / 2,//ship raduis!
        a: 90 / 180 * Math.PI, // convert to raidians
        blinkNum: Math.ceil(SHIP_INV_DUr / SHIP_BLINK_DUR),
        blinkTime: Math.ceil(SHIP_BLINK_DUR * FPS),
        explodeTime: 0, //explodetime
        rot: 0, //rotation
        thrusting: false,
        thrust: {
            x: 0,
            y: 0
        }
    }
}

function update() {
    var blinkOn = ship.blinkNum % 2 == 0;
    var exploding = ship.explodeTime > 0;

    //draw the background(cspace)
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, can.width, can.height);

    //thrust the ship
    if (ship.thrusting) {
        ship.thrust.x += SHIP_THRUST * Math.cos(ship.a) / FPS;
        ship.thrust.y -= SHIP_THRUST * Math.sin(ship.a) / FPS;



        //flame graphic
        if (!exploding && blinkOn ) {
            ctx.fillStyle = "red";
            ctx.strokeStyle = "yellow";
            ctx.lineWidth = SHIP_SIZE / 10;
            ctx.beginPath();
            ctx.moveTo( // rear left
                ship.x - ship.r * (2 / 3 * Math.cos(ship.a) + 0.5 * Math.sin(ship.a)),
                ship.y + ship.r * (2 / 3 * Math.sin(ship.a) - 0.5 * Math.cos(ship.a))
            );
            ctx.lineTo( // rear center ...behinf the ship
                ship.x - ship.r * (8 / 3 * Math.cos(ship.a)),
                ship.y + ship.r * (8 / 3 * Math.sin(ship.a))
            );
            ctx.lineTo( // rear right
                ship.x - ship.r * (2 / 3 * Math.cos(ship.a) - 0.5 * Math.sin(ship.a)),
                ship.y + ship.r * (2 / 3 * Math.sin(ship.a) + 0.5 * Math.cos(ship.a))
            );
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }
    } else {
        ship.thrust.x -= FRICTION * ship.thrust.x / FPS;
        ship.thrust.y -= FRICTION * ship.thrust.x / FPS;

    }


    //ship graphic
    if (!exploding) {
        if (blinkOn) {
            ctx.strokeStyle = "white";
            ctx.lineWidth = SHIP_SIZE / 20;
            ctx.beginPath();
            ctx.moveTo( // nose of the ship
                ship.x + 4 / 3 * ship.r * Math.cos(ship.a),
                ship.y - 4 / 3 * ship.r * Math.sin(ship.a)
            );
            ctx.lineTo( // rear left
                ship.x - ship.r * (2 / 3 * Math.cos(ship.a) + Math.sin(ship.a)),
                ship.y + ship.r * (2 / 3 * Math.sin(ship.a) - Math.cos(ship.a))
            );
            ctx.lineTo( // rear right
                ship.x - ship.r * (2 / 3 * Math.cos(ship.a) - Math.sin(ship.a)),
                ship.y + ship.r * (2 / 3 * Math.sin(ship.a) + Math.cos(ship.a))
            );
            ctx.closePath();
            ctx.stroke()
        }
        //handle blinking
        if (ship.blinkNum > 0) {
            //reduce blink time
            ship.blinkTime--;

            //reduce the blink num
            if (ship.blinkTime == 0) {
                ship.blinkTime = Math.ceil(SHIP_BLINK_DUR * FPS);
                ship.blinkNum--;
            }
        }
    } else {
        //draw explosion
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(ship.x, ship.y, ship.r * 1.7, 0, Math.PI * 2, false);
        ctx.fill();

        ctx.fillStyle = "darkred";
        ctx.beginPath();
        ctx.arc(ship.x, ship.y, ship.r * 1.4, 0, Math.PI * 2, false);
        ctx.fill()

        ctx.fillStyle = "orange";
        ctx.beginPath();
        ctx.arc(ship.x, ship.y, ship.r * 1.1, 0, Math.PI * 2, false);
        ctx.fill();

        ctx.fillStyle = "yellow";
        ctx.beginPath();
        ctx.arc(ship.x, ship.y, ship.r * 0.8, 0, Math.PI * 2, false);
        ctx.fill();

        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(ship.x, ship.y, ship.r * 0.5, 0, Math.PI * 2, false);
        ctx.fill();

    }

    //collision circle of the ship.
    if (SHOW_BOUNDING) {
        ctx.strokeStyle = "lime";
        ctx.beginPath();
        ctx.arc(ship.x, ship.y, ship.r, 0, Math.PI * 2, false);
        ctx.stroke();

    }

    //draw assteriods
    var a, r, x, y, vert, offs;
    for (var i = 0; i < roids.length; i++) {
        ctx.strokeStyle = "slategrey";
        ctx.lineWidth = SHIP_SIZE / 20;
        // get the asteroid properties
        x = roids[i].x;
        y = roids[i].y;
        a = roids[i].a;
        r = roids[i].r;
        vert = roids[i].vert;
        offs = roids[i].offs;

        // draw the path
        ctx.beginPath();
        ctx.moveTo(
            x + r * offs[0] * Math.cos(a),
            y + r * offs[0] * Math.sin(a)
        );

        // draw the polygon
        for (var j = 1; j < vert; j++) {
            ctx.lineTo(
                x + r * offs[j] * Math.cos(a + j * Math.PI * 2 / vert),
                y + r * offs[j] * Math.sin(a + j * Math.PI * 2 / vert)
            );
        }
        ctx.closePath();
        ctx.stroke();

        //collision detection for asteriod
        if (SHOW_BOUNDING) {
            ctx.strokeStyle = "lime";
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2, false);
            ctx.stroke();

        }


    }
    if (!exploding) {
        //move the ship
        ship.x += ship.thrust.x;
        ship.y += ship.thrust.y;

        //check for asteriod collision

        for (var i = 0; i < roids.length; i++) {
            if (ship.blinkNum == 0) {
                if (distBetweenPoints(ship.x, ship.y, roids[i].x, roids[i].y) < ship.r + roids[i].r) {
                    explodeShip();
                }
            }
        }
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
    } else {
        ship.explodeTime--;
        if (ship.explodeTime == 0) {
            ship = newShip();
        }
    }
    //move the asteriods 
    for (var i = 0; i < roids.length; i++) {

        roids[i].x += roids[i].xv;
        roids[i].y += roids[i].yv;


        //handle the edge of the screen
        if (roids[i].x < 0 - roids[i].r) {
            roids[i].x = can.width + roids[i].r;
        } else if (roids[i].x > can.width + roids[i].r) {
            roids[i].x = 0 - roids[i].r
        }

        if (roids[i].y < 0 - roids[i].r) {
            roids[i].y = can.height + roids[i].r;
        } else if (roids[i].y > can.height + roids[i].r) {
            roids[i].y = 0 - roids[i].r
        }

    }

    //center dot
    if (SHOW_CENTRE_DOT) {
        ctx.fillStyle = "red";
        //ctx.fillRect(ship.x - 1, ship.y - 1, 2, 2);
    }
}

