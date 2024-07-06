class Ship {

    constructor(length) {
        this.length = length;
        this.position = [];
        this.set = false;
        this.hits = 0;
        this.sunk = false;
        this.rotation = 'v';
        this.adjacentSquares = [];
    }

    hit() {
        this.hits++;
        this.isSunk();
        return this.hits;
    }

    isSunk() {
        if (this.hits === this.length) {
            this.sunk = true;
        }
        return this.sunk;
    }

    setPos(square, player) {
        if (this.rotation === 'v') {
            for (let i = 0; i < this.length; i++) {
                this.position.push(player.board.getSquare(square.position + 10*i));
            }
        } else if (this.rotation === 'h') {
            for (let i = 0; i < this.length; i++) {
                this.position.push(player.board.getSquare(square.position + i));
            }
        }
    }

    lockPos() {
        this.set = true;
    }

    rotate() {
        this.rotation = this.rotation === 'v' ? 'h' : 'v';
    }
}


export { Ship };