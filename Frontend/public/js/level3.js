const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const canvasSize = { height: canvas.height, width: canvas.width }; 
const row = 40;
const col = 17;
var score = 0;
var maxPoint = 20;
var snake = {
	direction: 'left',
	body: [],
	food: [],
	lives: [],
	disabled: [
		{
			x: Math.floor(Math.random() * row),
			y: Math.floor(Math.random() * col)
		},
		{
			x: Math.floor(Math.random() * row),
			y: Math.floor(Math.random() * col)
		},
		{
			x: Math.floor(Math.random() * row),
			y: Math.floor(Math.random() * col)
		},
		{
			x: Math.floor(Math.random() * row),
			y: Math.floor(Math.random() * col)
		},
		{
			x: Math.floor(Math.random() * row),
			y: Math.floor(Math.random() * col)
		},
		{
			x: Math.floor(Math.random() * row),
			y: Math.floor(Math.random() * col),
		},
	]
}	

var live = 1;
var speed = 10;
var level = 3;
var animationLoop = null;

function winner() {
	clearInterval(animationLoop);
	const winnerSound = new Audio('/js/winner.wav');
	winnerSound.play();
	ctx.shadowOffsetY = 10
	ctx.shadowBlur = 10;
	ctx.font = "50px arial";
	var gradient = ctx.createLinearGradient(0, 0, 150, 100);
	gradient.addColorStop(0, "rgb(255, 0, 128)");
	gradient.addColorStop(1, "rgb(255, 153, 51)");
	ctx.fillStyle = gradient;
	ctx.fillText("Kamu menang", 360, canvasSize.height / 2 + 10);
	
	var level_id = level;
	level++;
	var description = `Anda telah memainkan Level 3 dengan score ${score}`;
	document.getElementById('level_id').value = level_id;
	document.getElementById('description').value = description;
	document.getElementById('level').value = level;
	document.getElementById('score').value = score;
	document.getElementById('btn').click();
}


function reset () {
	function res () {
		snake.body = [
			{x: 10, y: 12},
			{x: 11, y: 12},
			{x: 12, y: 12},
			{x: 13, y: 12},
			{x: 14, y: 12},
			{x: 15, y: 12},
			];

		snake.food = [];
		score = 0;
		speed = 10; 	
	}

	if (animationLoop !== null) {
		clearInterval(animationLoop);

		const lose = new Audio('/js/lose.wav');
		lose.play();
		ctx.shadowOffsetY = 10
		ctx.shadowBlur = 10;
		ctx.font = "50px arial";
		var gradient = ctx.createLinearGradient(0, 0, 150, 100);
		gradient.addColorStop(0, "rgb(255, 0, 128)");
		gradient.addColorStop(1, "rgb(255, 153, 51)");
		ctx.fillStyle = gradient;
		ctx.fillText("Kamu kalah", 330, canvasSize.height / 2 + 10);
		
		var level_id = level;
		var description = `Anda telah memainkan Level ${level} dengan score ${score}`;
		document.getElementById('level_id').value = level_id;
		document.getElementById('description').value = description;
		document.getElementById('level').value = level;
		document.getElementById('score').value = score;
		document.getElementById('btn').click();

	} else {
		return res();			
	}
	
}

function gameLoop () {
	draw();
	update();
}

function play () {
	reset();
	start();	
}

function start () {
	animationLoop = setInterval(gameLoop, 1000 / speed);

}

async function update () {
	const head = snake.body[0];
	const oldHead = Object.assign({}, snake.body[0]);
	var newHead = Object.assign({}, head);
	
	if (snake.food.length == 0) {
		const randPos = {
			x: Math.floor(Math.random() * row),
			y: Math.floor(Math.random() * col)
		}

		snake.food.push(randPos);
	}	

	if (snake.lives.length == 0 && live < 5) {
		const randPoss = {
			x: Math.floor(Math.random() * row),
			y: Math.floor(Math.random() * col)
		}
		snake.lives.push(randPoss);
	}	

	// key direction
	if (snake.direction == 'right') newHead.x = newHead.x + 1;
	if (snake.direction == 'left') newHead.x = newHead.x - 1;
	if (snake.direction == 'top') newHead.y = newHead.y - 1;
	if (snake.direction == 'bottom') newHead.y = newHead.y + 1;

	// Telportation
	if (newHead.x < 0) newHead.x = row;
	if (newHead.x > row) newHead.x = 0;
	if (newHead.y > col) newHead.y = 0;
	if (newHead.y < 0) newHead.y = col;

	for (let i = 0; i < snake.body.length; i++) {
		const body = snake.body[i];
		if (body.x == newHead.x && body.y == newHead.y) {
			
			if (live == 0) {
				return reset();
			} live--;
		}
	}

	for (let v = 0; v < snake.disabled.length; v++) {
		const disabled = snake.disabled[v];
		if (disabled.x == newHead.x && disabled.y == newHead.y) {
			
			if (live == 0) {
				return reset();
			} live--;
		}
	}


	var eated = false;
	const gulp = await new Audio('/js/gulp.mp3');
	for (let i = 0; i < snake.food.length; i++) {
		const food = snake.food[i];
		if (food.x == newHead.x && food.y == newHead.y) {
			snake.food.splice(i, 1);
			score++;
			eated = true;
			await gulp.play();
		}
	}
	const run = await new Audio('/js/run.wav');

	await run.play();
	snake.body.unshift(newHead);

	if (eated == false) snake.body.pop();

	const livePoint = await new Audio('/js/livePoint.wav');
	for (let y = 0; y < snake.lives.length; y++) {
		const lives = snake.lives[y];
		if (lives.x == newHead.x && lives.y == newHead.y) {
			await livePoint.play();
			snake.lives.splice(y, 1);
			live++;	
		}
	}


	if ( score === maxPoint ) {
		return winner();
	}

}

async function draw () {
	drawBoard();
	drawSnake();
	drawFood();
	drawScore();
	drawLiveScore();
	drawDisabled();
	setInterval(drawLive, 10000);
}

function drawBoard () {
	for (let i = 0; i < row; i++) {
		for(let j = 0; j < col; j++) {
			var w = canvasSize.width / row;
			var h = canvasSize.height / col;
			var x = i * w;
			var y = j * h;
			drawRect(x, y, h, w, "black", "black");
		}
	}
}

function drawSnake () {
	for (var i = 0; i < snake.body.length; i++) {
		const body = snake.body[i];
		var w = canvasSize.width / row;
		var h = canvasSize.height / col;
		var x = body.x * w;
		var y = body.y * h;
		var color = "blue";
		if ( i == 0 ) {
			color = "orange";
		}		

		drawRect(x, y, h, w, color, "black");
	}
}

function drawFood () {
	for (var i = 0; i < snake.food.length; i++) {
		const food = snake.food[i];
		var w = canvasSize.width / row;
		var h = canvasSize.height / col;
		var x = food.x * w;
		var y = food.y * h;
		drawRect(x, y, h, w, "blue", "black");
	}
}

function drawDisabled () {
	for (var i = 0; i < snake.disabled.length; i++) {
		const disabled = snake.disabled[i];
		var w = canvasSize.width / row;
		var h = canvasSize.height / col;
		var x = disabled.x * w;
		var y = disabled.y * h;
		drawRect(x, y, h, w, "gray", "black");
	}
}

function drawLive () {
	for (var i = 0; i < snake.lives.length; i++) {
		const lives = snake.lives[i];
		var w = canvasSize.width / row;
		var h = canvasSize.height / col;
		var x = lives.x * w;
		var y = lives.y * h;
		drawRect(x, y, h, w, "red", "black");
	}
}

function drawLiveScore () {
	const pad = 10;
	ctx.beginPath();
	ctx.fillStyle = "white";
	ctx.font = '9px Calibri';
	ctx.textAlign = 'right';
	ctx.textBaseLine = "hanging";
	ctx.fillText(`Lives : ${live}`, pad + 25, pad);
}

function drawScore () {
	const pad = 10;
	ctx.beginPath();
	ctx.fillStyle = "white";
	ctx.font = '9px Calibri';
	ctx.textAlign = 'right';
	ctx.textBaseLine = "hanging";
	ctx.fillText(`Score : ${score}`, canvasSize.width - pad, 0 + pad);
}

function drawRect (x, y, height, width, fillColor, strokeColor) {
	ctx.beginPath();
	ctx.rect(x, y, height, width);
	ctx.fillStyle = fillColor;
	ctx. fill();
	ctx.strokeStyle = strokeColor;
	ctx.stroke(); 
}

function handleKey(e) {
	if ((e.key == "w" || e.key == "ArrowUp") && snake.direction !== "bottom") snake.direction = "top";
	if ((e.key == "a" || e.key == "ArrowLeft") && snake.direction !== "right") snake.direction = "left";
	if ((e.key == "d" || e.key == "ArrowRight") && snake.direction !== "left") snake.direction = "right";
	if ((e.key == "s" || e.key == "ArrowDown") && snake.direction !== "top") snake.direction = "bottom";
	if ( e.key == 1 || e.key == 2 || e.key == 3 || e.key == 4 || e.key == 5) {
		for (var i = 0; i < snake.body.length; i++) {
			snake.body[i];
		}
	}
}


document.addEventListener('keydown', handleKey);
document.addEventListener('DOMContentLoaded', function (e) {
	play(true);
});
