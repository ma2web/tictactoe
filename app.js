class TacTicToe {
  constructor() {
    this.cells = document.querySelectorAll('.cell');
    this.board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    this.humanPlayer = 'O';
    this.aiPlayer = 'X';
    this.winStates = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [6, 4, 2],
    ];
    this.endModal = document.querySelector('#end-modal');
    this.endModalText = document.querySelector('#end-modal .text');
  }

  start() {
    this.endModal.style.display = 'none';
    this.board = Array.from(Array(9).keys());

    for (let i = 0; i < this.cells.length; i++) {
      const cell = this.cells[i];
      document.getElementById(i).innerHTML = '';
      cell.style.removeProperty('background-color');
      cell.addEventListener('click', (e) => this.turnClick(e), false);
    }
  }
  turnClick(e) {
    const id = e.target.id;
    if (typeof this.board[id] === 'number') {
      this.turn(id, this.humanPlayer);
      if (!this.checkTie()) {
        this.turn(this.bestChoise(), this.aiPlayer);
      }
    }
  }
  turn(id, player) {
    this.board[id] = player;
    document.getElementById(id).innerHTML = player;
    let won = this.checkWin(this.board, player);

    if (won) {
      this.gameOver(won);
    }
  }
  checkWin(board, player) {
    let plays = board.reduce((a, e, i) => (e === player ? a.concat(i) : a), []);
    let won = null;
    for (let [index, win] of this.winStates.entries()) {
      if (win.every((item) => plays.indexOf(item) > -1)) {
        won = { index, player };
        break;
      }
    }

    return won;
  }
  gameOver(won) {
    const isHumanWon = won.player === this.humanPlayer;
    for (const index of this.winStates[won.index]) {
      document.getElementById(index).style.backgroundColor = isHumanWon
        ? 'lightgreen'
        : 'red';
    }

    for (let i = 0; i < this.cells.length; i++) {
      this.cells[i].removeEventListener('click', this.turnClick, false);
    }

    this.whoIsWinner(`${isHumanWon ? 'You Won!' : 'You Loose!'}`);
  }
  checkEmpties() {
    return this.board.filter((item) => typeof item != 'string');
  }
  bestChoise() {
    // return this.checkEmpties()[0];
    return this.brain(this.board, this.aiPlayer).index;
  }
  checkTie() {
    if (this.checkEmpties().length == 0) {
      for (let i = 0; i < this.cells.length; i++) {
        this.cells[i].removeEventListener('click', this.turnClick, false);
      }

      this.whoIsWinner('Tie Game!');

      return true;
    }

    return false;
  }
  whoIsWinner(who) {
    this.endModal.style.display = 'flex';
    this.endModalText.innerText = who;
  }
  brain(board, player) {
    let availableCells = this.checkEmpties(board);

    if (this.checkWin(board, player)) {
      return { score: -10, player };
    } else if (this.checkWin(board, this.aiPlayer)) {
      return { score: 10, player };
    } else if (availableCells.length === 0) {
      return { score: 0, player };
    }

    let moves = [];
    for (let index = 0; index < availableCells.length; index++) {
      let move = {};
      const cell = availableCells[index];
      move.index = board[cell];
      board[cell] = player;

      if (player == this.aiPlayer) {
        let result = this.brain(board, this.humanPlayer);
        move.score = result.score;
      } else {
        let result = this.brain(board, this.aiPlayer);
        move.score = result.score;
      }

      board[cell] = move.index;
      moves.push(move);
    }

    let bestMove;
    if (player == this.aiPlayer) {
      let bestScore = -5000;

      for (let index = 0; index < moves.length; index++) {
        const move = moves[index];

        if (move.score > bestScore) {
          bestScore = move.score;
          bestMove = index;
        }
      }
    } else {
      let bestScore = 5000;

      for (let index = 0; index < moves.length; index++) {
        const move = moves[index];

        if (move.score < bestScore) {
          bestScore = move.score;
          bestMove = index;
        }
      }
    }

    return moves[bestMove];
  }
}
