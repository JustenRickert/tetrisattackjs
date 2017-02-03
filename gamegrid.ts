// -*-mode:typescript-*-

class Block {
    static blockSize: number = 60;

    color: string;
    left: Block;
    right: Block;
    up: Block | undefined;
    down: Block;

    constructor(color?: string) {
        if (!color) {
            let colors = ['red', 'purple', 'yellow', 'green', 'teal'];
            this.color = colors[Math.floor((Math.random() * colors.length))];
        } else this.color = color;
    }

    colorize(color: string): void {
        this.color = color;
    }

    attachNearbyBlockPositionData(left: Block, right: Block,
        up: Block = undefined, down: Block = undefined): void {
        this.left = left;
        this.right = right;
        this.up = up;
        this.down = down;
    }

    static random(l: Block[]): Block {
        return l[Math.floor((Math.random() * this.length))];
    }

    draw(ctx, height: number, row_index: string, col_index: string) {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.fillRect(
            Number(col_index) * Block.blockSize,
            -height + canvas.height + GameGrid.startingHeight - Number(row_index) * Block.blockSize,
            Block.blockSize, Block.blockSize);
    }
}

class BlockRow {
    block: Block[];
    blockHeight: number;

    constructor() {
        this.block = [];
        for (let i = 0; i < 6; i++) this.block.push(new Block());
        this.block = this.block;
    }

    static randomlyColorizeRow(block: Block[], colors: string[] =
        ['red', 'purple', 'yellow', 'green', 'teal']): void {
        for (let b in block) {
            block[b].colorize(colors[Math.floor(Math.random() * colors.length)])
        }
    }

    draw(ctx, height: number, row_index: string) {
        for (let col_index in this.block) {
            this.block[col_index].draw(ctx, height, row_index, col_index);
        }
    }
}

class GameGrid {
    static startingHeight = 160;
    // The game grid needs to be a stack of rows. At every state, the stack of
    // rows moves upwards by a parameter being set, corresponding to a
    // difficulty setting.
    row: BlockRow[];
    height: number;
    speed: number = 0.5;
    accumulated: number = 0;

    cursorPosition = [[2, 2], [3, 2]];

    constructor() {
        this.row = [];
        for (let i = 0; i < 5; i++) {
            this.row.push(new BlockRow());
        }
        this.height = GameGrid.startingHeight;
    }

    moveCursorLeft(): void {
        if (this.cursorPosition[0][0] > 0) {
            this.cursorPosition[0][0] -= 1;
            this.cursorPosition[1][0] -= 1;
        }
    }
    moveCursorRight(): void {
        if (this.cursorPosition[1][0] < 5) {
            this.cursorPosition[0][0] += 1;
            this.cursorPosition[1][0] += 1;
        }
    }
    moveCursorUp() {
        this.cursorPosition[0][1] += 1;
        this.cursorPosition[1][1] += 1;
    }
    moveCursorDown() {
        this.cursorPosition[0][1] -= 1;
        this.cursorPosition[1][1] -= 1;
    }

    growRow(): void {
        this.row = [new BlockRow()].concat(this.row);
        this.height -= Block.blockSize;
    }

    deleteTopRow(): void {
        this.row = this.row.slice(1, this.row.length);
    }

    raiseGrid(): void {
        this.accumulated += this.speed;
        this.height += this.speed;
        if (this.accumulated > Block.blockSize * this.row.length - Block.blockSize * 5) {
            this.growRow();
            this.cursorPosition[0][1] += 1;
            this.cursorPosition[1][1] += 1;
        }
    }

    draw(ctx): void {
        // for (let index = this.row.length - 1; index >= 0; index--) {
        for (let index in this.row) {
            this.row[index].draw(ctx, this.height, String(index));
        }
        this.drawCursor();
    }

    drawCursor() {
        ctx.fillStyle = 'black';
        ctx.fillRect(
            Number(this.cursorPosition[0][0]) * Block.blockSize + Block.blockSize / 4,
            -this.height + canvas.height + GameGrid.startingHeight - Number(this.cursorPosition[0][1]) * Block.blockSize + Block.blockSize / 4,
            Block.blockSize / 2, Block.blockSize / 2);
        ctx.fillRect(
            Number(this.cursorPosition[1][0]) * Block.blockSize + Block.blockSize / 4,
            -this.height + canvas.height + GameGrid.startingHeight - Number(this.cursorPosition[1][1]) * Block.blockSize + Block.blockSize / 4,
            Block.blockSize / 2, Block.blockSize / 2);
    }

    checkLoss(): boolean {
        console.log(this.accumulated);
        return this.accumulated > 480;
    }
}
