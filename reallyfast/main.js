// a different, faster, javascript implementation of the same functions
// this does not have a ui, but you can add other things to it to track things and do intresting mathematical tests with this game. Just for fun.

var players = [0,0,0,0]; // one for each player, the number is 1-100 for the player space, 0 means that player is not yet on the board (has not moved yet)
var wins = [0,0,0,0];
var totalroundcount = [];
var spacecount = {};
var spacecountlist = [];
for (var i = 0; i < 101; i++) {
    spacecount[i] = 0;
    spacecountlist[i] = 0;
}
var specials = {
    1: 38,
    4: 14,
    9: 31,
    21: 42,
    28: 84,
    36: 44,
    51: 67,
    71: 91,
    80: 100,
    16: 6,
    49: 11,
    62: 19,
    87: 24,
    47: 26,
    56: 53,
    64: 60,
    93: 73,
    95: 75,
    98: 78
};
var over100 = 0;
function runRound() {
    // might be a good idea to remove this loop to increase speed
    for (var i = 0; i < 4; i++) {
        players[i] += (Math.floor(Math.random() * 6) + 1);
        if (specials[players[i]] != undefined) {
            players[i] = specials[players[i]];
        }
        if (players[i] >= 100) {
            players[i] = 100;
            spacecount[players[i]] += 1;
            spacecountlist[players[i]] += 1;
            return [true, i];
        }
        else {
            spacecount[players[i]] += 1;
            spacecountlist[players[i]] += 1;
        }
    }
    return [false];
}

var roundcount = 0;
function main(games) { // games is the number of games to play
    for (var j = 0; j < 100; j++) {
        for (var i = 0; i < (games / 100); i++) {
            players = [0,0,0,0];
            roundcount = 0;
            while (true) {
                var result = runRound();
                roundcount++;
                if (result[0]) {
                    wins[result[1]] += 1;
                    if (totalroundcount[roundcount] != undefined) {
                        totalroundcount[roundcount] += 1;
                    }
                    else {
                        totalroundcount[roundcount] = 1;
                    }
                    break;
                }
            }
        }
        console.log('still running... ' + (j + 1).toString() + '%');
    }
}

var games = 1000000;
main(games);
console.log('finished simulations, calculating results...');
console.log('');
console.log('Total games simulated: ' + games);
console.log(wins);
console.log('RED: ' + ((wins[0]/games)*100).toFixed(2) + '%');
console.log('YELLOW: ' + ((wins[1]/games)*100).toFixed(2) + '%');
console.log('GREEN: ' + ((wins[2]/games)*100).toFixed(2) + '%');
console.log('BLUE: ' + ((wins[3]/games)*100).toFixed(2) + '%');
console.log('');
console.log('spacecount:');
console.log(spacecount);
console.log(Math.max(...spacecountlist));
console.log('');
console.log('Rounds:');
console.log(totalroundcount);
