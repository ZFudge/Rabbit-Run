document.addEventListener("keydown",keyPushed);
document.addEventListener("keyup",keyReleased);

const canvas = document.createElement('canvas');
canvas.height = 500;
canvas.width = 600;
document.body.appendChild(canvas);
let context =  canvas.getContext('2d'); 

const game = {
	drawBackground: function() {
		context.fillStyle = '#55E';
		context.fillRect(0,0,canvas.width,canvas.height);
		context.fillStyle = '#909';
		context.fillRect(0,400,canvas.width,100);
	},
	speed: 20,
	active: true,
	pauseandresume: function() {
		game.active = !game.active;
		if (game.active) {
			loop = setInterval(gameLoop, game.speed)
		} else {
			clearInterval(loop);
		}
	}
}

const rabbit = {
	x: 0,
	y: 50,
	width: 45,
	height: 35,
	h: 0,
	v: 0,
	steps: 0,
	speed: 3,
	fallspeed: 2,
	image: new Image(),
	img: {
		dir: 'right',
		x: 0,
		y: 140,
		z: 0
	},
	adjust: function() {
		rabbit.x += rabbit.h;
		rabbit.y += rabbit.v;

		if (rabbit.y >= 400 - rabbit.height + 7) {
			rabbit.y = 400 - rabbit.height + 7;
			rabbit.v = 0;
		} else if (!rabbit.jump.active) {
			(rabbit.fallspeed < 5) ? rabbit.fallspeed *= 1.1 : rabbit.fallspeed = 5;
			rabbit.v = rabbit.fallspeed;
		}
		(rabbit.jump.active) ? rabbit.jump.adjust() : rabbit.restCheck();
	},
	jump: {
		height: 50,
		active: false,
		begin: null,
		end: null,
		rising: true,
		up: function() {
			rabbit.jump.rising = true;
			rabbit.v = -rabbit.fallspeed;
			rabbit.jump.begin = rabbit.y;
			rabbit.jump.end = rabbit.y - rabbit.jump.height;
			rabbit.jump.active = true;
			(rabbit.img.dir === 'right') ? rabbit.img.y = 140 : rabbit.img.y = 175; 
		},
		adjust: function() {
			console.log('jumpin');
			if (rabbit.jump.rising) {
				if (Math.abs(rabbit.y - rabbit.jump.end) < 10) {
					if (rabbit.y > rabbit.jump.end) {
						rabbit.v -= 0.3 
					} else {
						if (rabbit.v < rabbit.fallspeed) rabbit.v += 0.3;
						rabbit.jump.rising = false;
					}
				}
			} else {
				if (Math.abs(rabbit.jump.begin - rabbit.y) <= 0.3) {
					rabbit.v = 0;
					rabbit.jump.active = false;
				} else {
					if (rabbit.v < rabbit.fallspeed) rabbit.v += 0.3;
				}
			}
		}
	},
	restCheck: function() {
		if (rabbit.y === 372 && rabbit.img.y > 105) {
			if (rabbit.h === 0) {
				(rabbit.img.dir === 'right') ? rabbit.img.y = 70 : rabbit.img.y = 105;
			} else {
				(rabbit.img.dir === 'right') ? rabbit.img.y = 0 : rabbit.img.y = 35;
			}
		}
	}
}
rabbit.image.src = 'rabbit_3.png';
rabbit.draw = function() {
	context.drawImage(rabbit.image, rabbit.img.x, rabbit.img.y, rabbit.width, rabbit.height, rabbit.x, rabbit.y, rabbit.width, rabbit.height);
	rabbit.cycleAcrossImage();
	//ctx.drawImage(image, innerx, innery, innerWidth, innerHeight, outerx, outery, outerWidth, outerHeight);
}
rabbit.cycleAcrossImage = function() {
	rabbit.steps++;
	if (rabbit.steps % 4 === 0) {
		rabbit.steps = 0;
		(rabbit.img.z === 7) ? rabbit.img.z = 0 : rabbit.img.z++;
		rabbit.img.x = rabbit.img.z * rabbit.width;
	}
}

function gameLoop() {
	game.drawBackground();
	rabbit.adjust();
	rabbit.draw();
}


function keyPushed(btn) {
	if (btn.keyCode === 32 && !rabbit.jump.active) rabbit.jump.up();
	if (btn.keyCode === 37) {
		if (rabbit.y < 372) {
			rabbit.img.y = 175;
		} else {
			rabbit.img.y = 35;
		}
		rabbit.h = -rabbit.speed; 
		rabbit.img.dir = 'left';
	}
	if (btn.keyCode === 39) {
		if (rabbit.y < 372) {
			rabbit.img.y = 145;
		} else {
			rabbit.img.y = 0; 
		}
		rabbit.img.dir = 'right';
		rabbit.h = rabbit.speed;
	}
	if (btn.keyCode === 38 && !rabbit.jump.active) rabbit.jump.up();
	if (btn.keyCode === 40) rabbit.v = rabbit.speed;
	if (btn.keyCode === 81) game.pauseandresume();
}

function keyReleased(btn) {
	if (btn.keyCode === 37) {
		rabbit.h = 0;
		if (rabbit.v === 0) {
			rabbit.img.y = 105;
		} else {
			if (rabbit.img.dir == 'right') {

			}
		}
	}
	if (btn.keyCode === 39) {
		rabbit.h = 0;
		if (rabbit.v === 0) rabbit.img.y = 70;
	}
	if (btn.keyCode === 40) rabbit.v = 0;
}

let loop = setInterval(gameLoop,game.speed);