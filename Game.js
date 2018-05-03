class Game {
  constructor (players, boardDimension) {
    this.players = this.decoratePlayers(players);
    this.board = this.makeGameBoard(boardDimension);
  }

  makeGameBoard (boardDimension) {
    const board = [];
    for (let row = 0; row < boardDimension; row++) {
      board[row] = [];
      for (let column = 0; column < boardDimension; column++) {
        board[row][column] = { player: null };
      }
    }
    return board;
  }

  decoratePlayers (palyers) {
    return palyers.map(player => ({ ...player, squaresSequences: [], maxSequenceLength: 0 }));
  }

  playerMakeMove (playerId, key) {
    const cell = this.board[key[0]][key[1]];
    if (!cell.player) {
      cell.player = playerId;
      const player = this.players.find(player => player.id === playerId);

      player.squaresSequences = this.updateSquaresSequences(player.squaresSequences, key);
      const sequencesLengths = player.squaresSequences.map(sequence => Object.keys(sequence).length);
      player.maxSequenceLength = Math.max(...sequencesLengths);
    }
  }

  updateSquaresSequences (squaresSequences, key) {
    const connectedSequences = this.getConnectedSequences(squaresSequences, key);
    const notConnectedSequences = squaresSequences.filter(sequence => !(connectedSequences.indexOf(sequence) !== -1));
    const assembledSequences = connectedSequences.reduce((acc, current) => ({ ...acc, ...current }), {});
    assembledSequences[key] = true;
    return [...notConnectedSequences, assembledSequences];
  }

  getConnectedSequences (squaresSequences, key) {
    const connectedSequences = [];
    const row = Number(key[0]);
    const column = Number(key[1]);
    const top = `${row - 1}${column}`;
    const bottom = `${row + 1}${column}`;
    const left = `${row}${column - 1}`;
    const right = `${row}${column + 1}`;
    for (let i = 0; i < squaresSequences.length; i++) {
      const squaresSequence = squaresSequences[i];
      if (squaresSequence[top] || squaresSequence[bottom] || squaresSequence[left] || squaresSequence[right]) {
        connectedSequences.push(squaresSequence);
      }
    }
    return connectedSequences;
  }
}

module.exports = Game;