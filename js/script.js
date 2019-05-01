var player;
var score = 0;
var powerUpScore = 0;
var speedPower = 0;
var time = 0;
var wall1;
var wall2;
var handle, spawn, addp, addb;
var paused = false;
var hasGP = false;
var repGP;
var gameStart = false;
var music = [
	{fileName: './music/song1.mp3',title: 'Back in Town - Crimson Nights'},
	{fileName: './music/song2.mp3',title: 'Chiptune Anthem - TeknoAXE'},
	{fileName: './music/song3.mp3',title: 'Digital Ether - Bit Chip Tune'},
	{fileName: './music/song4.mp3',title: 'Logical Sequnce of Events'},
	{fileName: './music/song5.mp3',title: 'To the Next Destination'}
];
	
	function canGame() {
			return "getGamepads" in navigator;
	}
		
	$(document).ready(function() {
		var randomIndexSong = Math.floor(Math.random() * music.length);
		var song = music[randomIndexSong];
		$("#song").attr('src', song.fileName);
		var source = song.fileName;
		var songPlayed = new Audio();
		
		songPlayed.src = source;
		songPlayed.autoplay = true;
		
		
		$("#gameOver").hide();
		

		var rectangleList = [];
		var powerupList = [];
		var debuffList=[];
		
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
			rectangles: function(x, y, w, h, col, strokeCol, strokeWid){
				ctx.fillStyle = col;
				ctx.fillRect(x, y, w, h);
				ctx.strokeStyle = strokeCol;
				ctx.strokeWidth = strokeWid;
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
				if (score <= 100) {
					this.speed = 5;
					playerObject.speed = 10;
				}
				else if (score <= 200) {
					this.speed = 10;
					playerObject.speed = 15;
				}
				else if (score <= 300) {
					this.speed = 15;
					playerObject.speed = 20;
				}
				else if (score <= 400) {
					this.speed = 20;
					playerObject.speed = 25;
				}
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
			
			this.draw = function(){
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
		
		var genPowerUp = function(){
			this.init = function() {
				if (score <= 100) {
				this.speed = 5;
					}
				else if (score <= 200) {
					if (this.speed == 5) {
						this.delete();
						}
				this.speed = 10;
				}
				else if (score <= 300) {
					if (this.speed == 10) {
						this.delete();
						}
				this.speed = 15;
				}
				else if (score <= 400) {
					if (this.speed == 15) {
						this.delete();
						}
				this.speed = 20;
				}
				this.x = canvas.width-50;
				this.y = Math.floor(Math.random()*280) + 40;
				this.w = Math.floor(Math.random()*100) + 50;
				this.h = Math.floor(Math.random()*80) + 20;
				this.col = "#1d52e6";
				this.strokeCol = '#fff';
				this.strokeWid = 2;
			}
			this.move = function(){
				this.x -= this.speed;
				
				if(this.x < 0){
					powerupList.splice();
					
				}
				
				if(this.collides(player)){
					powerUpScore += 1;
					speedPower = 1;
					
				}
			}
			
			this.draw = function(){
				draw.rectangles(this.x, this.y, this.w, this.h, this.col, this.strokeCol, this.strokeWid);
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
		
		
		var genDebuff = function(){
			this.init = function() {
				if (score <= 100) {
					this.speed = 5;
				}
				else if (score <= 200) {
					this.speed = 10;
				}
				else if (score <= 300) {
					this.speed = 15;
				}
				else if (score <= 400) {
					this.speed = 20;
				}
				this.x = canvas.width-50;
				this.y = Math.floor(Math.random()*280) + 40;
				this.w = Math.floor(Math.random()*100) + 50;
				this.h = Math.floor(Math.random()*80) + 20;
				this.col = "#ff0000";
				this.strokeCol = '#fff';
				this.strokeWid = 2;
				
			}
			this.move = function(){
				this.x -= this.speed;
				
				if(this.x < 0){
					debuffList.splice();
					
				}
				
				if(this.collides(player)){
					powerUpScore -= 1;
					speedPower = 1;
					
				}
			}
			
			this.draw = function(){
				draw.rectangles(this.x, this.y, this.w, this.h, this.col, this.strokeCol, this.strokeWid);
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
		
		
		player = new playerObject();
		player.init();
		
		wall1 = new wallTop();
		wall1.init();
		
		wall2 = new wallBottom();
		wall2.init();		

		function menu(){
			draw.clear();

			ctx.font = "900 75px sans-serif";
			ctx.lineWidth=2;
			var str = "SHAPE ESCAPE!";
			var strwidth = ctx.measureText(str).width;
			var str2 = "PLAY";
			var strwidth2 = ctx.measureText(str2).width;
			
			var width=canvas.width;

			var str4 = "HOW TO PLAY";
			var strwidth4 = ctx.measureText(str4).width;

			var c=0;
			var color=0;

		

			
			   img=ctx.getImageData(0,0,width,width);
			   ctx.putImageData(img,0,0);
			   ctx.save();
			   ctx.translate((width/2),width/2);
			   //ctx.rotate(Math.PI*(c++/200));

			   ctx.fillStyle='hsla('+(color=color+2%360)+', 100%, 50%, 1)';
			   ctx.fillText("SHAPE ESCAPE!",-(strwidth/2), -250);
			   ctx.strokeText("SHAPE ESCAPE!",-(strwidth/2), -250);
			   ctx.fillText("PLAY",-(strwidth2/1.75), -135);
			   ctx.strokeText("PLAY",-(strwidth2/1.75), -135);
			   ctx.fillText("HOW TO PLAY", -(strwidth4/2), 0);
			   ctx.strokeText("HOW TO PLAY", -(strwidth4/2), 0);

			   ctx.restore();


			   requestAnimationFrame(menu);
	

		}
		
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
			for (var i=0;i<powerupList.length;i++){
				pow = powerupList[i];
				pow.draw();
				pow.move();
			}
			for(var i=0;i<debuffList.length;i++){
				deb = debuffList[i];
				deb.draw();
				deb.move();
			}
			
			TimeMe.startTimer("game");

			time = TimeMe.getTimeOnPageInSeconds("game").toFixed(2);
			score = Math.floor(powerUpScore + (time * 1.5));
		}
		
		
		var rectsPerSpawn = 1;
		function addRects(){
			for(var i=0;i<rectsPerSpawn;i++){
				if(rectangleList.length < 10000){
					var rec = new randomRectangle();
					
					rectangleList.push(rec);
					rec.init();
					songPlayed.play();
				}
			}
		}
		
		var powersPerSpawn = 1;
		function addPowerUps(){
			for(var i=0;i<powersPerSpawn;i++){
				if(powerupList.length < 5000){
					var pow = new genPowerUp;
					
					powerupList.push(pow);
					pow.init();
				}
			}
		}
		
		var debuffsPerSpawn = 1;
		function addDebuffs(){
			for(var i=0;i<debuffsPerSpawn;i++){
				if(debuffList.length < 5000){
					var deb = new genDebuff;
					
					debuffList.push(deb);
					deb.init();

				}
			}
		}
		
		handle = setInterval(loop, 30);
		spawn = setInterval(addRects, 900);
		addp = setInterval(addPowerUps,4500);
		addb = setInterval(addDebuffs,9000);
		
		
		function wait(timeToWait){
			var now = new Date().getTime();
			
			while(new Date().getTime() < now + timeToWait){
				//wait x seconds
			}
		}

		function gameOver(){
			songPlayed.pause();
			songPlayed.currentTime = 0;
			TimeMe.stopTimer("game");
			wait(1000);
			clearInterval(handle);
			clearInterval(spawn);
			clearInterval(addp);
			clearInterval(addb);
			handle = 0;
			spawn = 0;
			addp = 0;
			addb = 0;

			$("#gameOver").show();
			$("#game-over-text").html("GAME OVER!");
			$("#stats").html("Score: " + score + " - Time: " + time+"s");
			
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
			TimeMe.resetAllRecordedPageTimes();
			clearInterval(handle);
			clearInterval(spawn);
			clearInterval(addp);
			clearInterval(addb);
				
			handle = 0;
			spawn = 0;
			addp = 0;
			addb = 0;
			score = 0;
			powerUpScore = 0;
			time = 0;
			draw.clear();
			rectangleList = [];
			powerupList = [];
			debuffList = [];
			$("#gameOver").hide();
				
				
			player.init();
			wall1.init();
			wall2.init();
			spawn = setInterval(addRects, 900);
			handle = setInterval(loop, 30);
			addp = setInterval(addPowerUps,4500);
			addb = setInterval(addDebuffs,9000);
			
			randomIndexSong = Math.floor(Math.random() * music.length);
			song = music[randomIndexSong];
			$("#song").attr('src', song.fileName);
			source = song.fileName;

			songPlayed.src = source;
			
		}
		
		function signUpForm(time, score){
			
		}
		function endGame(){
			TimeMe.resetAllRecordedPageTimes();
			clearInterval(handle);
			clearInterval(spawn);
			clearInterval(addp);
			
			handle = 0;
			spawn = 0;
			addp = 0;
			score = 0;
			powerUpScore = 0;
			time = 0;
			$("#gameOver").hide();
			menu();
		}
		
		function togglePause(paused){
			if(paused){
				songPlayed.pause();
				//console.log("Paused!");
				TimeMe.stopTimer("game");
				clearInterval(handle);
				clearInterval(spawn);
				clearInterval(addp);
				handle = 0;
				spawn = 0;
				addp = 0;
			}
			else{
				songPlayed.play();
				//console.log("Restarted!");
				TimeMe.startTimer("game");
				handle = setInterval(loop, 30);
				spawn = setInterval(addRects, 900);
				addp = setInterval(addPowerUps,4500);
				addb = setInterval(addDebuffs,9000);
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
				else {
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
				menu();
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
-scores + time xx
-put in menu && add controls to it synonymous w/game
-music xx
-power ups
-sign up form
-account info & score info
-Exit to main menu
-stylize page a bit
*/