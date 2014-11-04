$(document).ready(function() {
	//init Crafty with FPS of 50 and create the canvas element
	Crafty.init(1024,768);
	Crafty.canvas.init();
	
	//preload the needed assets
	////['blue', 'green', 'grey', 'olive', 'orange', 'purple', 'red', 'white', 'yellow']
	
	Crafty.load(["images/all_cars/car-yellow.png",
				"images/all_cars/car-white.png",
				"images/all_cars/car-blue.png",
				"images/all_cars/car-green.png",
				"images/all_cars/car-grey.png",
				"images/all_cars/car-olive.png",
				"images/all_cars/car-orange.png",
				"images/all_cars/car-purple.png",
				"images/all_cars/car-red.png",
				"images/bg.png"], function() {
		//splice the spritemap
		Crafty.sprite(64, "images/all_cars/car-yellow.png", {
			yellow: [0,0]
		});

		Crafty.sprite(64, "images/all_cars/car-white.png", {
			white: [0,0]
		});

		Crafty.sprite(64, "images/all_cars/car-blue.png", {
			blue: [0,0]
		});

		Crafty.sprite(64, "images/all_cars/car-green.png", {
			green: [0,0]
		});

		Crafty.sprite(64, "images/all_cars/car-grey.png", {
			grey: [0,0]
		});

		Crafty.sprite(64, "images/all_cars/car-olive.png", {
			olive: [0,0]
		});

		Crafty.sprite(64, "images/all_cars/car-orange.png", {
			orange: [0,0]
		});

		Crafty.sprite(64, "images/all_cars/car-purple.png", {
			purple: [0,0]
		});

		Crafty.sprite(64, "images/all_cars/car-red.png", {
			red: [0,0]
		});

		//Crafty.audio.add("Blaster", ["space-blaster.wav", "space-blaster.mp3"])
		
		//start the main scene when loaded
		Crafty.scene("main");
	});
	
	Crafty.scene("main", function() {
		Crafty.background("url('images/bg.png')");

		var player = [];

		socket = io.connect('http://10.192.62.240:8083');

		socket.on('connect',function(){
			console.info('connected successfully - waiting for player to join');

			socket.on('beginGame', function (allPlayers) {
				console.log("game begin with - ",allPlayers);
				var i;
				for(i = 0; i < allPlayers.length; i++){
					console.info(allPlayers[i].playerId);
					addPlayer(i,allPlayers[i].playerId,allPlayers[i].playerColor);
				}
				//accelerating(carEvent.socketID,carEvent.movementValue);
			});

			/*addPlayer(this.socket.sessionid);
			console.info(this.socket.sessionid);
			console.log('user added to game with socket: ', socket);
			*/
			socket.on('ggTurning', function (carEvent) {
				//console.log('Car ID ' + carEvent.socketID + ' is turning by ' + carEvent.movementValue);
				turning(carEvent.socketID,carEvent.movementValue);
			});

			socket.on('ggAcceleration', function (carEvent) {
				//console.log('Car ID ' + carEvent.socketID + ' is accelerating by ' + carEvent.movementValue);
				accelerating(carEvent.socketID,carEvent.movementValue);
			});
		});

		function addPlayer(indx,sessionId,color){
			var x = 40+60*( indx %3),
			y = indx < 3 ? 320 : indx < 6 ? 420 : 520;
			
			player[sessionId] = Crafty.e("2D, Canvas, "+color+", Controls, Collision")
				.attr({move: {left: false, right: false, up: false, down: false}, xspeed: 0, yspeed: 0, decay: 0.5,
					x: x, y: y, score: 0})
				.origin("center")
				.bind("EnterFrame", function() {
					//if(this.move.right) this.rotation += 5;
					//if(this.move.left) this.rotation -= 5;
					
					//acceleration and movement vector
					var vx = Math.sin(this.rotation * Math.PI / 180) * 0.1,
						vy = Math.cos(this.rotation * Math.PI / 180) * 0.1;
					
					//if the move up is true, increment the y/xspeeds
					if(this.move.up) {
						this.yspeed -= vy;
						this.xspeed += vx;
					} else {
						//if released, slow down the car
						this.xspeed *= this.decay;
						this.yspeed *= this.decay;
					}

					this._prevX = this.x;
					this._prevY = this.y;
					
					//move the car by the x and y speeds or movement vector 
					this.x += this.xspeed;
					this.y += this.yspeed;
					
					//if car goes out of bounds, put him back
					if(this._x > Crafty.viewport.width-(15+64)) {
						this.x = Crafty.viewport.width - (15+64);
					}
					if(this._x < 15) {
						this.x =  15;
					}
					if(this._y > Crafty.viewport.height-(15+64)) {
						this.y = Crafty.viewport.height - (15+64);
					}
					if(this._y < 15) {
						this.y = 15;
					}
				}).collision()
				.onHit("collision1", function() {
					console.info('collision 1');
					// this.x = this._prevX;
					// this.y = this._prevY;
					this.xspeed = 0;
					this.yspeed = 0;
					
				}).onHit("collision2", function() {
					console.info('collision 2');
					this.xspeed = 0;
					this.yspeed = 0;
				}).onHit("collision3", function() {
					console.info('collision 3');
					this.xspeed = 0;
					this.yspeed = 0;
				});
		}

		function turning(sessionId,val){
			player[sessionId].move.right = false;
				player[sessionId].move.left = false;
			if(val > 0){ //right
				player[sessionId].move.right = true;
				player[sessionId].rotation += val*5;
			}else if(val < 0){//left 
				player[sessionId].move.left = true;
				player[sessionId].rotation += val*5;
			}
		}

		function accelerating(sessionId,val){
			// player[sessionId].move.up
			if(val > 0){
				player[sessionId].move.up = true;
				//player[sessionId].yspeed = -val*5;
			}
			else{
				player[sessionId].move.up = false;
				//player[sessionId].yspeed = -val*2;
			}
		}

		/*
		.bind("KeyDown", function(e) {
			//on keydown, set the move booleans
			if(e.keyCode === Crafty.keys.RIGHT_ARROW) {
				this.move.right = true;
			} else if(e.keyCode === Crafty.keys.LEFT_ARROW) {
				this.move.left = true;
			} else if(e.keyCode === Crafty.keys.UP_ARROW) {
				this.move.up = true;
			} 
		}).bind("KeyUp", function(e) {
			//on key up, set the move booleans to false
			if(e.keyCode === Crafty.keys.RIGHT_ARROW) {
				this.move.right = false;
			} else if(e.keyCode === Crafty.keys.LEFT_ARROW) {
				this.move.left = false;
			} else if(e.keyCode === Crafty.keys.UP_ARROW) {
				this.move.up = false;
			}
		})
		 */
		
		/*
		//Bullet
		if (e.keyCode === Crafty.keys.SPACE) {
						//console.log("Blast");
						//Crafty.audio.play("Blaster");
						//create a bullet entity
						Crafty.e("2D, DOM, Color, bullet")
							.attr({
								x: this._x+32,
								y: this._y+32,
								w: 2,
								h: 5,
								rotation: this._rotation,
								xspeed: 20 * Math.sin(this._rotation / 57.3),
								yspeed: 20 * Math.cos(this._rotation / 57.3)
							})
							.color("rgb(255, 0, 0)")
							.bind("EnterFrame", function() {
								this.x += this.xspeed;
								this.y -= this.yspeed;
								
								//destroy if it goes out of bounds
								if(this._x > Crafty.viewport.width || this._x < 0 || this._y > Crafty.viewport.height || this._y < 0) {
									this.destroy();
								}
							});
					}
		 */
		

		//Collision Entity
		Crafty.e('collision1, 2D, Canvas')
			.attr({x: 245, y: 245, w: 275, h: 275});

		Crafty.e('collision2, 2D, Canvas')
			.attr({x: 520, y: 240, w: 260, h: 30});

		Crafty.e('collision3, 2D, Canvas')
			.attr({x: 750, y: 490, w: 260, h: 260});
	});
	
});
