// -*-mode:typescript-*-
var Block = (function () {
    function Block(color) {
        if (!color) {
            var colors = ['red', 'purple', 'yellow', 'green', 'teal'];
            this.color = colors[Math.floor((Math.random() * colors.length))];
        }
        else
            this.color = color;
    }
    Block.prototype.colorize = function (color) {
        this.color = color;
    };
    Block.prototype.attachNearbyBlockPositionData = function (left, right, up, down) {
        if (up === void 0) { up = undefined; }
        if (down === void 0) { down = undefined; }
        this.left = left;
        this.right = right;
        this.up = up;
        this.down = down;
    };
    Block.random = function (l) {
        return l[Math.floor((Math.random() * this.length))];
    };
    Block.prototype.draw = function (ctx, height, row_index, col_index) {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.fillRect(Number(col_index) * Block.blockSize, -height + canvas.height + GameGrid.startingHeight - Number(row_index) * Block.blockSize, Block.blockSize, Block.blockSize);
    };
    Block.blockSize = 60;
    return Block;
}());
var BlockRow = (function () {
    function BlockRow() {
        this.block = [];
        for (var i = 0; i < 6; i++)
            this.block.push(new Block());
        this.block = this.block;
    }
    BlockRow.randomlyColorizeRow = function (block, colors) {
        if (colors === void 0) { colors = ['red', 'purple', 'yellow', 'green', 'teal']; }
        for (var b in block) {
            block[b].colorize(colors[Math.floor(Math.random() * colors.length)]);
        }
    };
    BlockRow.prototype.draw = function (ctx, height, row_index) {
        for (var col_index in this.block) {
            this.block[col_index].draw(ctx, height, row_index, col_index);
        }
    };
    return BlockRow;
}());
var GameGrid = (function () {
    function GameGrid() {
        this.speed = 0.5;
        this.accumulated = 0;
        this.cursorPosition = [[2, 2], [3, 2]];
        this.row = [];
        for (var i = 0; i < 5; i++) {
            this.row.push(new BlockRow());
        }
        this.height = GameGrid.startingHeight;
    }
    GameGrid.prototype.moveCursorLeft = function () {
        if (this.cursorPosition[0][0] > 0) {
            this.cursorPosition[0][0] -= 1;
            this.cursorPosition[1][0] -= 1;
        }
    };
    GameGrid.prototype.moveCursorRight = function () {
        if (this.cursorPosition[1][0] < 5) {
            this.cursorPosition[0][0] += 1;
            this.cursorPosition[1][0] += 1;
        }
    };
    GameGrid.prototype.moveCursorUp = function () {
        this.cursorPosition[0][1] += 1;
        this.cursorPosition[1][1] += 1;
    };
    GameGrid.prototype.moveCursorDown = function () {
        this.cursorPosition[0][1] -= 1;
        this.cursorPosition[1][1] -= 1;
    };
    GameGrid.prototype.growRow = function () {
        this.row = [new BlockRow()].concat(this.row);
        this.height -= Block.blockSize;
    };
    GameGrid.prototype.deleteTopRow = function () {
        this.row = this.row.slice(1, this.row.length);
    };
    GameGrid.prototype.raiseGrid = function () {
        this.accumulated += this.speed;
        this.height += this.speed;
        if (this.accumulated > Block.blockSize * this.row.length - Block.blockSize * 5) {
            this.growRow();
            this.cursorPosition[0][1] += 1;
            this.cursorPosition[1][1] += 1;
        }
    };
    GameGrid.prototype.draw = function (ctx) {
        // for (let index = this.row.length - 1; index >= 0; index--) {
        for (var index in this.row) {
            this.row[index].draw(ctx, this.height, String(index));
        }
        this.drawCursor();
    };
    GameGrid.prototype.drawCursor = function () {
        ctx.fillStyle = 'black';
        ctx.fillRect(Number(this.cursorPosition[0][0]) * Block.blockSize + Block.blockSize / 4, -this.height + canvas.height + GameGrid.startingHeight - Number(this.cursorPosition[0][1]) * Block.blockSize + Block.blockSize / 4, Block.blockSize / 2, Block.blockSize / 2);
        ctx.fillRect(Number(this.cursorPosition[1][0]) * Block.blockSize + Block.blockSize / 4, -this.height + canvas.height + GameGrid.startingHeight - Number(this.cursorPosition[1][1]) * Block.blockSize + Block.blockSize / 4, Block.blockSize / 2, Block.blockSize / 2);
    };
    GameGrid.prototype.checkLoss = function () {
        console.log(this.accumulated);
        return this.accumulated > 480;
    };
    GameGrid.startingHeight = 160;
    return GameGrid;
}());
// -*-mode:typescript-*-
function loop() {
    grid.raiseGrid();
    grid.draw(ctx);
    if (grid.checkLoss()) {
        return;
    }
    requestAnimationFrame(loop);
}
var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");
var grid = new GameGrid();
console.log('I am being called');
grid.draw(ctx);
loop();
