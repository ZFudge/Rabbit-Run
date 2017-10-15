document.addEventListener("keydown",keyPushed);
document.addEventListener("keyup",keyReleased);

const canvas = document.createElement('canvas');
canvas.height = 500;
canvas.width = 900;
document.body.appendChild(canvas);
let context =  canvas.getContext('2d'); 

const game = {
	drawBackground: function() {/*
		context.fillStyle = '#55E'; context.fillRect(0,0,canvas.width,canvas.height); context.fillStyle = '#909'; context.fillRect(0,400,canvas.width,100); */
		context.drawImage(game.img.terrain, game.img.x, game.img.y, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
		//context.drawImage(rabbit.image, rabbit.img.x, rabbit.img.y, rabbit.width, rabbit.height, rabbit.x, rabbit.y, rabbit.width, rabbit.height);
		//ctx.drawImage(image, innerx, innery, innerWidth, innerHeight, outerx, outery, outerWidth, outerHeight);
		context.fillStyle = 'black';
		context.fillRect(game.edge.left, 0, 1, canvas.height);
		context.fillRect(game.edge.right, 0, 1, canvas.height);
	},
	speed: 20,
	active: true,
	edge: {
		width: 330,
		left: 330,
		right: 570
	},
	width: 4548,
	pauseandresume: function() {
		game.active = !game.active;
		if (game.active) {
			loop = setInterval(gameLoop, game.speed)
		} else {
			clearInterval(loop);
		}
	},
	adjust: function() {

	},
	scrollAdjust: function() {
		if (rabbit.x < game.edge.left) {  // LEFT 
			if (game.img.x > 0) {
				if (rabbit.h < 0) {
					game.img.x += rabbit.h;
				} else {
					rabbit.x += rabbit.h;
				}
			} else if (rabbit.x > 0) {
				if (rabbit.x > 5) {
					rabbit.x += rabbit.h;
				} else {
					if (rabbit.h > 0) rabbit.x += rabbit.h;
				}
			}
		} else if (rabbit.x + rabbit.width < game.edge.right) { // MIDDLE
			rabbit.x += rabbit.h;
		} else if (game.img.x + canvas.width < game.width) { // RIGHT !!!!!!!!!!!
			if (rabbit.h > 0) {
				game.img.x += rabbit.h;
			} else if (rabbit.h < 0) {
				rabbit.x += rabbit.h;
			}
		} else {
			rabbit.x += rabbit.h;
		}
		rabbit.y += rabbit.v;
	},
	img: {
		x: 0,
		y: 0,
		height: canvas.height,
		terrain: new Image()
	}
}
game.img.terrain.src='sprites/level_one.png';

const rabbit = {
	alive: true,
	x: game.edge.left,
	y: 50,
	h: 0,
	v: 0,
	width: 45,
	height: 35,
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
		game.scrollAdjust();

		if (rabbit.y >= 400 - rabbit.height + 7) {
			rabbit.y = 400 - rabbit.height + 7;
			rabbit.v = 0;
		} else if (!rabbit.jump.active) {
			(rabbit.fallspeed < 5) ? rabbit.fallspeed *= 1.1 : rabbit.fallspeed = 5;
			rabbit.v = rabbit.fallspeed;
		}
		(rabbit.jump.active) ? rabbit.jump.adjust() : rabbit.restCheck();
		rabbit.laser.adjust();
	},
	jump: {
		active: false,
		height: 100,
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
	},
	health: {
		level: 20
	},
	laser: {
		charge: 500,
		damage: 5,
		spin: false,
		stash: [],
		speed: 10,
		size: 2,
		fire: function() {
			rabbit.laser.charge--;
			let laserx, lasery, laserh, laserv;

			if (rabbit.img.dir === 'left') {
				laserx = rabbit.x;
			} else {
				laserx = rabbit.x + rabbit.width;
			}
			lasery = rabbit.y + rabbit.height /2;

			if (rabbit.jump.active && rabbit.laser.spin) {
				[laserh, laserv] = rabbit.laser.setSpin([laserh, laserv])	
			} else {
				(rabbit.img.dir === 'right') ? laserh = rabbit.laser.speed : laserh = -rabbit.laser.speed;
				laserv = 0;
			}
			rabbit.laser.stash.push({
				x:laserx,
				y:lasery,
				h: laserh,
				v: laserv
			});
		},
		doubleFire: function() {
			console.log(' double FIRE')
			rabbit.laser.charge--;
			let laserx, lasery, laserh, laserv, laserh_2, laserv_2;

			if (rabbit.img.dir === 'left') {
				laserx = rabbit.x;
			} else {
				laserx = rabbit.x + rabbit.width;
			}
			lasery = rabbit.y + rabbit.height /2;

			if (rabbit.jump.active && rabbit.laser.spin) {
				[laserh, laserv] = rabbit.laser.setSpin([laserh, laserv])	
			} else {
				(rabbit.img.dir === 'right') ? laserh = rabbit.laser.speed : laserh = -rabbit.laser.speed;
				laserv = 0;
			}
			rabbit.laser.stash.push({
				x:laserx,
				y:lasery,
				h: laserh,
				v: laserv
			});

			(laserh < 0) ? laserh_2 = Math.abs(laserh) : (laserh > 0) ? laserh_2 = laserh * -2 : null;
			(laserv < 0) ? laserv_2 = Math.abs(laserv) : (laserv > 0) ? laserv_2 = laserv * -2 : null;
			console.log(laserh + ' ' + laserh_2);
			console.log(laserv + ' ' + laserv_2);

			rabbit.laser.stash.push({
				x:laserx,
				y:lasery,
				h: laserh_2,
				v: laserv_2
			});
		},
		setSpin: function(arr) {
			if (rabbit.img.x === 90 || rabbit.img.x === 270) {
				if (rabbit.img.x === 90 && rabbit.img.y === 140 || rabbit.img.x === 270 && rabbit.img.y === 175) return [-rabbit.laser.speed, 0];
				if (rabbit.img.x === 270 && rabbit.img.y === 140 || rabbit.img.x === 90 && rabbit.img.y === 175) return [rabbit.laser.speed, 0];
			} else if (rabbit.img.x === 0 || rabbit.img.x === 180) {
				if (rabbit.img.x === 0 && rabbit.img.y === 140 || rabbit.img.x === 180 && rabbit.img.y === 175) return [0, -rabbit.laser.speed];
				if (rabbit.img.x === 180 && rabbit.img.y === 140 || rabbit.img.x === 0 && rabbit.img.y === 175) return [0, rabbit.laser.speed];
			} else {
				if (rabbit.img.x === 45 && rabbit.img.y === 140 || rabbit.img.x === 315 && rabbit.img.y === 175) return [-rabbit.laser.speed/2, rabbit.laser.speed/2];
				if (rabbit.img.x === 135 && rabbit.img.y === 140 || rabbit.img.x === 225 && rabbit.img.y === 175) return [-rabbit.laser.speed/2, -rabbit.laser.speed/2];
				if (rabbit.img.x === 225 && rabbit.img.y === 140 || rabbit.img.x === 135 && rabbit.img.y === 175) return [rabbit.laser.speed/2, -rabbit.laser.speed/2];
				if (rabbit.img.x === 315 && rabbit.img.y === 140 || rabbit.img.x === 45 && rabbit.img.y === 175) return [rabbit.laser.speed/2, rabbit.laser.speed/2];
			}
		},
		draw: function(x,y,s) {
			context.fillStyle = 'red';
			context.beginPath();
			context.arc(x, y, s, 0, 2 * Math.PI);
			context.fill();
		},
		adjust: function() {
			if (rabbit.laser.stash.length > 0) {
				for (let blast in rabbit.laser.stash) {
					rabbit.laser.stash[blast].x += rabbit.laser.stash[blast].h;
					rabbit.laser.stash[blast].y += rabbit.laser.stash[blast].v;

					if (rabbit.laser.stash[blast].x < 0 || rabbit.laser.stash[blast].x > canvas.width || rabbit.laser.stash[blast].y < 0 || rabbit.laser.stash[blast].y > canvas.height - 100) {
						const removeBlast = rabbit.laser.stash.indexOf(rabbit.laser.stash[blast]);
						rabbit.laser.stash.splice(removeBlast,1);
					} else {
						rabbit.laser.draw(rabbit.laser.stash[blast].x, rabbit.laser.stash[blast].y, rabbit.laser.size);
					}
				}
			}
		}
	}
}
rabbit.image.src = 'sprites/rabbit_3.png';
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
	if (btn.keyCode === 67 && rabbit.laser.charge > 0) {
		if (!rabbit.laser.spin) rabbit.laser.spin= true;
		rabbit.laser.doubleFire();
	}
	if (btn.keyCode === 70 && rabbit.laser.charge > 0) rabbit.laser.fire();
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
	if (btn.keyCode === 67) rabbit.laser.spin = false;
}

let loop = setInterval(gameLoop,game.speed);