import { dom } from "./dom.js";
import { controller } from "./controller.js";
import { Player } from "./player.js"

const game = {

    hasEnded: false,

    player: new Player(true),

    enemy: new Player(),

    turn: "player",

    nextEnemyMove: 'random',

    start: () => {
        dom.displayAllShips(game.player);
        controller.initialize();
        game.enemy.initialize();        
    },

    end : () => {
        game.enemy.disableAllSquares();
        game.hasEnded = true;
    },

    enemyMove() {
        if (game.nextEnemyMove === 'random') {
            game.enemyRandomMove();
        } else if (game.nextEnemyMove[0] === 'hitAdjacent') {
            game.enemyHitAdjacent(game.nextEnemyMove[1]);
        } else if (game.nextEnemyMove[0] === 'sinkShip') {
            game.enemySinkShip(game.nextEnemyMove[1]);
        }
    },

    enemyRandomMove() {
        let availableSquares = game.player.board.getUnseenSquares();
        let square = availableSquares[Math.floor(Math.random() * availableSquares.length)];
        game.player.board.recieveAttack(square);
    },

    enemyHitAdjacent(square) {
        // Find horizontal and vertical adjacent squares, and hit a random available one
        let hVSquares = game.player.board.getHVSquares(square); // Get H/V adjacent squares
        const availableSquares = game.player.board.getUnseenSquares();   // Get available squares
        hVSquares = hVSquares.filter(item => availableSquares.includes(item)) // Remove any squares that aren't available
        let randomSquare = hVSquares[Math.floor(Math.random() * hVSquares.length)]; // Get a random square from the available squares
        game.player.board.recieveAttack(randomSquare); // Attack the player
    },

    enemySinkShip(ship) {
        // Find out if the ship is horizontal or vertical and hit avaiable squares
        // above or below what is already been guessed
        let guessingSquares = [];
        let hitPositions = [];
        let hitSquares = [];

        ship.position.forEach(square => {
            if (square.hit) {
                hitSquares.push(square);    // Get hit ship squares
                hitPositions.push(square.position); // Get positions of hit ship squares
            }
        })
        const min = hitPositions.indexOf(Math.min(...hitPositions));
        const max = hitPositions.indexOf(Math.max(...hitPositions));

        // Set the min and max squares to be guessed
        if (ship.rotation === 'v') {
            guessingSquares.push(game.player.board.getSquare(hitSquares[min].position - 10));
            guessingSquares.push(game.player.board.getSquare(hitSquares[max].position + 10));
        } else if (ship.rotation === 'h') {
            guessingSquares.push(game.player.board.getSquare(hitSquares[min].position - 1));
            guessingSquares.push(game.player.board.getSquare(hitSquares[max].position + 1));
        }

        let availableSquares = game.player.board.getUnseenSquares();   // Get available squares
        guessingSquares = guessingSquares.filter(item => availableSquares.includes(item)) // Remove any squares that aren't available

        let randomSquare = guessingSquares[Math.floor(Math.random() * guessingSquares.length)];

        game.player.board.recieveAttack(randomSquare);
    }

};

export { game }