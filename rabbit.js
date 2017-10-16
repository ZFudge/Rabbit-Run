document.addEventListener("keydown",keyPushed);
document.addEventListener("keyup",keyReleased);

const canvas = document.createElement('canvas');
canvas.height = 500;
canvas.width = 900;
document.body.appendChild(canvas);
let context =  canvas.getContext('2d'); 

const game = {
	speed: 15,
	active: true,
	groundlevel: 400,
	edge: {
		width: 330,
		left: 330,
		right: 570
	},
	width: 4548,
	drawBackground: function() {/*
		context.fillStyle = '#55E'; context.fillRect(0,0,canvas.width,canvas.height); context.fillStyle = '#909'; context.fillRect(0,400,canvas.width,100); */
		context.drawImage(game.img.terrain, game.img.x, game.img.y, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
		//context.drawImage(rabbit.image, rabbit.img.x, rabbit.img.y, rabbit.width, rabbit.height, rabbit.x, rabbit.y, rabbit.width, rabbit.height);
		//context.fillStyle = 'black';
		//context.fillRect(game.edge.left, 0, 1, canvas.height);
		//context.fillRect(game.edge.right, 0, 1, canvas.height);
	},
	drawGrass: function() {
		context.drawImage(game.img.grass, game.img.x, game.img.y, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
	},
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
		terrain: new Image(),
		grass: new Image()
	},
	enemies: [],
	drawEnemies: function() {
		if (game.enemies.length > 0) {
			for (let enemy in game.enemies) {
				if (game.enemies[enemy].alive) {
					context.drawImage(rabbit.image, game.enemies[enemy].img.x, game.enemies[enemy].img.y, game.enemies[enemy].width, game.enemies[enemy].height, game.enemies[enemy].x, game.enemies[enemy].y, game.enemies[enemy].width, game.enemies[enemy].height );
					(game.enemies[enemy].img.steps < 7) ? game.enemies[enemy].img.steps++ : game.enemies[enemy].img.steps = 0;
					game.enemies[enemy].img.x = game.enemies[enemy].img.steps * 45;
					//context.drawImage(game.img.terrain, game.img.x, game.img.y, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
					//ctx.drawImage(image, innerx, innery, innerWidth, innerHeight, outerx, outery, outerWidth, outerHeight);
					EnemyFuncs.adjust(game.enemies[enemy]);
					EnemyFuncs.damageCheck(game.enemies[enemy]);
					//EnemyFuncs.adjust(game.enemies[enemy]);
				} else {
					const removeEnemy = game.enemies.indexOf(game.enemies[enemy]);
						game.enemies.splice(removeEnemy,1);
				}
			}
		}
	},
	sounds: {
		theme: new Audio('audio/theme.mp3'),
		gumblasts: [
			new Audio('audio/gumblast.wav'),
			new Audio('audio/gumblast2.wav'),
			new Audio('audio/gumblast3.wav'),
			new Audio('audio/gumblast4.wav'),
			new Audio('audio/gumblast5.wav'),
			new Audio('audio/gumblast6.wav'),
			new Audio('audio/gumblast7.wav')
		],
		gumstep: 0
	}
}
game.img.terrain.src='sprites/level_one.png';
game.img.grass.src='sprites/grassoverlay_2.png';

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
		size: 3,
		colors: [
			'#00A6FF', // blue
			'#A0F', // purple
			'#04D608', // green
			'#FAE900', // yellow
			'#FA0000', // red
			'#FFA200', // orange
			'#0800FF', // dark blue
			'#F0E', // pink
		],
		fire: function() {
			(game.sounds.gumstep === 6) ? game.sounds.gumstep = 0 : game.sounds.gumstep++;
			game.sounds.gumblasts[game.sounds.gumstep].play();

			rabbit.laser.charge--;
			let laserx, lasery, laserh, laserv;

			if (rabbit.img.dir === 'left') {
				laserx = rabbit.x;
			} else {
				laserx = rabbit.x + rabbit.width;
			}
			lasery = Math.floor(rabbit.y + rabbit.height/4 + Math.random() * rabbit.height/2);

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
				v: laserv,
				color: rabbit.laser.colors[Math.floor(Math.random() * rabbit.laser.colors.length)]
			});
		},
		fire2: function() {
			rabbit.laser.charge--;
			let laserx, lasery, laserh, laserv;

			if (rabbit.img.dir === 'left') {
				laserx = rabbit.x;
			} else {
				laserx = rabbit.x + rabbit.width;
			}
			lasery = Math.floor(rabbit.y + rabbit.height/4 + Math.random() * rabbit.height/2);
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
				v: laserv,
				color: rabbit.laser.colors[Math.floor(Math.random() * rabbit.laser.colors.length)]
			});
		},
		doubleFire: function() {
			(game.sounds.gumstep === 6) ? game.sounds.gumstep = 0 : game.sounds.gumstep++;
			game.sounds.gumblasts[game.sounds.gumstep].play();
			
			rabbit.laser.charge--;
			let laserx, lasery, laserh, laserv, laserh_2, laserv_2;

			if (rabbit.img.dir === 'left') {
				laserx = rabbit.x;
			} else {
				laserx = rabbit.x + rabbit.width;
			}
			lasery = Math.floor(rabbit.y + rabbit.height/4 + Math.random() * rabbit.height/2);

			[laserh, laserv] = rabbit.laser.setSpin([laserh, laserv]);


			rabbit.laser.stash.push({
				x: laserx,
				y: lasery,
				h: laserh[0],
				v: laserv[1],
				color: rabbit.laser.colors[Math.floor(Math.random() * rabbit.laser.colors.length)]
			});

			rabbit.laser.stash.push({
				x: laserx,
				y: lasery,
				h: laserv[1],
				v: laserh[0],
				color: rabbit.laser.colors[Math.floor(Math.random() * rabbit.laser.colors.length)]
			});
		},
		setSpin: function(arr) {
			if (rabbit.img.x === 90 || rabbit.img.x === 270) {
				return [ 
					[-rabbit.laser.speed, 0], 
					[rabbit.laser.speed, 0]
				];
			} else if (rabbit.img.x === 0 || rabbit.img.x === 180) {
				return [ 
					[0, -rabbit.laser.speed], 
					[0, rabbit.laser.speed] 
				];

			} else {
				if ( ( rabbit.img.y === 140 && ( rabbit.img.x === 45 || rabbit.img.x === 225 ) ) || ( rabbit.img.y === 175 && ( rabbit.img.x === 135 || rabbit.img.x === 315 )) ) { // //
					return [  // //
						[-rabbit.laser.speed/2, rabbit.laser.speed/2], 
						[rabbit.laser.speed/2, -rabbit.laser.speed/2] 
					];
				} else if ( ( rabbit.img.y === 140 && ( rabbit.img.x === 135 || rabbit.img.x === 315) ) || ( rabbit.img.y === 175 && ( rabbit.img.x === 45 || rabbit.img.x === 225 )) ) {
					return [  // \\\\\\\\\\\\\\\\
						[rabbit.laser.speed/2, -rabbit.laser.speed/2],
						[-rabbit.laser.speed/2, rabbit.laser.speed/2]
					]
				}
			}
		},
		draw: function(x,y,s,c) {
			context.fillStyle = c;
			context.beginPath();
			context.arc(x, y, s, 0, 2 * Math.PI);
			context.fill();
		},
		adjust: function() {
			if (rabbit.laser.stash.length > 0) {
				for (let blast in rabbit.laser.stash) {
					rabbit.laser.stash[blast].x += rabbit.laser.stash[blast].h;
					rabbit.laser.stash[blast].y += rabbit.laser.stash[blast].v;


					if (EnemyFuncs.hitCheck(rabbit.laser.stash[blast], enemy1) || rabbit.laser.stash[blast].x < 0 || rabbit.laser.stash[blast].x > canvas.width || rabbit.laser.stash[blast].y < 0 || rabbit.laser.stash[blast].y > canvas.height - 100) {
						const removeBlast = rabbit.laser.stash.indexOf(rabbit.laser.stash[blast]);
						rabbit.laser.stash.splice(removeBlast,1);
					} else {
						rabbit.laser.draw(rabbit.laser.stash[blast].x, rabbit.laser.stash[blast].y, rabbit.laser.size, rabbit.laser.stash[blast].color);
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

class Enemy {
	constructor(x) {
		this.alive = true;
		this.y = 300;
		this.x = x;
		this.h = 0;
		this.v = 0;
		this.speed = 3;
		this.range = 375;
		this.height = 30;
		this.width = 45;
		this.health = 200;
		this.img = {
			steps: 0,
			x: 0,
			y: 280
		}
	}
}

const EnemyFuncs = {
	adjust: function(en) {
		if (en.alive) {
			if (rabbit.x < en.x) {
				if (en.x - rabbit.x > en.range) {
					en.h = -en.speed;
				}
			} else {
				if (rabbit.x - en.x > en.range) {
					en.h = en.speed;
				}
			}
			if (en.y + en.height < game.groundlevel) {
				en.v = en.speed;
			} else if (en.y + en.height > game.groundlevel) {
				en.v = 0;
			}

			en.x += en.h;
			en.y += en.v;
		}
	},
	hitCheck: function(ball, en) {
		console.log('hithceck')
		if (ball.x > en.x && ball.x < en.x + en.width && ball.y > en.y && ball.y < en.y + en.height) {
			en.health--;
			return true;
		}
	},
	damageCheck: function(en) {
		if (en.health <= 0) en.alive = false;
	}
}
// const playerTwo = new Player(game.playerTwoPos);
const enemy1 = new Enemy(800);
game.enemies.push(enemy1);

function gameLoop() {
	game.drawBackground();
	rabbit.adjust();
	rabbit.draw();
	game.drawEnemies();
	game.drawGrass();
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
	if (btn.keyCode === 67 && rabbit.laser.charge > 0 && rabbit.jump.active) {
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