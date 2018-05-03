const Game = require('./Game');

describe('Game entity', () => {

  it('create Game correctly', () => {
    const game = new Game([{id: 1}, {id: 2}], 4);
    expect(game.board.length).toBe(4);
    expect(game.board[0].length).toBe(4);

    game.playerMakeMove(1, '00');
    game.playerMakeMove(1, '11');
    game.playerMakeMove(1, '01');
    game.playerMakeMove(1, '22');
    game.playerMakeMove(1, '32');
    game.playerMakeMove(1, '13');
    game.playerMakeMove(1, '30');
    game.playerMakeMove(1, '12');

    game.playerMakeMove(2, '02');
    game.playerMakeMove(2, '03');
    game.playerMakeMove(2, '10');
    game.playerMakeMove(2, '20');
    game.playerMakeMove(2, '21');
    game.playerMakeMove(2, '23');
    game.playerMakeMove(2, '31');
    game.playerMakeMove(2, '33');

    expect(game.players[1].maxSequenceLength).toBe(4);
    expect(game.players[0].maxSequenceLength).toBe(7);
  });

});