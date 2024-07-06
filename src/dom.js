import { game } from './game.js';

const dom = {
    displayShip(ship, modal=false, enemy=false) {
        if (modal) {
            ship.position.forEach(square => {
                const cell = document.getElementById(`b-${square.position}`);
                cell.classList.add('green');
            });
        } else if (enemy) {
            ship.position.forEach(square => {
                const cell = document.getElementById(`e-${square.position}`);
                cell.classList.add('green');
            });
        }  else {
            ship.position.forEach(square => {
                const cell = document.getElementById(`p-${square.position}`);
                cell.classList.add('green');
            });
        }
    },

    displayAllShips(player, modal=false, enemy=false) {
        player.board.ships.forEach(ship => {
            dom.displayShip(ship, modal, enemy);
        });
    },
    
    displaySquare(square, player) {
        if (square.ship) {
            this.displayRed(square, player);
        } else {
            this.displayBlue(square, player);
        }
    },

    // Hacky, should split/merge with function below
    displayModalRed(square, length=1, rotation='v') {
        let ceil = Math.ceil(square.position / 10) * 10
        const cell = document.getElementById(`b-${square.position}`);
        cell.classList.add('red');
        if (rotation === 'h') {
            for (let i = 1; i < length; i++) {
                if ((square.position + i) < ceil) {
                    const cell = document.getElementById(`b-${square.position + i}`);
                    cell.classList.add('red');
                }
            }
        } else if (rotation === 'v') {
            for (let i = 10; i < 10*length; i += 10) {
                if (square.position + i <= 99) {
                const cell = document.getElementById(`b-${square.position + i}`);
                cell.classList.add('red');
                }
            }
        }
    },

    displayRed(square, player) {
        if (player) {
            const cell = document.getElementById(`p-${square.position}`);
            cell.classList.add('red');
        } else {
            const cell = document.getElementById(`e-${square.position}`);
            cell.classList.add('red');
        }
    },

    displayGrey(square, player=false) {
        let cell;
        if (player) {
            cell = document.getElementById(`p-${square.position}`);
        } else {
            cell = document.getElementById(`e-${square.position}`);
        }
        cell.classList.add('grey');
    },

    displayBlue(square, player=false) {
        let cell;
        if (player) {
            cell = document.getElementById(`p-${square.position}`);
        } else {
            cell = document.getElementById(`e-${square.position}`);
        }
        cell.classList.add('blue');
    },

    displayBlueGrey(square, player=false) {
        let cell;
        if (player) {
            cell = document.getElementById(`p-${square.position}`);
        } else {
            cell = document.getElementById(`e-${square.position}`);
        }
        cell.classList.add('bluegrey');
    },

    displayDarkGrey(square, player=false) {
        let cell;
        if (player) {
            cell = document.getElementById(`p-${square.position}`);
        } else {
            cell = document.getElementById(`e-${square.position}`);
        }
        cell.classList.add('greyblack');
    },

    clearBoard(modal=false) {
        if (modal) {
            for (let i = 0; i < 100; i++) {
                const cell = document.getElementById(`b-${i}`);
                cell.classList.remove('green');
                cell.classList.remove('red');
            }
        }
    },

    disableClick(cell) {
        cell.classList.add('disable-click');
    },

    enableClick(cell) {
        cell.classList.remove('disable-click');
    },

    sinkShip(ship, player) {
        ship.position.forEach(square => {
            dom.displayBlueGrey(square, player);
        });
    },

    clearModal() {
        const modalContent = document.getElementById('modal-content');
        modalContent.innerHTML = '';
    },

    populateEndScreen(winner) {
        const modalContent = document.getElementById('modal-content');
        // Style content
        modalContent.style.width = '15%';
        modalContent.style.marginTop = '15%';
        modalContent.style.borderRadius = '10px';
        // Add text
        if (winner === 'player') {
            modalContent.innerHTML = '<p>Congratulations! You won!</p>';
        } else if (winner === 'enemy') {
            modalContent.innerHTML = '<p>Oh no! Better luck next time...</p>';
        }
        // Add a "play again" button
        const button = document.createElement('button');
        button.textContent = 'Play Again';
        button.addEventListener('click', () => {
            location.reload();
        });
        // Style button
        button.style.width = '120px';
        button.style.margin = 'auto';
        modalContent.appendChild(button);        
    },

    showModal() {
        const modal = document.querySelector('.modal');
        modal.style.display = 'block';
    },

    addX(cell) {
        cell.innerHTML = 'X';
    },

    removeX(cell) {
        // find the square position from cell ID
        let pos = cell.id.substring(2);
        // get the square from the board
        let square = game.enemy.board.getSquare(pos);
        if (!square.hit) {
            cell.innerHTML = '';
        }
    }
}

export { dom };