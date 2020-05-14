//test lesson for understand how it works, julia
class Part{
	constructor(x,y){
		this.x = x;
		this.y = y;
	}
}
class Snake{
	constructor(game,x,y,seg){
		this.game = game;
		this.x = x;
		this.y = y;
		this.xspeed = 1;
		this.yspeed = 0;
		this.canChange = true;
		this.isAlive = true;
		this.parts = [];
		for(var i=0;i<seg;i++){
			this.parts.push(new Part(x-1,y));
		}
		var _this = this;
		document.onkeydown = function(e){
			_this.controller(e.which);
		}
	}
	
	controller(key){
		if(key==37 && this.yspeed!=0 && this.canChange){
			this.canChange = false;
			this.xspeed = -1;
			this.yspeed = 0;
		}
		if(key==38 && this.xspeed!=0 && this.canChange){
			this.canChange = false;
			this.xspeed = 0;
			this.yspeed = -1;
		}
		if(key==39 && this.yspeed!=0 && this.canChange){
			this.canChange = false;
			this.yspeed = 0;
			this.xspeed = 1;
		}
		if(key==40 && this.xspeed!=0 && this.canChange){
			this.canChange = false;
			this.xspeed = 0;
			this.yspeed = 1;
		}
	}
	addPart(){
		var lastPart = this.parts[this.parts.length-1];
		this.parts.push(new Part(lastPart.x,lastPart.y));
	}
	update(){
		this.x += this.xspeed;
		this.y += this.yspeed;
		if(this.x<0)this.x = 0;
		if(this.y<0)this.y = 0;
		if(this.x>this.game.width-1)this.x = this.game.width-1;
		if(this.y>this.game.height-1)this.y = this.game.height-1;
		for(var i = this.parts.length-1;i>=0;i--){
			var part = this.parts[i];
			if(i!=0){
				part.x = this.parts[i-1].x;
				part.y = this.parts[i-1].y;
				if(this.x == part.x && this.y == part.y){
					this.die();
				}
			}else {
				part.x = this.x;
				part.y = this.y;
			}
			this.game.grid.fillGrid(part.x,part.y);
		}
		this.canChange = true;
	}
	die(){
		//this.parts = [];
		 this.isAlive = false;
	}
}
class Food{
	constructor(game){
		this.game = game;
		this.placeFood();
	}
	placeFood(){
		this.x = Math.floor(Math.random()*this.game.width);
		this.y = Math.floor(Math.random()*this.game.height);
	}
	update(){
		this.game.grid.fillGrid(this.x,this.y);
	}
}
class Grid{
	constructor(game){
		this.game = game;
		this.grid = [];
		this.buildGrid();
	}
	buildGrid(){
		for(var x=0; x < this.game.width; x++){
			this.grid[x] = [];
			for(var y=0; y<this.game.height; y++){
				//this.grid[x,y] = [];
				var cell = document.createElement("div");
				cell.style.position = "absolute";
				cell.style.width = cell.style.height = this.game.size + "px";
				cell.style.left = x * this.game.size + "px";
				cell.style.top = y * this.game.size + "px";
				cell.style.border = "1px solid gray";
				this.game.stage.appendChild(cell);
				//creation empty grid of cellset
				this.grid[x][y] = {
					cell: cell,
					val:false				
				}
			}	
		}
			
	}

	//prepare cell to method update(), for fill black current spot
	fillGrid(x,y){
		if(this.grid[x]){
			if(this.grid[x][y]){
				this.grid[x][y].val = true;	
			}
		}
	}	
	//fill black current spot
	update(){
		for(var x=0; x < this.game.width; x++){
			for(var y=0; y < this.game.height; y++){
				var gp = this.grid[x][y];
				if(gp.val){
					gp.cell.style.background = "black";
				}else{
					gp.cell.style.background = "white";
				}
				//clean gridset
				gp.val = false;
			}
		}	
	}
	
}
class Game{
	constructor(width,height,size,fps){
		this.width = width;
		this.height = height;
		this.size = size;
		this.fps = fps;
		this.stage = document.getElementById("stage");
		this.score = document.getElementById("score");
		this.score_val = 0;
		this.grid = new Grid(this);
		this.food = new Food(this);
		this.snake = new Snake(this, 4, 2, 3);
		//start loop
		var _this = this;
		this.intVal = setInterval(function(){
			_this.update();
		}, 2000/this.fps);
	}
	update(){
		this.score.innerHTML = this.score_val;
		this.grid.update();
		if(!this.snake.isAlive){
			this.snake = new Snake(this, 4, 2, 3);
			this.food.placeFood();
		}
		this.snake.update();
		this.food.update();
		if(this.snake.x == this.food.x && this.snake.y == this.food.y){
			this.food.placeFood();
			this.snake.addPart();
			this.score_val++;
		}	
	};
}
var game = new Game(25,25,25,15);