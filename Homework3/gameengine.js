window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (/* function */ callback, /* DOMElement */ element) {
                window.setTimeout(callback, 1000 / 60);
            };
})();

function GameEngine() {
    this.entities = [];
    this.showOutlines = false;
    this.ctx = null;
    this.surfaceWidth = null;
    this.surfaceHeight = null;
}

GameEngine.prototype.init = function (ctx) {
    this.ctx = ctx;
    this.surfaceWidth = this.ctx.canvas.width;
    this.surfaceHeight = this.ctx.canvas.height;
    this.timer = new Timer();
    console.log('game initialized');
}

GameEngine.prototype.start = function () {
    console.log("starting game");
    var that = this;
    (function gameLoop() {
        that.loop();
        requestAnimFrame(gameLoop, that.ctx.canvas);
    })();
}

GameEngine.prototype.addEntity = function (entity) {
    console.log('added entity');
    this.entities.push(entity);
}

GameEngine.prototype.draw = function () {
    this.ctx.clearRect(0, 0, this.surfaceWidth, this.surfaceHeight);
    this.ctx.save();
    for (var i = 0; i < this.entities.length; i++) {
        this.entities[i].draw(this.ctx);
    }
    this.ctx.restore();
}

GameEngine.prototype.update = function () {
    var entitiesCount = this.entities.length;

    for (var i = 0; i < entitiesCount; i++) {
        var entity = this.entities[i];

        entity.update();
    }
}

GameEngine.prototype.loop = function () {
    this.clockTick = this.timer.tick();
    this.update();
    this.draw();
}

// Toggle for showing boxes
GameEngine.prototype.showBoxes = function () {
    if (this.showOutlines) {
        console.log("Show Boxes Disabled");
        this.showOutlines = false;
    } else {
        console.log("Show Boxes Enabled");
        this.showOutlines = true;
    }
}

function Timer() {
    this.gameTime = 0;
    this.maxStep = 0.05;
    this.wallLastTimestamp = 0;
}

Timer.prototype.tick = function () {
    var wallCurrent = Date.now();
    var wallDelta = (wallCurrent - this.wallLastTimestamp) / 1000;
    this.wallLastTimestamp = wallCurrent;

    var gameDelta = Math.min(wallDelta, this.maxStep);
    this.gameTime += gameDelta;
    return gameDelta;
}

function Entity(game, x, y) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.removeFromWorld = false;
}

Entity.prototype.update = function () {
}

Entity.prototype.draw = function (ctx) {
    if (this.game.showOutlines && this.radius) {
        this.game.ctx.beginPath();
        this.game.ctx.strokeStyle = "green";
        this.game.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.game.ctx.stroke();
        this.game.ctx.closePath();
    }
}

Entity.prototype.rotateAndCache = function (image, angle) {
    var offscreenCanvas = document.createElement('canvas');
    var size = Math.max(image.width, image.height);
    offscreenCanvas.width = size;
    offscreenCanvas.height = size;
    var offscreenCtx = offscreenCanvas.getContext('2d');
    offscreenCtx.save();
    offscreenCtx.translate(size / 2, size / 2);
    offscreenCtx.rotate(angle);
    offscreenCtx.translate(0, 0);
    offscreenCtx.drawImage(image, -(image.width / 2), -(image.height / 2));
    offscreenCtx.restore();
    //offscreenCtx.strokeStyle = "red";
    //offscreenCtx.strokeRect(0,0,size,size);
    return offscreenCanvas;
}

// Handles Bounding Boxes
function BoundingBox(x, y, width, height, tag) {
    if (width < 0) {
        throw "Bounding Box width value cannot be less than 0!";
    }
    if (height < 0) {
        throw "Bounding Box height value cannot be less than 0!";
    }

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.tag = tag;

    this.left = x;
    this.top = y;
    this.right = x + width;
    this.bottom = y + height;
}

// Detecting collisions with other Bounding Boxes
BoundingBox.prototype.collide = function (other) {
    var collide = { object: TAG_EMPTY, top: false, bottom: false, left: false, right: false, touched: false}; // Collision data to return

    if (other == undefined || other == null) { // Checks if other bounding box exists
        return collide;
    }
    
    if (this.left < other.right 
     && this.right > other.left 
     && this.top < other.bottom 
     && this.bottom > other.top) {
        collide.touched = true;
    }

    // this left side collided with other entity
    if (this.left < other.right && this.right > other.right && !(this.top >= other.bottom) && !(this.bottom <= other.top)) {
        collide.left = true;
    }

    // this right side collided with other entity
    if (this.right > other.left && this.left < other.left && !(this.top >= other.bottom) && !(this.bottom <= other.top)) {
        collide.right = true;
    }
    
    // this top side collided with other entity
    if (this.top < other.bottom && this.bottom > other.bottom && !(this.left >= other.right) && !(this.right <= other.left)) {
        collide.top = true;
    }
    
    // this bottom side collided with other entity
    if (this.bottom > other.top && this.top < other.top && !(this.left >= other.right) && !(this.right <= other.left)) {
        collide.bottom = true;
    }

    if (collide.left || collide.right || collide.top || collide.bottom || collide.touched) {
        collide.object = other.tag;
    }

    return collide;
}