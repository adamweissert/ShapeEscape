var player;
var score = 0;
var time = 0;
var wall1;
var wall2;
var handle, spawn;
var paused = false;
var hasGP = false;
var repGP;
var gameStart = false;

		
	function canGame() {
			return "getGamepads" in navigator;
	}
		
	$(document).ready(function() {
		$("#gameOver").hide();
		var rectangleList = [];
		var powerUp = [];
		
		var canvas = $('#canvas')[0];
		canvas.width = 720;
		canvas.height = 480;
		
		var ctx = canvas.getContext('2d');
		
		var input = {
			up: false,
			down: false
		};
		
		$(window).keydown(function(e){
			switch (e.keyCode) {
				case 87: input.up = true; break;
				case 83: input.down = true; break;		
			}
		});
		
		$(window).keyup(function(e){
			switch (e.keyCode){
				case 87: input.up = false; break;
				case 83: input.down = false; break;
			}
		})
		
		var draw = {
			clear: function(){
				ctx.clearRect(0, 0, canvas.width, canvas.height);
			},
			
			circle: function(x, y, r, color, stroke, lineWid){
				ctx.fillStyle = color;
				ctx.strokeStyle = stroke;
				ctx.lineWidth = lineWid;
				ctx.beginPath();
				ctx.arc(x, y, r, 0, Math.PI * 2);
				ctx.closePath();
				ctx.fill();
				ctx.stroke();
			},
			wall1: function(x, y, w, h, color){
				ctx.fillStyle = color;
				ctx.fillRect(x, y, w, h);
				
			},
			
			wall2: function(x, y, w, h, color){
				ctx.fillStyle = color;
				ctx.fillRect(x, y, w, h);
				
			},
			rectangles: function(x, y, w, h, col){
				ctx.fillStyle = col;
				ctx.fillRect(x, y, w, h);
			},
			
			text: function(str, x, y, size, col){
				ctx.font = 'bold ' + size + 'px Courier';
				ctx.strokeStyle = 'black';
				ctx.lineWidth = 4;
				ctx.strokeText(str, x, y);
				ctx.fillStyle = col;
				ctx.fillText(str, x, y);
			}
		};
 
		var wallTop = function(){
			this.init = function(){
				this.x = 0;
				this.y = 0;
				this.w = canvas.width;
				this.h = 35;
				this.color = "#00ef07";
			}
			
			this.draw = function(){
				draw.wall1(this.x, this.y, this.w, this.h, this.color);
			}
			
		};
		
		var wallBottom = function(){
			this.init = function(){
				this.x = 0;
				this.y = canvas.height;
				this.w = canvas.width;
				this.h = -35;
				this.color = "#00ef07";
			}
			
			this.draw = function(){
				draw.wall2(this.x, this.y, this.w, this.h, this.color);
				draw.text("Time: "+time, this.x+20, this.y-10, 30, "white");
				draw.text("Score: " +score, 500, this.y-10, 30, "white");
			}
			
		};
		
		var randomRectangle = function(){
			this.init = function() {
				this.speed = 5;
				this.x = canvas.width-50;
				this.y = Math.floor(Math.random()*280) + 40;
				this.w = Math.floor(Math.random()*100) + 50;
				this.h = Math.floor(Math.random()*80) + 20;
				this.col = "#b5e61d";
			}
			this.move = function(){
				this.x -= this.speed;
				
				if(this.x < 0){
					rectangleList.splice();
					
				}
				
				if(this.collides(player)){
					gameOver();
				}
			}
			
			this.draw = function(num){
				draw.rectangles(this.x, this.y, this.w, this.h, this.col);
			}
			
			this.collides = function(obj){
				this.left = this.x;
				this.right = this.x + this.w;
				this.top = this.y;
				this.bottom = this.y + this.h;
				
				obj.left = obj.x+12;
				obj.right = obj.x + obj.r - 12;
				obj.top = obj.y - obj.r+15;
				obj.bottom = obj.y + obj.r-12;
				
				if(this.bottom < obj.top){
					return false;
				}
				if(this.top > obj.bottom){
					return false;
				}
				if(this.right < obj.left){
					return false;
				}
				if(this.left > obj.right){
					return false;
				}
				
				return true;
			};
		}
		
		var playerObject = function(){
			
			this.init = function(){
				this.speed = 10;
				this.x = 50;
				this.y = 220;
				this.r = 25;
				this.color = "red";
				this.stroke = "white";
				this.lineWid = 2;
			}
			
			this.move = function(){
				if(input.up){
					this.y -= this.speed;
					if(this.y < 25 + this.r){
						this.y = 25 + this.r;
						//console.log("Game over!");
						gameOver();
						
					}
				}
				if(input.down){
					this.y += this.speed;
					if(this.y > canvas.height-25-this.r){
						this.y = canvas.height-25-this.r;
						//console.log("Game over!");
						gameOver();
						
						
					}
				}
			}
			
			this.draw = function(){
				draw.circle(this.x, this.y, this.r, this.color, this.stroke, this.lineWid);
			}
			
		};
		
		
		player = new playerObject();
		player.init();
		
		wall1 = new wallTop();
		wall1.init();
		
		wall2 = new wallBottom();
		wall2.init();		

		/*function menu(){
			draw.clear();
			handle = setInterval(loop, 30);
			spawn = setInterval(addRects, 1000);
		}*/
		function loop(){
			gameStart = true;
			draw.clear();
			
			player.draw();
			player.move();
			
			wall1.draw();
			wall2.draw();
			
			for(var i=0;i<rectangleList.length;i++){
				rec = rectangleList[i];
				rec.draw();
				rec.move();	
			}
		}
		
		var rectsPerSpawn = 1;
		function addRects(){
			for(var i=0;i<rectsPerSpawn;i++){
				if(rectangleList.length < 500){
					var rec = new randomRectangle();
					
					rectangleList.push(rec);
					rec.init();
				}
			}
		}
		
		handle = setInterval(loop, 30);
			spawn = setInterval(addRects, 1000);
		
		function wait(timeToWait){
			var now = new Date().getTime();
			
			while(new Date().getTime() < now + timeToWait){
				//wait x seconds
			}
		}
		
		function gameOver(){
			wait(1000);
			clearInterval(handle);
			clearInterval(spawn);
			handle = 0;
			spawn = 0;

			//$("#canvas").hide();
			$("#gameOver").show();
			$("#game-over-text").html("GAME OVER!");
			$("#stats").html("Score: " + score + " Time: " + time);
			
			$("#startAgain").html("Start Again");
			$("#signUp").html("Sign Up");
			$("#mainMenu").html("Exit to Main Menu");
			
			$("#startAgain").click(function(){
				restart();
			});
			$("#signUp").click(function(){
				signUpForm(score, time);
			});
			$("#mainMenu").click(function(){
				endGame();
			});
			
		}
		function restart(){
			clearInterval(handle);
			clearInterval(spawn);
				
			handle = 0;
			spawn = 0;
			score = 0;
			time = 0;
			draw.clear();
			rectangleList = [];
			$("#gameOver").hide();
				
				
			player.init();
			wall1.init();
			wall2.init();
			spawn = setInterval(addRects, 1000);
			handle = setInterval(loop, 30);
		}
		
		function signUpForm(time, score){
			
		}
		function endGame(){
			clearInterval(handle);
			clearInterval(spawn);
			
			handle = 0;
			spawn = 0;
			$("#gameOver").hide();
			menu();
		}
		function togglePause(paused){
			if(paused){
				console.log("Paused!");
				clearInterval(handle);
				clearInterval(spawn);
				handle = 0;
				spawn = 0;
			}
			else{
				//console.log("Restarted!");
				handle = setInterval(loop, 30);
				spawn = setInterval(addRects, 1000);
			}
			
		}

		function reportOnGamepad(button) {
			var gp = navigator.getGamepads()[0];
			var a = gp.buttons[0];
			var y = gp.buttons[3];
			var start = gp.buttons[9];
			var upDir = gp.buttons[12];
			var downDir = gp.buttons[13];
			
			if(gameStart){
				if(a.pressed||downDir.pressed){
					input.up = false;
					input.down = true;
					//console.log("A-Button pressed!");	
				}
				else if(y.pressed||upDir.pressed){
					input.up = true;
					input.down = false;
				}
				else{
					input.up = false;
					input.down = false;
				}
				
				if(start.pressed){
					if(paused == false){
						paused = true;
						togglePause(paused);
						ctx.save();
						ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
						ctx.fillRect(0, 0, canvas.width, canvas.height);
						draw.text("Paused", 300, 240, 30, "white");
						draw.text("Press Start to resume!", 200, 275, 25, "white");
						ctx.restore();

					}
					else{
						paused = false;
						togglePause(paused);
					}					
				}
			}
			else{
				//menu();
			}
		}

		
			if(canGame()) {

				$(window).on("gamepadconnected", function() {
					hasGP = true;
					console.log("connection event");
					repGP = window.setInterval(reportOnGamepad,100);
				});

				$(window).on("gamepaddisconnected", function() {
					console.log("disconnection event");
					$("#gamepadPrompt").text(prompt);
					window.clearInterval(repGP);
				});

				//setup an interval for Chrome
				var checkGP = window.setInterval(function() {
					if(navigator.getGamepads()[0]) {
						if(!hasGP) $(window).trigger("gamepadconnected");
						window.clearInterval(checkGP);
					}
				}, 500);
			}
    });

/*TODO:
-scores + time
-put in menu && add controls to it synonymous w/game
-music
-power ups
-sign up form
-account info & score info
-Exit to main menu
-stylize page a bit
*/