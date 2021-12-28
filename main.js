var board = [];
for (let i = 0; i < 101; i++) {
    board.push([]);
}
board[0] = [1,2,3,4]
var ladderStarts  = [1,  4,  9,  21, 28, 36, 51, 71, 80 ];
var ladderEnds =    [38, 14, 31, 42, 84, 44, 67, 91, 100];
var chuteStarts =   [16, 49, 62, 87, 47, 56, 64, 93, 95, 98];
var chuteEnds   =   [6,  11, 19, 24, 26, 53, 60, 73, 75, 78];
function roll() {
    var roll = Math.floor(Math.random() * 6) + 1;
    if (roll > 6) {
        roll = 6;
    }
    return roll;
}
function getPlayerPos(player) {
    for (let i = 0; i < board.length; i++) {
        if (board[i].includes(player)) {
            return i;
        }
    }
}
function checkForWin(player) {
    if (board[100].includes(player)) {
        return true;
    }
}
function getMove(player) {
    var pos = getPlayerPos(player);
    var spaces = [];
    var log = '';
    board[pos].splice(board[pos].indexOf(player),1);
    spaces.push(pos);
    var myroll = roll();
    log  = log + 'MOVE: Player [' + getPlayerName(player) + '] rolled a ' + myroll;
    for (let i = 0; i < myroll; i++) {
        pos += 1;
        spaces.push(pos);
    }
    if (ladderStarts.includes(pos)) {
        pos = ladderEnds[ladderStarts.indexOf(pos)];
        spaces.push(pos);
        log = log + '<br>LADDER: Player [' + getPlayerName(player) + '] climbed a ladder to ' + pos;
    }
    else if (chuteStarts.includes(pos)) {
        pos = chuteEnds[chuteStarts.indexOf(pos)];
        spaces.push(pos);
        log = log + '<br>CHUTE: Player [' + getPlayerName(player) + '] fell down a chute to ' + pos;
    }
    for (let i = 0; i < spaces.length; i++) {
        if (spaces[i] > 100) {
            spaces.splice(i,1);
        }
    }
    if (pos > 100) {
        pos = 100;
    }
    board[pos].push(player);
    return [spaces, log];
}
function init_canvas() {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    ctx.drawImage(document.getElementById('bg'), 0, 0);
}
function canvasLocationToNormal(x, y) {
    var newx = (x-5) / 50;
    var newy = (y-5) / 50;
    return [newx, newy];
}
function swap(value) {
    return (10 - value) - 1;
}
function getCanvasLocation(space) {
    // player pos in a 0 to 100 range
    var pos = space;
    // calculate x on a range between 0 and 9
    // for both x and y pos is subtracted by 1 to make the strange 
    // chutes and ladders board be able to be translated 
    // into a sensible grid
    var x = (pos - 1) % 10;
    // y beween 0 and 9
    var y = Math.floor((pos - 1) / 10);
    // swap y so that 0, 0 is in the top left (100)
    y = swap(y);
    // swap every other x line
    if (y % 2 == 0) {
        x = swap(x);
    }
    // translate x and y to canvas coordinates
    y = (y * 50) + 5;
    x = (x * 50) + 5;
    // return values
    return [x, y];
}
function endGame() {
    var red    = getPlayerPos(1);
    var yellow = getPlayerPos(2);
    var green  = getPlayerPos(3);
    var blue   = getPlayerPos(4);
    var output = {};
    output[red] = "red";
    output[yellow] = "yellow";
    output[green] = "green";
    output[blue] = "blue";
    var list = [red,yellow,green,blue];
    console.log(list);
    list.sort(function(a, b) {
        return a - b;
    });
    console.log(list);
    var winner = output[list[3]];
    var second = output[list[2]];
    var third  = output[list[1]];
    var fourth = output[list[0]];
    var html = `
        GAME OVER
        <br>
        Winner: ${winner}<br>
        Second: ${second}<br>
        Third: ${third}<br>
        Fourth: ${fourth}<br><br><br>
    `;
    document.getElementById('log_output').innerHTML = html + document.getElementById('log_output').innerHTML;
    console.log('1st: '+winner+', 2nd: '+second+', 3rd: '+third+', fourth: '+fourth);
}
function wait(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}
function getPlayerColor(player) {
    if (player == 1) {
        return '#ff0000';
    }
    else if (player == 2) {
        return '#ffff00';
    }
    else if (player == 3) {
        return '#00cc00';
    }
    else if (player == 4) {
        return '#0033ff';
    }
}
function getPlayerName(player) {
    if (player == 1) {
        return 'Red';
    }
    else if (player == 2) {
        return 'Yellow';
    }
    else if (player == 3) {
        return 'Green';
    }
    else if (player == 4) {
        return 'Blue';
    }
}
async function processPlayer(player, delay) {
    return new Promise(async function(resolve) {
        var canvas = document.getElementById('canvas');
        var ctx = canvas.getContext('2d');
        ctx.fillStyle = getPlayerColor(player);
        var moveData = getMove(player);
        var spaces = moveData[0];
        var log = moveData[1];
        for (let i = 0; i < spaces.length; i++) {
            try {
                var start = spaces[i-1];
            }
            catch (err) {
                var start = getPlayerPos(player);
            }
            var end = spaces[i];
            init_canvas();
            var startx = getCanvasLocation(start)[0];
            var starty = getCanvasLocation(start)[1];
            var endx = getCanvasLocation(end)[0];
            var endy = getCanvasLocation(end)[1];
            ctx.fillStyle = getPlayerColor(player);
            ctx.fillRect(startx, starty, 40, 40);
            for (let j = 0; j < Math.ceil(delay / 45); j++) {
                init_canvas();
                ctx.fillStyle = getPlayerColor(player);
                ctx.fillRect(
                    startx + (j * (endx - startx) / Math.ceil(delay / 45)), 
                    starty + (j * (endy - starty) / Math.ceil(delay / 45)), 
                    40, 40);
                // update other players
                for (let j = 1; j < 5; j++) {
                    if (j != player) {
                        ctx.fillStyle = getPlayerColor(j);
                        ctx.fillRect(getCanvasLocation(getPlayerPos(j))[0], getCanvasLocation(getPlayerPos(j))[1], 40, 40);
                    }
                }
                await wait(Math.ceil(delay / 45));
            }
            init_canvas();
            ctx.fillStyle = getPlayerColor(player);
            ctx.fillRect(endx, endy, 40, 40);
            for (let j = 1; j < 5; j++) {
                if (j != player) {
                    ctx.fillStyle = getPlayerColor(j);
                    ctx.fillRect(getCanvasLocation(getPlayerPos(j))[0], getCanvasLocation(getPlayerPos(j))[1], 40, 40);
                }
            }
        }
        if (checkForWin(player)) {
            resolve([true, log]);
        }
        else {
            resolve([false, log]);
        }
    });
}
async function runRound(delay) {
    return new Promise(async function(resolve, reject) {
        init_canvas();
        var logUI = document.getElementById('log_output');
        var red = await processPlayer(1, delay);
        logUI.innerHTML = red[1] + '<br>' + logUI.innerHTML;
        await wait(delay);
        var yellow = await processPlayer(2, delay);
        logUI.innerHTML = yellow[1] + '<br>' + logUI.innerHTML;
        await wait(delay);
        var green = await processPlayer(3, delay);
        logUI.innerHTML = green[1] + '<br>' + logUI.innerHTML;
        await wait(delay);
        var blue = await processPlayer(4, delay);
        logUI.innerHTML = blue[1] + '<br>' + logUI.innerHTML;
        await wait(delay);
        resolve([red[0], yellow[0], green[0], blue[0]]);
    });
}
async function main() {
    var output = await runRound(document.getElementById('speed').value);
    var red = output[0];
    var yellow = output[1];
    var green = output[2];
    var blue = output[3];
    if (red || yellow || green || blue) {
        endGame();
    }
    else {
        main();
    }
}

