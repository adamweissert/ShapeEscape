var player;
var score = 0;
var time = 0;
var obstacle;
var wall1;
var wall2;
var hasGP = false;
var repGP;
		
	function canGame() {
			return "getGamepads" in navigator;
	}
		
	$(document).ready(function() {
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
			
			text: function(str, x, y, size, col){
				ctx.font = 'bold ' + size + 'px Courier';
				ctx.fillStyle = col;
				ctx.fillText(str, x, y);
			}
		};
		
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
					if(this.y < 0){
						this.y = 0;
					}
				}
				if(input.down){
					this.y += this.speed;
					if(this.y > canvas.height){
						this.y = canvas.height;
					}
				}
			}
			
			this.draw = function(){
				draw.circle(this.x, this.y, this.r, this.color, this.stroke, this.lineWid);
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
			
			this.collides = function(obj){
				
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

		
		
		
		player = new playerObject();
		player.init();
		
		wall1 = new wallTop();
		wall1.init();
		
		wall2 = new wallBottom();
		wall2.init();

		
		function loop(){
			draw.clear();
			player.draw();
			player.move();
			wall1.draw();
			wall2.draw();
		}

		
		setInterval(loop, 30);
		
		function reportOnGamepad() {
			var gp = navigator.getGamepads()[0];
			var a = gp.buttons[0];
			var y = gp.buttons[3];
			
			if(a.pressed){
				input.up = false;
				input.down = true;
				console.log("A-Button pressed!");
			}
			else if(y.pressed){
				input.up = true;
				input.down = false;
				console.log("Y-Button pressed!");
			}
			else{
				input.up = false;
				input.down = false;
			}
		}

		
			if(canGame()) {

				var prompt = "To begin using your gamepad, connect it and press any button!";
				$("#gamepadPrompt").text(prompt);

				$(window).on("gamepadconnected", function() {
					hasGP = true;
					$("#gamepadPrompt").html("Gamepad connected!");
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