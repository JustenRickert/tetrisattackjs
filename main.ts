// -*-mode:typescript-*-

function loop() {
    grid.raiseGrid();
    grid.draw(ctx);
    if (grid.checkLoss()){
        return
    }
    requestAnimationFrame(loop);
}

var canvas: any = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

let grid = new GameGrid();

console.log('I am being called')
grid.draw(ctx);
loop();
