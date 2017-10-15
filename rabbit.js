document.addEventListener("keydown",keyPushed);
document.addEventListener("keyup",keyReleased);

const canvas = document.createElement('canvas');
canvas.height = 500;
canvas.width = 1000;
document.body.appendChild(canvas);
let context =  canvas.getContext('2d'); 

let loop = setInterval(gameLoop,30);

const game = {
	drawBackground: function() {
		context.fillStyle = '#55C';
		context.fillRect(0,0,canvas.width,canvas.height);
		context.fillStyle = '#090';
		context.fillRect(0,400,canvas.width,100);
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
	image: new Image(),
	img: {
		x: 0,
		y: 0,
		z: 0
	},
	adjust: function() {
		rabbit.x += rabbit.h;
		rabbit.y += rabbit.v;
		rabbit.y += 4;
		if (rabbit.y > 400 - rabbit.height + 7) rabbit.y = 400 - rabbit.height + 7;
	}
}
rabbit.image.src = 'rabbit_3.png';
rabbit.draw = function() {
	context.drawImage(rabbit.image, rabbit.img.x, rabbit.img.y, rabbit.width, rabbit.height, rabbit.x, rabbit.y, rabbit.width, rabbit.height);
	if (rabbit.h !== 0 || rabbit.v !== 0) rabbit.cycle();
	//ctx.drawImage(image, innerx, innery, innerWidth, innerHeight, outerx, outery, outerWidth, outerHeight);
}
rabbit.cycle = function() {
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
	if (btn.keyCode === 37) {
		rabbit.img.y = rabbit.height;
		rabbit.h = -rabbit.speed; 
	}
	if (btn.keyCode === 39) {
		rabbit.img.y = 0;
		rabbit.h = rabbit.speed;
	}
	if (btn.keyCode === 38) rabbit.v = -rabbit.speed;
	if (btn.keyCode === 40) rabbit.v = rabbit.speed;
}

function keyReleased(btn) {
	if (btn.keyCode === 37) rabbit.h = 0;
	if (btn.keyCode === 39) rabbit.h = 0;
	if (btn.keyCode === 38) rabbit.v = 0;
	if (btn.keyCode === 40) rabbit.v = 0;
}