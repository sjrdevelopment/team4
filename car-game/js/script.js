$(document).ready(function() {
	//init Crafty with FPS of 50 and create the canvas element
	Crafty.init(1024,768);
	Crafty.canvas.init();
	
	//preload the needed assets
	Crafty.load(["images/car_64.png", "images/bg.png"], function() {
		//splice the spritemap
		Crafty.sprite(64, "images/car_64.png", {
			car: [0,0]
		});

		//Crafty.audio.add("Blaster", ["space-blaster.wav", "space-blaster.mp3"])
		
		//start the main scene when loaded
		Crafty.scene("main");
	});
	
	Crafty.scene("main", function() {
		Crafty.background("url('images/bg.png')");
		
		//score display
		var score = Crafty.e("2D, DOM, Text")
			.text("Score: 0")
			.attr({x: Crafty.viewport.width - 300, y: Crafty.viewport.height - 50, w: 200, h:50})
			.css({color: "#fff"});

		var player = [];
			
		//player entity
		for(i = 0; i < 5; i++){
			var x = 40+60*(i%3),
				y = i < 3 ? 320 : i < 6 ? 420 : 520;

				player[i] = Crafty.e("2D, Canvas, car, Controls, Collision")
				.attr({move: {left: false, right: false, up: false, down: false}, xspeed: 0, yspeed: 0, decay: 0.0,
					x: x, y: y, score: 0})
				.origin("center")
				.bind("KeyDown", function(e) {
					//on keydown, set the move booleans
					if(e.keyCode === Crafty.keys.RIGHT_ARROW) {
						this.move.right = true;
					} else if(e.keyCode === Crafty.keys.LEFT_ARROW) {
						this.move.left = true;
					} else if(e.keyCode === Crafty.keys.UP_ARROW) {
						this.move.up = true;
					} else if (e.keyCode === Crafty.keys.SPACE) {
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
				}).bind("KeyUp", function(e) {
					//on key up, set the move booleans to false
					if(e.keyCode === Crafty.keys.RIGHT_ARROW) {
						this.move.right = false;
					} else if(e.keyCode === Crafty.keys.LEFT_ARROW) {
						this.move.left = false;
					} else if(e.keyCode === Crafty.keys.UP_ARROW) {
						this.move.up = false;
					}
				}).bind("EnterFrame", function() {
					if(this.move.right) this.rotation += 5;
					if(this.move.left) this.rotation -= 5;
					
					//acceleration and movement vector
					var vx = Math.sin(this._rotation * Math.PI / 180) * 0.1,
						vy = Math.cos(this._rotation * Math.PI / 180) * 0.1;
					
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

		//Collision Entity
		Crafty.e('collision1, 2D, Canvas')
			.attr({x: 245, y: 245, w: 275, h: 275});

		Crafty.e('collision2, 2D, Canvas')
			.attr({x: 520, y: 240, w: 260, h: 30});

		Crafty.e('collision3, 2D, Canvas')
			.attr({x: 750, y: 490, w: 260, h: 260});
	});
	
});
