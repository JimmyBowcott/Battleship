const LEFT_EDGE = [0,10,20,30,40,50,60,70,80,90];
const RIGHT_EDGE = [9,19,29,39,49,59,69,79,89,99];

import { dom }  from './dom.js';
import { controller } from './controller.js';
import { game } from './game.js';

class Square {

    constructor(position, ship=null) {
        this.position = position;
        this.hit = false;
        this.ship = ship;
        this.adjacentSquare = false;
        this.edge = this.isEdge(this);
        this.revealed = false;
    }

    isEdge(square) {
        if (LEFT_EDGE.includes(square.position)) {
            return 'left';
        } else if (RIGHT_EDGE.includes(square.position)) {
            return 'right';
        } else {
            return false;
        }
    }

    enableClick() {
        dom.enableClick(document.getElementById(`e-${this.position}`)); // Do not use for player squares
    }

    disableClick(player) {
        if (!player) {
            dom.disableClick(document.getElementById(`e-${this.position}`)); // Do not use for player squares
        }
    }
}

class Board {

    constructor(player=false) {
        this.squares = this.initializeBoard();
        this.player = player;
        this.ships = [];
    }

    initializeBoard() {
        let squares = [];
        for (let i = 0; i < 100; i++) {
            const square = new Square(i);
            squares.push(square);
        }
        return squares;
    }

    placeShip(ship) {
        ship.position.forEach(square => {
            square.ship = ship;
            this.setAdjacentSquares(square, ship);
        })
    }

    setAdjacentSquares(square, ship) {
        // For each adjacent square, set adjacentSquare to true
        const adjacentSquares = [square.position - 10, square.position + 10];

        // Right edge
        if (square.edge !== 'right') {
            adjacentSquares.push(square.position + 1);
            adjacentSquares.push(square.position + 11);
            adjacentSquares.push(square.position - 9);
        }
        // Left edge
        if (square.edge !== 'left') {
            adjacentSquares.push(square.position - 1);
            adjacentSquares.push(square.position - 11);
            adjacentSquares.push(square.position + 9);
        }

        adjacentSquares.forEach(adjacentSquare => {
            if (adjacentSquare < 0 || adjacentSquare > 99) return;
            let adSquare = this.getSquare(adjacentSquare);
            adSquare.adjacentSquare = true;
            ship.adjacentSquares.push(adSquare);
        })
    }

    getHVSquares(square) {
        const hVSquares = [this.getSquare(square.position - 10), this.getSquare(square.position + 10)];
        // Right edge
        if (square.edge !== 'right') {
            hVSquares.push(this.getSquare(square.position + 1));
        }
        // Left edge
        if (square.edge !== 'left') {
            hVSquares.push(this.getSquare(square.position - 1));
        }

        return hVSquares;
    }

    revealAdjacentSquares(ship) {
        ship.adjacentSquares.forEach(square => {
            if (!square.ship) {
                square.revealed = true;
                dom.displaySquare(square, this.player);
                square.disableClick(this.player);   
            }
        })
    }

    recieveAttack(square) {
        square.disableClick(this.player); // disable click
        square.hit = true;

        if (square.ship) {
            square.ship.hit();
            if (this.player) {
                if (game.nextEnemyMove === 'random') {
                    game.nextEnemyMove = ['hitAdjacent', square];
                } else if (game.nextEnemyMove[0] === 'hitAdjacent') {
                    game.nextEnemyMove = ['sinkShip', square.ship];
                }
                
            }
        }

        dom.displaySquare(square, this.player);

        if (square.ship && square.ship.isSunk()) {
            this.revealAdjacentSquares(square.ship); // Reveal adjacent squares
            dom.sinkShip(square.ship, this.player); // Make dark blue
            this.ships = this.ships.filter(ship => ship !== square.ship); // Remove from board

            if (this.player) {
                game.nextEnemyMove = 'random'; // If bot, return to random guessing
            }

            if (this.ships.length === 0 && !game.hasEnded) {
                controller.endGame(this.player);
            }
        }
    }

    getCell(square) {
        if (this.player) {
            return document.getElementById(`p-${square.position}`);
        } else {
            return document.getElementById(`e-${square.position}`);
        }
    }

    getSquare(position) {
        return this.squares[position];
    }

    parseSquares(square, ship) {
        const length = ship.length;
        const rotation = ship.rotation;
        if (rotation === 'v') {
            if (square.position + 10*(length-1) > 99) {
                return false;
            } 
        } else if (rotation === 'h') {
            if ((square.position % 10) + length > 10) {
                return false;
            }
        }

        return true;
    }

    checkConflict(ship) {
        let conflict=false;
            ship.position.forEach(square => {
                if (square.ship || square.adjacentSquare) {
                    conflict = true;
                }
            })
        return conflict;
    }

    getAvailablePositions() {
        let availablePositions = [];
        this.squares.forEach(square => {
            if (!square.ship && !square.adjacentSquare) {
                availablePositions.push(square.position);
            }
        })
        return availablePositions;
    }

    getUnseenSquares() {
        let unseenSquares = [];
        this.squares.forEach(square => {
            if (!square.hit && !square.revealed) {
                unseenSquares.push(square);
            }
        })  
        return unseenSquares;
    }

}

export { Square, Board };