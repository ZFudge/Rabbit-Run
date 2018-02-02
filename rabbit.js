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
					context.drawImage(rabbit.image, game.enemies[enemy].img.x, game.enemies[enemy].img.y, game.enemies[enemy].width, 30, game.enemies[enemy].x, game.enemies[enemy].y, game.enemies[enemy].width, game.enemies[enemy].height );
					(game.enemies[enemy].img.steps < 7) ? game.enemies[enemy].img.steps++ : game.enemies[enemy].img.steps = 0;
					game.enemies[enemy].img.x = game.enemies[enemy].img.steps * 45;
					//context.drawImage(game.img.terrain, game.img.x, game.img.y, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
					//ctx.drawImage(image, innerx, innery, innerWidth, innerHeight, outerx, outery, outerWidth, outerHeight);
					game.enemies[enemy].adjust();
					game.enemies[enemy].beam.adjust(game.enemies[enemy]);
					game.enemies[enemy].damageCheck();
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
	earlevel: 372,
	steps: 0,
	speed: 3,
	jumpSpeed: 5,
	image: new Image(),
	img: {
		dir: 'right',
		x: 0,
		y: 140,
		z: 0
	},
	health: {
		level: 200
	},
	adjust: function() {
		rabbit.jump.adjust()
		rabbit.runningOrRestingAdjust();
		
		rabbit.verticalAdjust();

		rabbit.gum.adjust();
	},
	verticalAdjust:function() {
		if (rabbit.y > rabbit.earlevel) {
			rabbit.y = rabbit.earlevel;
			rabbit.jump.units = rabbit.jump.height;
			rabbit.v = 0;
		} else if (!rabbit.jump.active) {
			(rabbit.v < 5) ? rabbit.v *= 1.1 : (rabbit.v > 0) ? rabbit.v = 5 : null;
			rabbit.v = rabbit.jumpSpeed;
		}
	},
	jump: {
		active: false,
		height: 35,
		up: function() {
			rabbit.jump.active = true;
			rabbit.jump.units = rabbit.jump.height;
			rabbit.v = -rabbit.jumpSpeed;
			(rabbit.img.dir === 'right') ? rabbit.img.y = 140 : rabbit.img.y = 175; 
			//rabbit.jump.rising = true; //rabbit.jump.be gin = rabbit.y //rabbit.jump.en d = rabbit.y - rabbit.jump.height;
		},
		adjust: function() {
			if (rabbit.jump.active) {
				rabbit.jump.units--;
				if (rabbit.jump.units < 10) {
					if (rabbit.jump.units <=0) {
						if (rabbit.v < rabbit.jumpSpeed) rabbit.v += 0.3;
						rabbit.jump.active = false;
					} else {
						rabbit.v *= 0.93;
					}
				} 
			} else {
				if (rabbit.jump.units <= 0 && rabbit.jump.active) {
					rabbit.v = 0;
					rabbit.jump.active = false;
				} else {
					if (rabbit.v < rabbit.jumpSpeed) rabbit.v *= 1.07;
				}
			}
		}
	},
	runningOrRestingAdjust: function() {
		if (rabbit.y === rabbit.earlevel && (rabbit.img.y > 105 || rabbit.img.y < 70)) {
			if (rabbit.h === 0) {
				(rabbit.img.dir === 'right') ? rabbit.img.y = 70 : rabbit.img.y = 105;
			} else {
				(rabbit.img.dir === 'right') ? rabbit.img.y = 0 : rabbit.img.y = 35;
			}
		}
	},
	cycleAcrossImage: function() {
		rabbit.steps++;
		if (rabbit.steps % 4 === 0) {
			rabbit.steps = 0;
			(rabbit.img.z === 7) ? rabbit.img.z = 0 : rabbit.img.z++;
			rabbit.img.x = rabbit.img.z * rabbit.width;
		}
	},
	gum: {
		charge: 2000,
		damage: 5,
		spin: false,
		stash: [],
		speed: 10,
		size: 3,
		colors: ['#04D608', '#FAE900', '#FA0000', '#FFA200', '#0800FF', '#F0E'],
		fire: function() {
			(game.sounds.gumstep === 6) ? game.sounds.gumstep = 0 : game.sounds.gumstep++;
			game.sounds.gumblasts[game.sounds.gumstep].play();

			rabbit.gum.charge--;
			let gumx, gumy, gumh, gumv;

			if (rabbit.img.dir === 'left') {
				gumx = rabbit.x;
			} else {
				gumx = rabbit.x + rabbit.width;
			}
			gumy = Math.floor(rabbit.y + rabbit.height/4 + Math.random() * rabbit.height/2);

			if (rabbit.jump.active && rabbit.gum.spin) {
				[gumh, gumv] = rabbit.gum.setSpin([gumh, gumv])	
			} else {
				(rabbit.img.dir === 'right') ? gumh = rabbit.gum.speed : gumh = -rabbit.gum.speed;
				gumv = 0;
			}
			rabbit.gum.stash.push({
				x:gumx,
				y:gumy,
				h: gumh,
				v: gumv,
				color: rabbit.gum.colors[Math.floor(Math.random() * rabbit.gum.colors.length)]
			});
		},
		doubleFire: function() {
			(game.sounds.gumstep === 6) ? game.sounds.gumstep = 0 : game.sounds.gumstep++;
			game.sounds.gumblasts[game.sounds.gumstep].play();
			
			rabbit.gum.charge--;
			let gumx, gumy, gumh, gumv, gumh_2, gumv_2;

			if (rabbit.img.dir === 'left') {
				gumx = rabbit.x;
			} else {
				gumx = rabbit.x + rabbit.width;
			}
			gumy = Math.floor(rabbit.y + rabbit.height/4 + Math.random() * rabbit.height/2);

			[gumh, gumv] = rabbit.gum.setSpin();

			rabbit.gum.stash.push({
				x: gumx,
				y: gumy,
				h: gumh[0],
				v: gumv[1],
				color: rabbit.gum.colors[Math.floor(Math.random() * rabbit.gum.colors.length)]
			});

			rabbit.gum.stash.push({
				x: gumx,
				y: gumy,
				h: gumv[1],
				v: gumh[0],
				color: rabbit.gum.colors[Math.floor(Math.random() * rabbit.gum.colors.length)]
			});
		},
		setSpin: function() {
			const random = (Math.random() - 0.5) / 3;

			if (rabbit.img.x === 90 || rabbit.img.x === 270) {
				return [ 
					[-rabbit.gum.speed + random, 0 + random], 
					[rabbit.gum.speed + random, 0 + random]
				];
			} else if (rabbit.img.x === 0 || rabbit.img.x === 180) {
				return [ 
					[0 + random, -rabbit.gum.speed + random], 
					[0 + random, rabbit.gum.speed + random] 
				];

			} else {
				if ( ( rabbit.img.y === 140 && ( rabbit.img.x === 45 || rabbit.img.x === 225 ) ) || ( rabbit.img.y === 175 && ( rabbit.img.x === 135 || rabbit.img.x === 315 )) ) { // //
					return [  // //
						[-rabbit.gum.speed/2 + random, rabbit.gum.speed/2 + random], 
						[rabbit.gum.speed/2 + random, -rabbit.gum.speed/2 + random] 
					];
				} else if ( ( rabbit.img.y === 140 && ( rabbit.img.x === 135 || rabbit.img.x === 315) ) || ( rabbit.img.y === 175 && ( rabbit.img.x === 45 || rabbit.img.x === 225 )) ) {
					return [  // \\\\\\\\\\\\\\\\
						[rabbit.gum.speed/2 + random, -rabbit.gum.speed/2 + random],
						[-rabbit.gum.speed/2 + random, rabbit.gum.speed/2 + random]
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
			if (rabbit.gum.stash.length > 0) {
				for (let blast in rabbit.gum.stash) {
					rabbit.gum.stash[blast].x += rabbit.gum.stash[blast].h;
					rabbit.gum.stash[blast].y += rabbit.gum.stash[blast].v;


					if (rabbit.gum.stash[blast].x < 0 || rabbit.gum.stash[blast].x > canvas.width || rabbit.gum.stash[blast].y < 0 || rabbit.gum.stash[blast].y > canvas.height - 100) {
						const removeBlast = rabbit.gum.stash.indexOf(rabbit.gum.stash[blast]);
						rabbit.gum.stash.splice(removeBlast,1);
					} else if (game.enemies.length > 0) {
						if (enemy1.hitCheck(rabbit.gum.stash[blast])) {
							const removeBlast = rabbit.gum.stash.indexOf(rabbit.gum.stash[blast]);
							rabbit.gum.stash.splice(removeBlast,1);
						} else {
							rabbit.gum.draw(rabbit.gum.stash[blast].x, rabbit.gum.stash[blast].y, rabbit.gum.size, rabbit.gum.stash[blast].color);
						}
					} else {
						rabbit.gum.draw(rabbit.gum.stash[blast].x, rabbit.gum.stash[blast].y, rabbit.gum.size, rabbit.gum.stash[blast].color);
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
}/*
rabbit.cycleAcrossImage = function() {
	rabbit.steps++;
	if (rabbit.steps % 4 === 0) {
		rabbit.steps = 0;
		(rabbit.img.z === 7) ? rabbit.img.z = 0 : rabbit.img.z++;
		rabbit.img.x = rabbit.img.z * rabbit.width;
	}
}
*/
class Enemy {
	constructor(x) {
		this.direction = null;
		this.alive = true;
		this.y = 300;
		this.x = x;
		this.h = 0;
		this.v = 0;
		this.speed = 4;
		this.range = 375;
		this.height = 40;
		this.width = 45;
		this.health = 75;
		this.img = {
			steps: 0,
			x: 0,
			y: 280
		}
		this.beam = {
			active: false,
			speed: 7,
			width: 10,
			height: 5,
			enx: this.x,
			eny: this.y,
			x: null,
			y: null,
			h: null,
			v: null,
			draw: function() {
				context.fillStyle = 'red';
				context.fillRect(this.x,this.y,this.width,this.height);
			},
			blast: function(en) {
				console.log('blast');
				//let xd = rabbit.x - this.x;
				//let yd = rabbit.y - this.y;
				en.beam.x = en.x + en.width / 2;
				en.beam.y = en.y + en.height / 2;

				let xd = rabbit.x + rabbit.width / 2 - en.beam.x;
				let yd = rabbit.y + rabbit.height / 2 - en.beam.y;
				let zd = Math.abs(xd) + Math.abs(yd);

				let unit = en.beam.speed / zd;

				this.h = xd * unit;
				this.v = yd * unit;

				this.active = true;
			},
			adjust: function(en) {
				if (this.active) {
					if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
						this.active = false;
						return;
					}
					console.log('here');
					this.x += this.h;
					this.y += this.v;
					this.draw();
				} else {
					this.blast(en);
				}
			}
		}
		this.jump = {
			steps: 0,
			active: false,
			height: 100,
			begin: null,
			end: null
		}
		this.jumpUp = function() {
			this.jump.active = true;
			this.v = -this.speed;
			this.jump.begin = this.y;
			this.jump.end = this.y - this.jump.height;
		}
		this.checkRange = function() {
			if (this.y + this.height * 1.5 > game.groundlevel) {
				if (this.x - rabbit.x > this.range) { // right of rabbit
					this.direction = 'left';
				} else if (rabbit.x - this.x > this.range) { // left of rabbit
					this.direction = 'right';
				}
			}
		}
		this.vertAdjust = function() {
			if (this.jump.active) {
				if (this.y > this.jump.end) {
					if (this.y < this.jump.end + 20) {
						if (this.v > 1) this.v *= 0.7;
					} if (this.v > this.speed) {
						this.v = this.speed;
					}
				} else {
					this.jump.active = false;
				}
			} else if (this.y + this.height < game.groundlevel) { // VERTICAL ADJUSTMENTS
				if (this.v <= 0) {
					this.v = 1;
				} else if (this.v < this.speed) {
					this.v *= 1.3;
				} else if (this.v > this.speed) {
					this.v = this.speed;
				}
			} else if (this.y + this.height > game.groundlevel) {
				this.v = 0;
			}
			(Math.random() < 0.5) ? this.jump.steps++ : this.jump.steps += 2;
			if (this.jump.steps % 115 === 0 || this.jump.steps % 180 === 0|| this.jump.steps > 350) {
				this.jump.steps = 0;
				this.jumpUp();
			}
		}
		this.horAdjust = function() {
			if (rabbit.x == 525 && rabbit.h > 0) { // scrolling right
				(this.direction == 'right') ? this.h = this.speed - rabbit.speed : this.h = -this.speed - rabbit.speed;
			} else if (rabbit.x == 327 && rabbit.h < 0) { // scrolling left
				(this.direction == 'right') ? this.h = this.speed + rabbit.speed : this.h = -this.speed + rabbit.speed;
			} else { // not scrolling;
				(this.direction == 'right') ? this.h = this.speed : this.h = -this.speed; 
			}
		}
		this.adjust = function() {
			if (this.alive) { // HORIZONTAL ADJUSTMENTS
				this.horAdjust();
				this.vertAdjust();
				this.checkRange();

				this.x += this.h;
				this.y += this.v;
			}
		}
		this.hitCheck = function(ball) {
			if (ball.x > this.x && ball.x < this.x + this.width && ball.y > this.y && ball.y < this.y + this.height) {
				this.health--;
				return true;
			}
		}
		this.damageCheck = function() {
			if (this.health <= 0) {
				this.alive = false;
				const removeEnemy = game.enemies.indexOf(this);
				game.enemies.splice(removeEnemy,1);
			}
		}
	}
}

// const playerTwo = new Player(game.playerTwoPos);
const enemy1 = new Enemy(800);
game.enemies.push(enemy1);

function gameLoop() {
	game.scrollAdjust();
	game.drawBackground();
	rabbit.adjust();
	rabbit.draw();
	game.drawEnemies();
	game.drawGrass();
}


function keyPushed(btn) {
	if (btn.keyCode === 32 && rabbit.y === rabbit.earlevel) rabbit.jump.up(); // SPACE
	if (btn.keyCode === 37) { // left arrow
		rabbit.img.dir = 'left';
		rabbit.h = -rabbit.speed;
		if (rabbit.y < rabbit.earlevel) {
			rabbit.img.y = 175;
		} else {
			rabbit.img.y = 35;
		}
		//(rabbit.y < game.groundlevel -5) ? rabbit.h = -rabbit.speed * 1.5 : rabbit.h = -rabbit.speed; 
	}
	if (btn.keyCode === 39) { // right arrow
		rabbit.img.dir = 'right';
		rabbit.h = rabbit.speed;
		if (rabbit.y < rabbit.earlevel) {
			rabbit.img.y = 145;
		} else {
			rabbit.img.y = 0; 
		}
		//(rabbit.y < game.groundlevel - 5) ? rabbit.h = rabbit.speed * 1.5 : rabbit.h = rabbit.speed;
	}
	if (btn.keyCode === 38 && !rabbit.jump.active && rabbit.y === rabbit.earlevel) rabbit.jump.up();
	if (btn.keyCode === 40) {
		if (rabbit.jump.active) rabbit.jump.active = false;
		if (rabbit.y < game.groundlevel) rabbit.v = rabbit.speed;
	}
	if (btn.keyCode === 67 && rabbit.gum.charge > 0) { // C  && rabbit.jump.active
		if (!rabbit.gum.spin) rabbit.gum.spin= true;
		rabbit.gum.doubleFire();
	}
	if (btn.keyCode === 70 && rabbit.gum.charge > 0) rabbit.gum.fire();  // F
	if (btn.keyCode === 81) game.pauseandresume();
}

function keyReleased(btn) {
	if (btn.keyCode === 37 && rabbit.h < 0) {
		rabbit.h = 0;

		if (rabbit.v === 0) {
			rabbit.img.y = 105;
		} else {
			if (rabbit.img.dir == 'right') {

			}
		}
	}
	if (btn.keyCode === 39 && rabbit.h > 0) {
		rabbit.h = 0;
		if (rabbit.v === 0) rabbit.img.y = 70;
	}
	if (btn.keyCode === 40) rabbit.v = 0;
	if (btn.keyCode === 67) rabbit.gum.spin = false;
}

let loop = setInterval(gameLoop,game.speed);