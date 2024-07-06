import { Board } from "./board.js";
import { Ship } from "./ship.js";


class Player {

    constructor(player=false) {
        this.player = player;
        this.ships = [];
        this.board = new Board(player);
    
    }

    initialize() {
        if (!this.player) {
            // Enable squares
            this.enableAllSquares();

            let randomPos;

            // Randomly place enemy ships
            let shipQueue = [new Ship(5), new Ship(4), new Ship(3), new Ship(3), new Ship(2), null];
            let currentShip = shipQueue.shift();
            
            while (shipQueue.length > 0) {
                // Clear the current position
                currentShip.position = [];

                let availableTiles = this.board.getAvailablePositions();
                
                // pick randomly from "h" or "v"
                currentShip.rotation = Math.floor(Math.random() * 2) ? 'h' : 'v';

                // Pick a random position
                randomPos = availableTiles[Math.floor(Math.random() * availableTiles.length)];

                let square = this.board.getSquare(randomPos);
                
                // Check the position is valid then set the ship
                if (this.board.parseSquares(square, currentShip)) {
                    currentShip.setPos(square, this);

                    if (!this.board.checkConflict(currentShip)) {
                        currentShip.set = true;
                        this.board.placeShip(currentShip);
                        this.board.ships.push(currentShip);
                    

                        currentShip = shipQueue.shift();
                    }
                }

            //dom.displayAllShips(this, false, true);
            }
        }
    }

    enableSquares() {
        this.board.squares.forEach(square => {
            if (!square.revealed) {
                square.enableClick();
            }
        })
    }

    enableAllSquares() {
        this.board.squares.forEach(square => {
            square.enableClick();
        })
    }

    
    disableAllSquares() {
        this.board.squares.forEach(square => {
            square.disableClick();
        })
    }

}


export { Player };