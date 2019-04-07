var player;
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
		}
		
		player = new playerObject();
		player.init();
		
		
		function loop(){
			draw.clear();
			player.draw();
			player.move();
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