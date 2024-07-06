import { dom } from "./dom.js";
import { Ship } from "./ship.js";
import { game } from "./game.js";

const controller = {

    initialize: () => {
        const enemyCells = document.querySelectorAll('.enemy-cell');

        // Click events
        enemyCells.forEach(cell => {
            cell.addEventListener('click', () => {
                if (cell.classList.contains('disable-click')) {
                    return;
                } else {
                    let pos = cell.id.substring(2);
                    let square = game.enemy.board.getSquare(pos);
                    game.enemy.board.recieveAttack(square);
                    game.enemyMove();
                }
            });
        });
    },

    endGame: (player) => { 
        const winner = player ? 'enemy' : 'player';
        game.end();
        dom.clearModal();
        dom.populateEndScreen(winner); 
        dom.showModal();
    }
}

function init () {

    // Create a queue of ships from player.board.ships
    let shipQueue = [new Ship(5), new Ship(4), new Ship(3), new Ship(3), new Ship(2)];
    let currentShip = shipQueue.shift();

    const rotateButton = document.getElementById('rotate');
    rotateButton.addEventListener('click', () => {
        currentShip.rotate();
    });

    const modalCells = document.querySelectorAll('.modal-cell');
    modalCells.forEach(cell => {
        cell.addEventListener('mouseenter', () => {
            let pos = cell.id.substring(2);
            let square = game.player.board.getSquare(pos);

            if (game.player.board.parseSquares(square, currentShip)) {
                currentShip.setPos(square, game.player);
                if (!game.player.board.checkConflict(currentShip)) {
                    dom.displayShip(currentShip, true);
                } else {
                    dom.displayModalRed(square, currentShip.length, currentShip.rotation);
                    dom.disableClick(cell);
                }
            } else {
                dom.displayModalRed(square, currentShip.length, currentShip.rotation);
                dom.disableClick(cell);
            }

        });
        cell.addEventListener('mouseleave', () => {
            if (!currentShip.set) {
                currentShip.position = [];
                dom.clearBoard(true);
                game.player.board.ships.forEach(ship => {
                    if (ship.set) {
                        dom.displayShip(ship, true);
                    }
                });
            }
            dom.enableClick(cell);
            
        });
        cell.addEventListener('click', () => {
            if (cell.classList.contains('disable-click')) {
                return;
            } else {
                currentShip.set = true;
                game.player.board.placeShip(currentShip);
                game.player.board.ships.push(currentShip);
                if (shipQueue.length === 0) {
                    modal = document.querySelector('.modal');
                    modal.style.display = 'none';
                    game.start();
                } else {
                    currentShip = shipQueue.shift();
                }
            }

        });
       
    })
}

export { controller, init };