// constant strings
const TAG_EMPTY = "";
const TAG_BACKGROUND = "background";
const TAG_LEADER = "leader";
const TAG_FOLLOWER = "follower";
const TAG_WALL = "wall";
const TAG_HEALER = "healer";
// Database constants
const MY_NAME = "Jenzel Villanueva";
const SAVE_DATA = "save";
const LOAD_DATA = "load";
const STATE = "State";
// constant numbers
const HUMAN_SPEED = 2; // speed for human characters
const HEALER_SPEED = 3; // speed for healer device
const RUNAWAY_SPEED = 2.45; // speed for running away while in ghost form (Jerry)
const ENEMY_SPEED = 1.98; // speed for enemies/followers
const MULT_SPEED = 2.25; // multiplier for knockback

function Animation(spriteSheet, frameRow, frameCol, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
    this.spriteSheet = spriteSheet; // sprite sheet being used
    this.frameRow = frameRow; // row position in sprite sheet
    this.frameCol = frameCol; // column position in sprite sheet
    this.frameWidth = frameWidth; // width of sprite frame
    this.frameDuration = frameDuration; // how long the animation lasts
    this.frameHeight = frameHeight; // height of sprite frame
    this.sheetWidth = sheetWidth; // number of sprites * frameWidth
    this.frames = frames; // how many frames an animation has
    this.totalTime = frameDuration * frames; // total time of animation
    this.elapsedTime = 0; // amount of time animation has been running
    this.loop = loop; // boolean if the animation loops or not
    this.scale = scale; // scale size of sprite ie: 1 = 100% normal scale
}

Animation.prototype.drawFrame = function (tick, ctx, x, y) {
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
    }
    var frame = this.currentFrame();
    var xindex = 0;
    var yindex = 0;
    xindex = this.frameRow + frame % this.sheetWidth;
    yindex = this.frameCol;

    // draw image onto visible page
    ctx.drawImage(this.spriteSheet,
        xindex * this.frameWidth, yindex * this.frameHeight,  // source from sheet
        this.frameWidth, this.frameHeight,                    // width and height
        x, y,                                                 // position in canvas
        this.frameWidth * this.scale,                         // x (width) scale
        this.frameHeight * this.scale);                       // y (height) scale
}

// returns the current frame the animation is running on
Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

// checks if the animation is done
Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

////////// Entities & Animations //////////
// currently no inheritance from Entity
function Background(game, spritesheet) {
    this.name = TAG_BACKGROUND;

    this.x = 0;
    this.y = 0;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
};

Background.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet,
                   this.x, this.y);
};

Background.prototype.update = function () {
};

// Jerry
function Jerry(game, type, startingPosition, velocity, speed, dirTime, followed, spriteSheet) {
    this.name = TAG_LEADER;
    this.type = type;

    this.frameWidth = 32;
    this.frameHeight = 32;
    this.sheetWidth = 4;
    this.frameDuration = 0.25;
    this.scale = 2;
    // spriteSheet, frameRow, frameCol, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale
    this.animationWalkS  = new Animation(spriteSheet, 0, 0, this.frameWidth, this.frameHeight, this.sheetWidth, this.frameDuration, 2, true, this.scale); // South/Down
    this.animationWalkSW = new Animation(spriteSheet, 2, 0, this.frameWidth, this.frameHeight, this.sheetWidth, this.frameDuration, 2, true, this.scale); // SouthWest/DownLeft
    this.animationWalkW  = new Animation(spriteSheet, 0, 1, this.frameWidth, this.frameHeight, this.sheetWidth, this.frameDuration, 2, true, this.scale); // West/Left
    this.animationWalkNW = new Animation(spriteSheet, 2, 1, this.frameWidth, this.frameHeight, this.sheetWidth, this.frameDuration, 2, true, this.scale); // NorthWest/UpLeft
    this.animationWalkN  = new Animation(spriteSheet, 0, 2, this.frameWidth, this.frameHeight, this.sheetWidth, this.frameDuration, 2, true, this.scale); // North/Up
    this.animationWalkNE = new Animation(spriteSheet, 2, 2, this.frameWidth, this.frameHeight, this.sheetWidth, this.frameDuration, 2, true, this.scale); // NorthEast/UpRight
    this.animationWalkE  = new Animation(spriteSheet, 0, 3, this.frameWidth, this.frameHeight, this.sheetWidth, this.frameDuration, 2, true, this.scale); // East/Right
    this.animationWalkSE = new Animation(spriteSheet, 2, 3, this.frameWidth, this.frameHeight, this.sheetWidth, this.frameDuration, 2, true, this.scale); // SouthEast/DownRight
    // Ghost Sprites
    this.animationGhostS  = new Animation(spriteSheet, 0, 4, this.frameWidth, this.frameHeight, this.sheetWidth, this.frameDuration, 1, true, this.scale); // South/Down
    this.animationGhostSW = new Animation(spriteSheet, 1, 4, this.frameWidth, this.frameHeight, this.sheetWidth, this.frameDuration, 1, true, this.scale); // SouthWest/DownLeft
    this.animationGhostW  = new Animation(spriteSheet, 2, 4, this.frameWidth, this.frameHeight, this.sheetWidth, this.frameDuration, 1, true, this.scale); // West/Left
    this.animationGhostNW = new Animation(spriteSheet, 3, 4, this.frameWidth, this.frameHeight, this.sheetWidth, this.frameDuration, 1, true, this.scale); // NorthWest/UpLeft
    this.animationGhostN  = new Animation(spriteSheet, 0, 5, this.frameWidth, this.frameHeight, this.sheetWidth, this.frameDuration, 1, true, this.scale); // North/Up
    this.animationGhostNE = new Animation(spriteSheet, 1, 5, this.frameWidth, this.frameHeight, this.sheetWidth, this.frameDuration, 1, true, this.scale); // NorthEast/UpRight
    this.animationGhostE  = new Animation(spriteSheet, 2, 5, this.frameWidth, this.frameHeight, this.sheetWidth, this.frameDuration, 1, true, this.scale); // East/Right
    this.animationGhostSE = new Animation(spriteSheet, 3, 5, this.frameWidth, this.frameHeight, this.sheetWidth, this.frameDuration, 1, true, this.scale); // SouthEast/DownRight
    
    this.animation = this.animationWalkS; // this.animation must be used for initial animation
    this.x = startingPosition.x; // position x on the screen
    this.y = startingPosition.y; // position y on the screen
    this.speed = speed;
    this.velocity = velocity;
    this.game = game;
    this.ctx = game.ctx;

    this.dirTime = dirTime;
    this.dirTimer = this.dirTime;
    
    this.followed = followed;

    this.boxScale = 4;
}

Jerry.prototype.draw = function () {
    if (this.game.showOutlines) { // Draws collider border for debugging
        this.ctx.strokeStyle = "blue";
        this.ctx.strokeRect(this.box.x,this.box.y,this.box.width,this.box.height);
    }

    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
}

Jerry.prototype.update = function () {
    // Box must be set here. Otherwise, it does not move
    this.box = new BoundingBox(this.x, this.y, this.frameWidth*this.scale, this.frameHeight*this.scale, TAG_LEADER);

    if (this.dirTimer < 0) {
        // Updates position
        this.velocity.x = (Math.round(Math.random() * 2) - 1) * this.speed;
        this.velocity.y = (Math.round(Math.random() * 2) - 1) * this.speed;
        //console.log(this.velocity.x + " , " + this.velocity.y);

        // retry if velocity causes character to stop moving
        while (this.velocity.x == 0 && this.velocity.y == 0) {
            this.velocity.x = (Math.round(Math.random() * 2) - 1) * this.speed;
            this.velocity.y = (Math.round(Math.random() * 2) - 1) * this.speed;
            //console.log(this.velocity.x + " , " + this.velocity.y);
        }
        
        this.dirTimer = this.dirTime;
    } else {
        this.dirTimer -= this.game.clockTick;
    }

    this.x += this.velocity.x;
    this.y += this.velocity.y;

    this.box.x = this.x;
    this.box.y = this.y;

    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        var tempBox = new BoundingBox(this.box.x, this.box.y, this.box.width, this.box.height, this.tag);
        var collide = tempBox.collide(ent.box); // The collision results

        if (ent != this && collide.object == TAG_WALL) { // entity collided with north wall
            if (collide.left) {
                this.velocity.x = this.speed;
                this.velocity.y = 0;
                //console.log("Jerry's left");
            }
            if (collide.right) {
                this.velocity.x = -this.speed;
                this.velocity.y = 0;
                //console.log("Jerry's right");
            }
            if (collide.top) {
                this.velocity.x = 0;
                this.velocity.y = this.speed;
                //console.log("Jerry's top");
            }
            if (collide.bottom) {
                this.velocity.x = 0;
                this.velocity.y = -this.speed;
                //console.log("Jerry's bottom");
            }
        } else if (ent != this && collide.object == TAG_FOLLOWER) {
            var multiplier = MULT_SPEED;
            if (!this.followed) {
                if (collide.left) {
                    this.velocity.x = this.speed * multiplier;
                    //console.log("Jerry's left");
                }
                if (collide.right) {
                    this.velocity.x = -this.speed * multiplier;
                    //console.log("Jerry's right");
                }
                if (collide.top) {
                    this.velocity.y = this.speed * multiplier;
                    //console.log("Jerry's top");
                }
                if (collide.bottom) {
                    this.velocity.y = -this.speed * multiplier;
                    //console.log("Jerry's bottom");
                }
                this.speed = RUNAWAY_SPEED;
                this.followed = true;
            }
        } else if (ent != this && collide.object == TAG_HEALER) {
            if (this.followed) {
                this.speed = HUMAN_SPEED;
                this.followed = false;
            }
            
        }
    }

    // Animation
    if (this.velocity.x > 0) { // moving towards the right/east
        this.animation = this.animationWalkE;
        if (this.followed) {
            this.animation = this.animationGhostE;
        }
    }
    if (this.velocity.x < 0) { // moving towards the left/west
        this.animation = this.animationWalkW;
        if (this.followed) {
            this.animation = this.animationGhostW;
        }
    }
    if (this.velocity.y > 0) { // moving towards the bottom/south
        this.animation = this.animationWalkS;
        if (this.followed) {
            this.animation = this.animationGhostS;
        }
    }
    if (this.velocity.y < 0) { // moving towards the top/north
        this.animation = this.animationWalkN;
        if (this.followed) {
            this.animation = this.animationGhostN;
        }
    }
    if (this.velocity.x > 0 && this.velocity.y < 0) { // moving towards the top right/northeast
        this.animation = this.animationWalkNE;
        if (this.followed) {
            this.animation = this.animationGhostNE;
        }
    }
    if (this.velocity.x < 0 && this.velocity.y < 0) { // moving towards the top left/northwest
        this.animation = this.animationWalkNW;
        if (this.followed) {
            this.animation = this.animationGhostNW;
        }
    }
    if (this.velocity.x > 0 && this.velocity.y > 0) { // moving towards the bottom right/southeast
        this.animation = this.animationWalkSE;
        if (this.followed) {
            this.animation = this.animationGhostSE;
        }
    }
    if (this.velocity.x < 0 && this.velocity.y > 0) { // moving towards the bottom left/southwest
        this.animation = this.animationWalkSW;
        if (this.followed) {
            this.animation = this.animationGhostSW;
        }
    }
}

Jerry.prototype.sendData = function (socket, state) {
    var jerryData = { type: this.type, x: this.x, y: this.y, velocity: this.velocity, speed: this.speed, dirTime: this.dirTime, followed: this.followed };

    socket.emit(state, { studentname: MY_NAME, statename: this.name + this.type + STATE, data: jerryData });
}

Jerry.prototype.getData = function (socket, state) {
    socket.emit(state, { studentname: MY_NAME, statename: this.name + this.type + STATE });
}


// Enemy Follower
function Enemy(game, id, type, startingPosition, velocity, frameWidth, frameHeight, speed, dirTime, spriteSheet) {
    this.id = id;
    this.type = type;
    this.name = TAG_FOLLOWER;

    // spriteSheet, frameRow, frameCol, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;
    this.sheetWidth = 2;
    this.frameDuration = 0.125;
    this.scale = 2;

    this.animationWalkS  = new Animation(spriteSheet, 0, 0, this.frameWidth, this.frameHeight, this.sheetWidth, this.frameDuration, 2, true, this.scale); // South/Down

    this.animation = this.animationWalkS; // this.animation must be used for initial animation
    this.x = startingPosition.x; // position x on the screen
    this.y = startingPosition.y; // position y on the screen
    this.speed = speed;
    this.velocity = velocity;
    this.game = game;
    this.ctx = game.ctx;

    this.dirTime = dirTime;
    this.dirTimer = this.dirTime;
    
}

Enemy.prototype.draw = function () {
    if (this.game.showOutlines) { // Draws collider border for debugging
        this.ctx.strokeStyle = "red";
        this.ctx.strokeRect(this.box.x,this.box.y,this.box.width,this.box.height);

        // Visualization of temp box
        this.ctx.strokeStyle = "green";
        this.ctx.strokeRect(this.box.x-this.box.width,
                            this.box.y-this.box.height,
                            this.box.width*3,
                            this.box.height*3);
    }

    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
}

Enemy.prototype.update = function () {
    this.box = new BoundingBox(this.x, this.y, this.frameWidth*this.scale, this.frameHeight*this.scale, TAG_FOLLOWER);

    if (this.dirTimer < 0) {
        // Updates position
        this.velocity.x = (Math.round(Math.random() * 2) - 1) * this.speed;
        this.velocity.y = (Math.round(Math.random() * 2) - 1) * this.speed;
        //console.log(this.velocity.x + " , " + this.velocity.y);

        // retry if velocity causes character to stop moving
        while (this.velocity.x == 0 && this.velocity.y == 0) {
            this.velocity.x = (Math.round(Math.random() * 2) - 1) * this.speed;
            this.velocity.y = (Math.round(Math.random() * 2) - 1) * this.speed;
            //console.log(this.velocity.x + " , " + this.velocity.y);
        }
        
        this.dirTimer = this.dirTime;
    } else {
        this.dirTimer -= this.game.clockTick;
    }

    // Updates position
    this.x += this.velocity.x;
    this.y += this.velocity.y;

    this.box.x = this.x;
    this.box.y = this.y;

    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        var tempBox = new BoundingBox(this.box.x-this.box.width,
            this.box.y-this.box.height,
            this.box.width*3,
            this.box.height*3, this.tag);
        var collide = tempBox.collide(ent.box); // The collision results

        if (ent != this && collide.object == TAG_WALL) { // entity collided with north wall
            if (collide.left) {
                this.velocity.x = this.speed;
                this.velocity.y = 0;
                //console.log("Enemy's left");
            }
            if (collide.right) {
                this.velocity.x = -this.speed;
                this.velocity.y = 0;
                //console.log("Enemy's right");
            }
            if (collide.top) {
                this.velocity.x = 0;
                this.velocity.y = this.speed;
                //console.log("Enemy's top");
            }
            if (collide.bottom) {
                this.velocity.x = 0;
                this.velocity.y = -this.speed;
                //console.log("Enemy's bottom");
            }
        } else if (ent != this && collide.object == TAG_LEADER) { // follow the leader
            if (collide.left) {
                this.velocity.x = -this.speed;
                //console.log("Enemy's left");
            }
            if (collide.right) {
                this.velocity.x = this.speed;
                //console.log("Enemy's right");
            }
            if (collide.top) {
                this.velocity.y = -this.speed;
                //console.log("Enemy's top");
            }
            if (collide.bottom) {
                this.velocity.y = this.speed;
                //console.log("Enemy's bottom");
            }
        }
        else if (ent != this && collide.object == TAG_FOLLOWER) { // avoid other followers
            if (collide.left) {
                this.velocity.x = this.speed;
                //console.log("Enemy's left");
            }
            if (collide.right) {
                this.velocity.x = -this.speed;
                //console.log("Enemy's right");
            }
            if (collide.top) {
                this.velocity.y = this.speed;
                //console.log("Enemy's top");
            }
            if (collide.bottom) {
                this.velocity.y = -this.speed;
                //console.log("Enemy's bottom");
            }
        }
    }

}

Enemy.prototype.sendData = function (socket, state) {
    var enemyData = { id: this.id, type: this.type, x: this.x, y: this.y, velocity: this.velocity, frameWidth: this.frameWidth, frameHeight: this.frameHeight, speed: this.speed, dirTime: this.dirTime };

    socket.emit(state, { studentname: MY_NAME, statename: this.name + this.type + this.id + STATE, data: enemyData });
}

Enemy.prototype.getData = function (socket, state) {
    socket.emit(state, { studentname: MY_NAME, statename: this.name + this.type + this.id + STATE });
}


// Healer
function Healer(game, id, type, startingPosition, velocity, frameWidth, frameHeight, speed, dirTime, spriteSheet) {
    this.id = id;
    this.type = type;
    this.name = TAG_HEALER;

    // spriteSheet, frameRow, frameCol, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;
    this.sheetWidth = 2;
    this.frameDuration = 0.25;
    this.scale = 2;

    this.animationWalkS  = new Animation(spriteSheet, 0, 0, this.frameWidth, this.frameHeight, this.sheetWidth, this.frameDuration, 2, true, this.scale); // South/Down

    this.animation = this.animationWalkS; // this.animation must be used for initial animation
    this.x = startingPosition.x; // position x on the screen
    this.y = startingPosition.y; // position y on the screen
    this.speed = speed;
    this.velocity = velocity;
    this.game = game;
    this.ctx = game.ctx;

    this.dirTime = dirTime;
    this.dirTimer = this.dirTime;
    
}

Healer.prototype.draw = function () {
    if (this.game.showOutlines) { // Draws collider border for debugging
        this.ctx.strokeStyle = "blue";
        this.ctx.strokeRect(this.box.x,this.box.y,this.box.width,this.box.height);

        // Visualization of temp box
        this.ctx.strokeStyle = "green";
        this.ctx.strokeRect(this.box.x-this.box.width,
                            this.box.y-this.box.height,
                            this.box.width*3,
                            this.box.height*3);
    }

    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
}

Healer.prototype.update = function () {
    this.box = new BoundingBox(this.x, this.y, this.frameWidth*this.scale, this.frameHeight*this.scale, TAG_HEALER);

    if (this.dirTimer < 0) {
        // Updates position
        this.velocity.x = (Math.round(Math.random() * 2) - 1) * this.speed;
        this.velocity.y = (Math.round(Math.random() * 2) - 1) * this.speed;
        //console.log(this.velocity.x + " , " + this.velocity.y);

        // retry if velocity causes character to stop moving
        while (this.velocity.x == 0 && this.velocity.y == 0) {
            this.velocity.x = (Math.round(Math.random() * 2) - 1) * this.speed;
            this.velocity.y = (Math.round(Math.random() * 2) - 1) * this.speed;
            //console.log(this.velocity.x + " , " + this.velocity.y);
        }
        
        this.dirTimer = this.dirTime;
    } else {
        this.dirTimer -= this.game.clockTick;
    }

    // Updates position
    this.x += this.velocity.x;
    this.y += this.velocity.y;

    this.box.x = this.x;
    this.box.y = this.y;

    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        var tempBox = new BoundingBox(this.box.x-this.box.width,
            this.box.y-this.box.height,
            this.box.width*3,
            this.box.height*3, this.tag);
        var collide = tempBox.collide(ent.box); // The collision results

        if (ent != this && collide.object == TAG_WALL) { // entity collided with north wall
            if (collide.left) {
                this.velocity.x = this.speed;
                this.velocity.y = 0;
            }
            if (collide.right) {
                this.velocity.x = -this.speed;
                this.velocity.y = 0;
            }
            if (collide.top) {
                this.velocity.x = 0;
                this.velocity.y = this.speed;
            }
            if (collide.bottom) {
                this.velocity.x = 0;
                this.velocity.y = -this.speed;
            }
        }
    }

}

Healer.prototype.sendData = function (socket, state) {
    var healerData = { id: this.id, type: this.type, x: this.x, y: this.y, velocity: this.velocity, frameWidth: this.frameWidth, frameHeight: this.frameHeight, speed: this.speed, dirTime: this.dirTime };

    socket.emit(state, { studentname: MY_NAME, statename: this.name + this.type + this.id + STATE, data: healerData });
}

Healer.prototype.getData = function (socket, state) {
    socket.emit(state, { studentname: MY_NAME, statename: this.name + this.type + this.id + STATE });
}


// Boundary Walls
function Wall(game, x, y, width, height) {
    this.name = TAG_WALL;

    this.x = x; // position x on the screen
    this.y = y; // position y on the screen
    this.width = width;
    this.height = height;
    this.game = game;
    this.ctx = game.ctx;

    this.box = new BoundingBox(this.x, this.y, this.width, this.height, TAG_WALL);

}

// Wall
Wall.prototype.draw = function () {
    if (this.game.showOutlines) { // Draws collider border for debugging
        this.ctx.strokeStyle = "red";
        this.ctx.strokeRect(this.box.x,this.box.y,this.box.width,this.box.height);
    }
}

Wall.prototype.update = function () {
}

// "main" code

var AM = new AssetManager();

////////// Loading in images //////////
AM.queueDownload("./Homework3/img/JerryWalk.png");
AM.queueDownload("./Homework3/img/background.png");
AM.queueDownload("./Homework3/img/TestCharacter.png");
AM.queueDownload("./Homework3/img/DinoEnemy.png");
AM.queueDownload("./Homework3/img/SnowmanEnemy.png");
AM.queueDownload("./Homework3/img/DuckEnemy.png");
AM.queueDownload("./Homework3/img/BulletCannon.png");

AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");
    const btnShowBoxes = document.getElementById("show_box_btn");
    ctx.imageSmoothingEnabled = false; // disables pixel smoothing/blurring

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();

    btnShowBoxes.addEventListener('click', function () { // Activates Debug Mode on click
        gameEngine.showBoxes();
    });

    gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./Homework3/img/background.png")));
    gameEngine.addEntity(new Jerry(gameEngine, "Jerry", {x: 640, y: 360}, {x: 0, y: HUMAN_SPEED}, HUMAN_SPEED, 2.5, false, AM.getAsset("./Homework3/img/JerryWalk.png")));
    gameEngine.addEntity(new Enemy(gameEngine, 0, "Dino", {x: 200, y: 500}, { x: ENEMY_SPEED, y: 0}, 37, 56, ENEMY_SPEED, 3, AM.getAsset("./Homework3/img/DinoEnemy.png")));
    gameEngine.addEntity(new Enemy(gameEngine, 1, "Snow", {x: 1000, y: 100}, { x: ENEMY_SPEED, y: 0}, 42, 42, ENEMY_SPEED, 2.5, AM.getAsset("./Homework3/img/SnowmanEnemy.png")));
    gameEngine.addEntity(new Enemy(gameEngine, 2, "Duck", {x: 1000, y: 600}, { x: ENEMY_SPEED, y: 0}, 47, 37, ENEMY_SPEED, 1.5, AM.getAsset("./Homework3/img/DuckEnemy.png")));
    gameEngine.addEntity(new Healer(gameEngine, 0, "TestChar", {x: 100, y: 100}, { x: -HUMAN_SPEED, y: 0}, 16, 21, HUMAN_SPEED, 2, AM.getAsset("./Homework3/img/TestCharacter.png")));
    gameEngine.addEntity(new Healer(gameEngine, 1, "Machine", {x: 640, y: 100}, { x: -HEALER_SPEED, y: 0}, 19, 19, HEALER_SPEED, 2.5, AM.getAsset("./Homework3/img/BulletCannon.png")));
    gameEngine.addEntity(new Healer(gameEngine, 2, "Machine", {x: 640, y: 100}, { x: -HEALER_SPEED, y: 0}, 19, 19, HEALER_SPEED, 2.5, AM.getAsset("./Homework3/img/BulletCannon.png")));
    gameEngine.addEntity(new Healer(gameEngine, 3, "Machine", {x: 640, y: 100}, { x: -HEALER_SPEED, y: 0}, 19, 19, HEALER_SPEED, 2.5, AM.getAsset("./Homework3/img/BulletCannon.png")));

    var screenWidth = 1280
    var screenHeight = 720;
    var wallWidth = 20;
    // vertical walls
    gameEngine.addEntity(new Wall(gameEngine, 0, 0, wallWidth, screenWidth));
    gameEngine.addEntity(new Wall(gameEngine, screenWidth - wallWidth, 0, wallWidth, screenWidth));
    // horizontal walls
    gameEngine.addEntity(new Wall(gameEngine, 0, 0, screenWidth, wallWidth));
    gameEngine.addEntity(new Wall(gameEngine, 0, screenHeight - wallWidth, screenWidth, wallWidth));

    var socket = io.connect("http://24.16.255.56:8888");

    socket.on(LOAD_DATA, function (dat) {
        //console.log(dat);
        
        // Now load in the new ones
        if (dat.data.type == "Jerry") {
            gameEngine.addEntity(new Jerry(gameEngine, dat.data.type, {x: dat.data.x, y: dat.data.y}, dat.data.velocity, dat.data.speed, dat.data.dirTime, dat.data.followed, AM.getAsset("./Homework3/img/JerryWalk.png")));
            console.log("added Jerry");
        }
        if (dat.data.type == "Dino") {
            gameEngine.addEntity(new Enemy(gameEngine, dat.data.id, dat.data.type, {x: dat.data.x, y: dat.data.y}, dat.data.velocity, dat.data.frameWidth, dat.data.frameHeight, dat.data.speed, dat.data.dirTime, AM.getAsset("./Homework3/img/DinoEnemy.png")));
            console.log("added Dino");
        }
        if (dat.data.type == "Snow") {
            gameEngine.addEntity(new Enemy(gameEngine, dat.data.id, dat.data.type, {x: dat.data.x, y: dat.data.y}, dat.data.velocity, dat.data.frameWidth, dat.data.frameHeight, dat.data.speed, dat.data.dirTime, AM.getAsset("./Homework3/img/SnowmanEnemy.png")));
            console.log("added Snow");
        }
        if (dat.data.type == "Duck") {
            gameEngine.addEntity(new Enemy(gameEngine, dat.data.id, dat.data.type, {x: dat.data.x, y: dat.data.y}, dat.data.velocity, dat.data.frameWidth, dat.data.frameHeight, dat.data.speed, dat.data.dirTime, AM.getAsset("./Homework3/img/DuckEnemy.png")));
            console.log("added Duck");
        }
        if (dat.data.type == "TestChar") {
            gameEngine.addEntity(new Healer(gameEngine, dat.data.id, dat.data.type, {x: dat.data.x, y: dat.data.y}, dat.data.velocity, dat.data.frameWidth, dat.data.frameHeight, dat.data.speed, dat.data.dirTime, AM.getAsset("./Homework3/img/TestCharacter.png")));
            console.log("added TestChar");
        }
        if (dat.data.type == "Machine") {
            gameEngine.addEntity(new Healer(gameEngine, dat.data.id, dat.data.type, {x: dat.data.x, y: dat.data.y}, dat.data.velocity, dat.data.frameWidth, dat.data.frameHeight, dat.data.speed, dat.data.dirTime, AM.getAsset("./Homework3/img/BulletCannon.png")));
            console.log("added Machine");
        }
    });
  
    var text = document.getElementById("text");
    var saveButton = document.getElementById("save_btn");
    var loadButton = document.getElementById("load_btn");
    
    saveButton.onclick = function () {
        console.log(SAVE_DATA);
        text.innerHTML = "Saved."

        for (var i = 0; i < gameEngine.entities.length; i++) {
            var ent = gameEngine.entities[i];

            if (ent.name == TAG_LEADER || ent.name.includes(TAG_FOLLOWER) || ent.name.includes(TAG_HEALER)) {
                ent.sendData(socket, SAVE_DATA);
            }
        }
    };
    
    loadButton.onclick = function () {
        console.log(LOAD_DATA);
        text.innerHTML = "Loaded."

        for (var i = 0; i < gameEngine.entities.length; i++) {
            var ent = gameEngine.entities[i];

            if (ent.name == TAG_LEADER || ent.name.includes(TAG_FOLLOWER) || ent.name.includes(TAG_HEALER)) {
                // Delete the old entity
                gameEngine.entities.splice(i, 1);
                i--;
                // Get the data
                ent.getData(socket, LOAD_DATA);
            }
        }
    };

    //console.log(socket);
    console.log("All Done!");
});