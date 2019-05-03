/*
GROUP 12
Bill Herb, Ian Karchin, Adam Weissert
CPSC427
Gamepad API based platformer
*/

/*-----------------GLOBALS-----------------------------------*/
var player;
var score = 0;
var powerUpScore = 0;
var speedPower = 0;
var time = 0;
var wall1;
var wall2;
var handle, spawn, addp, addb;
var paused = false; //the game is not paused
var hasGP = false; //assume the browser does not have a gamepad
var repGP; //report on gamepad flag
var gameStart = false; //game starting flag for gamepad
/*-----------------GLOBALS-----------------------------------*/

/*-----------------SONGS-----------------------------------*/
var music = [
    { fileName: './music/song1.mp3', title: 'Back in Town - Crimson Nights' },
    { fileName: './music/song2.mp3', title: 'Chiptune Anthem - TeknoAXE' },
    { fileName: './music/song3.mp3', title: 'Digital Ether - Bit Chip Tune' },
    { fileName: './music/song4.mp3', title: 'Logical Sequnce of Events' },
    { fileName: './music/song5.mp3', title: 'To the Next Destination' }
];
/*-----------------SONGS-----------------------------------*/


/*-----------------GETTING GAMEPAD API-----------------------------------*/
function canGame() {
    //detects if there is a gamepad present, cross-browser
    return "getGamepads" in navigator;
}
/*-----------------GETTING GAMEPAD API-----------------------------------*/


$(document).ready(function() {

    /*-----------------GETTING RANDOM SONG-----------------------------------*/
    var randomIndexSong = Math.floor(Math.random() * music.length); //from music list, picks random index
    var song = music[randomIndexSong]; //assigns song to random index
    var source = song.fileName; //assigns fileName of index
    var songPlayed = new Audio(); //new audio objext

    songPlayed.src = source; //assign source to audio object
    songPlayed.autoplay = true; //autoplay is true, but this doesn't really work

    songPlayed.addEventListener("ended", function() {
            songPlayed.currentTime = 0; //restart song if it ends
        })
        /*-----------------GETTING RANDOM SONG-----------------------------------*/

    $("#gameOver, #controls, #scoresList").hide();

    /*-----------------RANDOMLY GENERATED SHAPE LISTS-----------------------------------*/
    var rectangleList = [];
    var powerupList = [];
    var debuffList = [];
    /*-----------------RANDOMLY GENERATED SHAPE LISTS-----------------------------------*/

    /*-----------------CANVAS-----------------------------------*/
    var canvas = $('#canvas')[0];
    canvas.width = 720;
    canvas.height = 480;
    var ctx = canvas.getContext('2d');
    /*-----------------CANVAS-----------------------------------*/

    /*-----------------INPUT-----------------------------------*/
    var input = {
        up: false,
        down: false
    };

    $(window).keydown(function(e) {
        //check for 'w' and 's' inputs, go up or down accordingly
        switch (e.keyCode) {
            case 87:
                input.up = true;
                break;
            case 83:
                input.down = true;
                break;
        }
    });

    $(window).keyup(function(e) {
        switch (e.keyCode) {
            case 87:
                input.up = false;
                break;
            case 83:
                input.down = false;
                break;
        }
    });
    /*-----------------INPUT-----------------------------------*/

    /*------------------DRAWING START-----------------------------------*/

    var draw = {
        //draw object, all items that are drawn on the canvas pass through here
        clear: function() {
            //clear canvas first for animation
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        },

        circle: function(x, y, r, color, stroke, lineWid) {
            //drawing player
            ctx.fillStyle = color;
            ctx.strokeStyle = stroke;
            ctx.lineWidth = lineWid;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        },
        wall1: function(x, y, w, h, color) {
            //top wall function
            ctx.fillStyle = color;
            ctx.fillRect(x, y, w, h);

        },

        wall2: function(x, y, w, h, color) {
            //bottom wall function
            ctx.fillStyle = color;
            ctx.fillRect(x, y, w, h);

        },
        rectangles: function(x, y, w, h, col, strokeCol, strokeWid) {
            //all rectangles drawn
            ctx.fillStyle = col;
            ctx.fillRect(x, y, w, h);
            ctx.strokeStyle = strokeCol;
            ctx.strokeWidth = strokeWid;
        },

        text: function(str, x, y, size, col) {
            //text formatting
            ctx.font = 'bold ' + size + 'px Courier';
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 4;
            ctx.strokeText(str, x, y);
            ctx.fillStyle = col;
            ctx.fillText(str, x, y);
        }
    };

    menu(); //start the menu after the canvas is ready/DOM is good
    /*-----------------TOP WALL-----------------------------------*/
    var wallTop = function() {
        //initialize top barrier with these attributes
        this.init = function() {
            this.x = 0;
            this.y = 0;
            this.w = canvas.width;
            this.h = 35;
            this.color = "#00ef07";
        }

        this.draw = function() {
            //send it to draw object 'Wall 1'
            draw.wall1(this.x, this.y, this.w, this.h, this.color);
        }

    };
    /*-----------------TOP WALL-----------------------------------*/

    /*-----------------BOTTOM WALL-----------------------------------*/
    var wallBottom = function() {
        //bottom wall function
        this.init = function() {
            this.x = 0;
            this.y = canvas.height;
            this.w = canvas.width;
            this.h = -35;
            this.color = "#00ef07";
        }

        this.draw = function() {
            //send to draw object
            draw.wall2(this.x, this.y, this.w, this.h, this.color);

            //score and timer kept on this wall, updates every ms
            draw.text("Time: " + time, this.x + 20, this.y - 10, 30, "white");
            draw.text("Score: " + score, 500, this.y - 10, 30, "white");
        }

    };
    /*-----------------BOTTOM WALL-----------------------------------*/

    /*-----------------RECTANGLES-----------------------------------*/
    var randomRectangle = function() {
            //initialize the list of random rectangles
            this.init = function() {
                //speed of the rectangles and player increases for score barriers
                if (score <= 100) {
                    this.speed = 5;
                    playerObject.speed = 10;
                } else if (score <= 200) {
                    this.speed = 10;
                    playerObject.speed = 15;
                } else if (score <= 300) {
                    this.speed = 15;
                    playerObject.speed = 20;
                } else if (score <= 400) {
                    this.speed = 20;
                    playerObject.speed = 25;
                }
                this.x = canvas.width - 50; //appear first 50px to right of canvas hidden
                this.y = Math.floor(Math.random() * 280) + 40; //random y coordinate between walls
                this.w = Math.floor(Math.random() * 100) + 50; //random width from 50-100px
                this.h = Math.floor(Math.random() * 80) + 20; //random height from 20-80px
                this.col = "#b5e61d";
            }
            this.move = function() {
                this.x -= this.speed; //sends the rectangles from the right to the left by the speed increment

                if (this.x < 0) { //if it hits the left side of the screen it is removed from the array
                    rectangleList.splice();
                }

                if (this.collides(player)) { //if it hits the player the game ends
                    gameOver();
                }
            }

            this.draw = function() {
                //send to rectangle draw object
                draw.rectangles(this.x, this.y, this.w, this.h, this.col);
            }

            this.collides = function(obj) {
                //detect collisions with player, creates a "hit-box"
                this.left = this.x;
                this.right = this.x + this.w; //right of the rectangle is the origin + width
                this.top = this.y;
                this.bottom = this.y + this.h; //bottom is origin + height

                obj.left = obj.x + 12; //this is all for detecting the radius of the player with wiggle room
                obj.right = obj.x + obj.r - 12;
                obj.top = obj.y - obj.r + 15;
                obj.bottom = obj.y + obj.r - 12;

                if (this.bottom < obj.top) { //if the player's top touches the bottom of a rect
                    return false;
                }
                if (this.top > obj.bottom) { //if top of rectangle touches bottom of the player
                    return false;
                }
                if (this.right < obj.left) { //if the right side of the object touches the player's left
                    return false;
                }
                if (this.left > obj.right) { //if left side touches player's right
                    return false;
                }

                return true; //no collision
            };
        }
        /*-----------------RECTANGLES-----------------------------------*/

    /*-----------------PLAYER-----------------------------------*/
    var playerObject = function() {
        //initialize player
        this.init = function() {

            this.speed = 10;
            this.x = 50;
            this.y = 220;
            this.r = 25;
            this.color = "red";
            this.stroke = "white";
            this.lineWid = 2;
        }

        this.move = function() {
            //player can only move up and down
            //input is thrown to input function above depending on button pressed
            if (input.up) {
                this.y -= this.speed;
                if (this.y < 25 + this.r) { //if the player touches the top wall, end the game 
                    this.y = 25 + this.r;
                    gameOver();

                }
            }
            if (input.down) {
                this.y += this.speed;
                if (this.y > canvas.height - 25 - this.r) { //if the player touches the bottom wall, end the game
                    this.y = canvas.height - 25 - this.r;
                    //console.log("Game over!");
                    gameOver();


                }
            }
        }

        this.draw = function() {
            draw.circle(this.x, this.y, this.r, this.color, this.stroke, this.lineWid);
        }

    };
    /*-----------------PLAYER-----------------------------------*/

    /*-----------------POWERUP-----------------------------------*/
    var genPowerUp = function() {
            //generate similarly to the random rectangles
            this.init = function() {
                if (score <= 100) {
                    this.speed = 5; //changes the speed based on the score for difficulty tiers
                } else if (score <= 200) {
                    this.speed = 10;
                } else if (score <= 300) {
                    this.speed = 15;
                } else if (score <= 400) {
                    this.speed = 20;
                }
                this.x = canvas.width - 50;
                this.y = Math.floor(Math.random() * 280) + 40;
                this.w = Math.floor(Math.random() * 100) + 50;
                this.h = Math.floor(Math.random() * 80) + 20;
                this.col = "#1d52e6";
                this.strokeCol = '#fff';
                this.strokeWid = 2;
            }
            this.move = function() {
                this.x -= this.speed;

                if (this.x < 0) {
                    powerupList.splice();

                }

                if (this.collides(player)) { //if player collides, score goes up
                    powerUpScore += 1;
                    speedPower = 1;

                }
            }

            this.draw = function() {
                draw.rectangles(this.x, this.y, this.w, this.h, this.col, this.strokeCol, this.strokeWid);
            }

            this.collides = function(obj) {
                this.left = this.x;
                this.right = this.x + this.w;
                this.top = this.y;
                this.bottom = this.y + this.h;

                obj.left = obj.x + 12;
                obj.right = obj.x + obj.r - 12;
                obj.top = obj.y - obj.r + 15;
                obj.bottom = obj.y + obj.r - 12;

                if (this.bottom < obj.top) {
                    return false;
                }
                if (this.top > obj.bottom) {
                    return false;
                }
                if (this.right < obj.left) {
                    return false;
                }
                if (this.left > obj.right) {
                    return false;
                }

                return true;
            };
        }
        /*-----------------POWERUP-----------------------------------*/

    /*-----------------DEBUFF-----------------------------------*/
    var genDebuff = function() {
            //same as the power-ups and random rectangles
            this.init = function() {
                if (score <= 100) {
                    this.speed = 5; //speed set at 5 for 0-100
                } else if (score <= 200) {
                    this.speed = 10; //speed set at 10 for 100-200
                } else if (score <= 300) {
                    this.speed = 15; //speed set at 15 for 200-300
                } else if (score <= 400) {
                    this.speed = 20; //speed set at 20 for 400+
                }
                this.x = canvas.width - 50;
                this.y = Math.floor(Math.random() * 280) + 40;
                this.w = Math.floor(Math.random() * 100) + 50;
                this.h = Math.floor(Math.random() * 80) + 20;
                this.col = "#ff0000";
                this.strokeCol = '#fff';
                this.strokeWid = 2;

            }
            this.move = function() {
                this.x -= this.speed;

                if (this.x < 0) {
                    debuffList.splice();

                }

                if (this.collides(player)) { //if the player collides their score goes down
                    powerUpScore -= 1;
                    speedPower = 1;

                }
            }

            this.draw = function() {
                draw.rectangles(this.x, this.y, this.w, this.h, this.col, this.strokeCol, this.strokeWid);
            }

            this.collides = function(obj) {
                this.left = this.x;
                this.right = this.x + this.w;
                this.top = this.y;
                this.bottom = this.y + this.h;

                obj.left = obj.x + 12;
                obj.right = obj.x + obj.r - 12;
                obj.top = obj.y - obj.r + 15;
                obj.bottom = obj.y + obj.r - 12;

                if (this.bottom < obj.top) {
                    return false;
                }
                if (this.top > obj.bottom) {
                    return false;
                }
                if (this.right < obj.left) {
                    return false;
                }
                if (this.left > obj.right) {
                    return false;
                }

                return true;
            };
        }
        /*-----------------DEBUFF-----------------------------------*/


    /*-----------------ENEMY RECTANGLES GENERATE-----------------------------------*/
    var rectsPerSpawn = 1; //always spawns one rect at a time

    function addRects() {
        for (var i = 0; i < rectsPerSpawn; i++) { //generates 10,000 rectangles, one at a time
            if (rectangleList.length < 10000) {
                var rec = new randomRectangle(); //create new rect object

                rectangleList.push(rec); //push to the list
                rec.init(); //initialize the rectangle object
                songPlayed.play(); //play the song on spawn
            } else if (rectangleList.length == 10000) { //if the list hits 10,000
                rectangleList.splice();
                rec = new randomRectangle(); //make more rectangles
                //"never-ending feeling"
                rectangleList.push(rec);
                rec.init();
            }
        }
    }
    /*-----------------ENEMY RECTANGLES GENERATE-----------------------------------*/

    /*-----------------POWERUP GENERATE-----------------------------------*/
    var powersPerSpawn = 1;

    function addPowerUps() {
        for (var i = 0; i < powersPerSpawn; i++) {
            if (powerupList.length < 5000) {
                var pow = new genPowerUp;

                powerupList.push(pow);
                pow.init();
            }
        }
    }
    /*-----------------POWERUP GENERATE-----------------------------------*/

    /*-----------------DEBUFF GENERATE-----------------------------------*/
    var debuffsPerSpawn = 1;

    function addDebuffs() {
        for (var i = 0; i < debuffsPerSpawn; i++) {
            if (debuffList.length < 5000) {
                var deb = new genDebuff;

                debuffList.push(deb);
                deb.init();

            }
        }
    }
    /*-----------------DEBUFF GENERATE-----------------------------------*/


    /*------------------MENU-----------------------------------*/
    function menu() {
        //draw the start menu
        draw.clear(); //clear the canvas

        $("#startMenu").show(); //if the div is hidden, show it

        $("#startGame").click(function() { //starts the game
            playGame();
        });
        $("#howToPlay").click(function() { //controls
            controls();
        });
        $("#scores").click(function() { //top scores
            scores();
        });
    }
    /*------------------MENU-----------------------------------*/

    /*------------------START GAME-----------------------------------*/
    function playGame() {
        //when the player begins the game
        player = new playerObject(); //make a new player object and initialize
        player.init();

        wall1 = new wallTop(); //make the top and bottoms walls, initialize
        wall1.init();

        wall2 = new wallBottom();
        wall2.init();

        $("#startMenu").hide(); //hide the menu
        TimeMe.resetAllRecordedPageTimes(); //reset the TimeMe Timer
        clearInterval(handle); //clear all current intervals
        clearInterval(spawn);
        clearInterval(addp);
        clearInterval(addb);

        handle = 0; //set all globals and arrays to 0 or empty
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


        player.init(); //initialize the player, walls
        wall1.init();
        wall2.init();
        spawn = setInterval(addRects, 900); //set the rectangles to spawn every 900ms
        handle = setInterval(loop, 30); //the game runs every 30ms
        addp = setInterval(addPowerUps, 4500); //the powerups show up every 4.5s
        addb = setInterval(addDebuffs, 9000); //debuffs show up every 9s

        randomIndexSong = Math.floor(Math.random() * music.length); //pick a new random song
        song = music[randomIndexSong];
        source = song.fileName;

        songPlayed.src = source;
    }
    /*------------------START GAME-----------------------------------*/

    /*------------------INTERVAL FOR DRAWING-----------------------------------*/
    function loop() {
        //this function controls most of the game
        gameStart = true; //flag for the controller to take inputs for the game and not the menu
        draw.clear(); //for animation

        player.draw(); //initialize the player to be drawn and take input to move up/down
        player.move();

        wall1.draw(); //draw walls
        wall2.draw();

        for (var i = 0; i < rectangleList.length; i++) {
            rec = rectangleList[i]; //push the rectangles to be randomly generated and move
            rec.draw();
            rec.move();
        }
        for (var i = 0; i < powerupList.length; i++) {
            pow = powerupList[i]; //push the powerups to be created
            pow.draw();
            pow.move();
        }
        for (var i = 0; i < debuffList.length; i++) {
            deb = debuffList[i]; //push the debuffs to be created
            deb.draw();
            deb.move();
        }

        TimeMe.startTimer("game"); //starts the timer at 0 for a new game

        time = TimeMe.getTimeOnPageInSeconds("game").toFixed(2); //sets the time to seconds with 2 decimal places
        score = Math.floor(powerUpScore + (time * 1.5)); //score is always increasing by 1.5 of time
    }
    /*------------------INTERVAL FOR DRAWING-----------------------------------*/

    /*------------------WAIT AFTER COLLISION-----------------------------------*/
    function wait(timeToWait) {
        //this is invoked after the player collides with a bad object
        var now = new Date().getTime(); //get the current time

        while (new Date().getTime() < now + timeToWait) { //wait however long it is instructed to (1 second)
            //wait x seconds
        }
    }
    /*------------------WAIT AFTER COLLISION-----------------------------------*/

    /*------------------GAME OVER-----------------------------------*/
    function gameOver() {
        //when the game ends
        songPlayed.pause(); //pause the song and set the time to 0
        songPlayed.currentTime = 0;
        TimeMe.stopTimer("game"); //stop the timer

        wait(1000); //wait 1 second

        clearInterval(handle); //clear all intervals and stop game from running
        clearInterval(spawn);
        clearInterval(addp);
        clearInterval(addb);

        handle = 0; //clear all intervals
        spawn = 0;
        addp = 0;
        addb = 0;

        $("#gameOver").show(); //show the game over screen with time and score
        $("#game-over-text").html("GAME OVER!");
        $("#stats").html("Score: " + score + " - Time: " + time + "s");

        $("#startAgain").html("Start Again"); //menu options
        $("#signUp").html("Log Score");
        $("#mainMenu").html("Exit to Main Menu");

        $("#startAgain").click(function() {
            restart(); //start a new game without saving
        });
        $("#signUp").click(function() {
            scores(score, time); //save scores
        });
        $("#mainMenu").click(function() {
            endGame(); //exit the game without saving
        });

    }
    /*------------------GAME OVER-----------------------------------*/

    /*------------------RESTART-----------------------------------*/

    function restart() {
        //if a new game is started
        TimeMe.resetAllRecordedPageTimes(); //reset timer
        clearInterval(handle); //clear all intervals and set to 0
        clearInterval(spawn);
        clearInterval(addp);
        clearInterval(addb);

        handle = 0;
        spawn = 0;
        addp = 0;
        addb = 0;
        score = 0;
        powerUpScore = 0; //set score and time to 0
        time = 0;
        draw.clear();
        rectangleList = []; //clear arrays
        powerupList = [];
        debuffList = [];
        $("#gameOver").hide(); //hide game over menu


        player.init(); //initialize object, set the intervals to start the game up
        wall1.init();
        wall2.init();
        spawn = setInterval(addRects, 900);
        handle = setInterval(loop, 30);
        addp = setInterval(addPowerUps, 4500);
        addb = setInterval(addDebuffs, 9000);

        randomIndexSong = Math.floor(Math.random() * music.length); //pick a new song
        song = music[randomIndexSong];
        source = song.fileName;

        songPlayed.src = source;
    }
    /*------------------RESTART-----------------------------------*/


    /*------------------LOG SCORE-----------------------------------*/
    function scores(time, score) {
        //TODO: Log scores
        $("#startMenu, #controls").hide(); //hide other menus if shown
        $("#scoresList").show();
        $("#titleScores").html("TOP SCORES");
        $("#scoreButton").html("<input type='button' class='button' value='Close' id='hideScores'>");

        $("#hideScores").click(function() {
            $("#scoresList").hide();
            $("#startMenu").show();
        });
    }
    /*------------------LOG SCORE-----------------------------------*/

    /*------------------HOW TO PLAY-----------------------------------*/
    function controls() {
        //shows user how to play the game
        $("#startMenu, #scoresList").hide();
        $("#controls").show();
        $("#titleControls").html("HOW TO PLAY");
        $("#controlsInfo").append("<li>Avoid the rectangles to increase your score!</li>");
        $("#controlsInfo").append("<li>You can either move up/down using W/S, Up-DPad/Down-DPad, or Y/A");
        $("#controlsInfo").append("<li><span style='color:blue'>BLUE</span> rectangles will increase your score, <span style='color:red'>RED</span> ones decrease your score");
        $("#controlsInfo").append("<li>The speed of the game will increase as your score increases, beware!</li>");
        $("#controlsInfo").append("<li><em>Do you think you can escape?</em></li>");
        $("#controlsButton").html("<input type='button' class='button' value='Close' id='hideControls'>");

        $("#hideControls").click(function() {
            $("#controlsInfo").html(""); //clear info box to prevent dupes
            $("#controls").hide();
            $("#startMenu").show();
        });
    }
    /*------------------HOW TO PLAY-----------------------------------*/

    /*------------------EXIT TO MENU-----------------------------------*/
    function endGame() {
        //exit to the main menu w/o saving
        gameStart = false; //set flag to false
        TimeMe.resetAllRecordedPageTimes(); //reset timer
        clearInterval(handle); //clear score, time, intervals
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
        $("#gameOver").hide(); //hide game over menu and show main menu
        menu();
    }
    /*------------------EXIT TO MENU-----------------------------------*/

    /*-----------------PAUSE-----------------------------------*/
    function togglePause(paused) {
        //if paused
        if (paused) {
            songPlayed.pause(); //pause the songs and time

            TimeMe.stopTimer("game");
            clearInterval(handle); //clear the intervals and set to 0
            clearInterval(spawn);
            clearInterval(addp);
            clearInterval(addb);
            handle = 0;
            spawn = 0;
            addp = 0;
            addb = 0;
        } else { //start is pressed again, game unpaused
            songPlayed.play(); //play the song, reset the intervals

            TimeMe.startTimer("game");
            handle = setInterval(loop, 30);
            spawn = setInterval(addRects, 900);
            addp = setInterval(addPowerUps, 4500);
            addb = setInterval(addDebuffs, 9000);
        }

    }
    /*-----------------PAUSE-----------------------------------*/

    /*-----------------READING GAMEPAD INPUT-----------------------------------*/
    function reportOnGamepad() {
        //get input from the gamepad in a set interval of listening
        var gp = navigator.getGamepads()[0];
        var a = gp.buttons[0];
        var y = gp.buttons[3];
        var b = gp.buttons[1];
        var start = gp.buttons[9];
        var select = gp.buttons[8];
        var upDir = gp.buttons[12];
        var downDir = gp.buttons[13];


        if (gameStart) { //if the game is started, the commands process for input and not menus
            if (a.pressed || downDir.pressed) {
                input.up = false;
                input.down = true;
            } else if (y.pressed || upDir.pressed) {
                input.up = true;
                input.down = false;
            } else {
                input.up = false;
                input.down = false;
            }

            if (start.pressed) { //if the game is paused, pause the game and the canvas animation
                if (paused == false) {
                    paused = true;
                    togglePause(paused);
                    ctx.save();
                    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    draw.text("Paused", 300, 240, 30, "white");
                    draw.text("Press Start to resume!", 200, 275, 25, "white");
                    draw.text("Press Select to quit", 230, 300, 20, "white");
                    ctx.restore();
                } else { //when it is unpaused
                    paused = false;
                    togglePause(paused);
                }
            }

            if (paused == true && select.pressed) { //this allows the user to prematurely exit the game
                paused = false;
                togglePause(paused);
                gameOver(); //send game over flag

            }

        } else { //the game is not started yet, process input as menu commands
            if (a.pressed || start.pressed) { //play the game if 'a' or start is pressed
                playGame();
            }

            if (b.pressed) { //show controls if b is pressed
                controls();
            }

            if (y.pressed) { //show top scores if y is pressed
                scores();
            }
        }
    }
    /*-----------------READING GAMEPAD INPUT-----------------------------------*/


    /*-----------------CHECKING FOR GAMEPAD-----------------------------------*/
    if (canGame()) {
        //if there is a gamepad, set a connection event and begin listening every 100ms for input
        $(window).on("gamepadconnected", function() {
            hasGP = true;
            console.log("connection event");
            repGP = window.setInterval(reportOnGamepad, 100);
        });

        $(window).on("gamepaddisconnected", function() { //disconnect event
            console.log("disconnection event");
            $("#gamepadPrompt").text(prompt);
            window.clearInterval(repGP);
        });

        //setup an interval for Chrome
        var checkGP = window.setInterval(function() {
            if (navigator.getGamepads()[0]) {
                //checks ther navigator for a gamepad every 500ms
                if (!hasGP) $(window).trigger("gamepadconnected");
                window.clearInterval(checkGP);
            }
        }, 500);
    }
    /*-----------------CHECKING FOR GAMEPAD-----------------------------------*/
});

/*TODO:
-log scores
-score info
-stylize page a bit?
*/