import { handleActions } from 'redux-actions';
import { RootState } from '../state';
import { GameActions, StartGameSettings } from 'app/redux/game/actions';
import { GameModel, PlayerModel, FieldCellModel } from 'app/models';


const initialState: RootState.GameState = {
  players: [],
  fieldSize: 2,
  field: {},
  activePlayer: null,
  winner: null,
  isFinished: false,
};

export type ActionPayloadType = StartGameSettings & GameModel & FieldCellModel;

export const gameReducer = handleActions<RootState.GameState, ActionPayloadType>(
  {
    [GameActions.Type.START_GAME]: (state, action) => {
      if (action && action.payload) {
        const { players, fieldSize } = action.payload;

        const gameField: GameModel.field = makeGameField(fieldSize);
        return {
          ...state,
          field: gameField,
          activePlayer: players[0],
          players,
          fieldSize,
        };
      }
      return state;
    },

    [GameActions.Type.PLAYER_MOVE]: (state, action) => {
      const { activePlayer, players } = state;
      if (activePlayer && action.payload && action.payload.coords) {
        const activePlayerIndex: number = players.findIndex((player) => player.id === activePlayer.id);
        const cellCoords: string = action.payload.coords;

        const updatedField: GameModel.field = { ...state.field, [cellCoords]: { ...state.field[cellCoords], player: activePlayer} };
        const updatedPlayer: PlayerModel = getUpdatedPlayer(activePlayer, cellCoords);
        const updatedPlayers: PlayerModel[] = getUpdatedPlayers(players, updatedPlayer, activePlayerIndex);

        const isGameContinue: boolean = Object.values(updatedField).some((cell) => !cell.player);

        const winner: null | PlayerModel = isGameContinue ? null : getWinner(updatedPlayers);

        const updatedActivePlayer = isGameContinue ? players[(activePlayerIndex + 1) % players.length] : activePlayer;

        return {
          ...state,
          field: updatedField,
          activePlayer: updatedActivePlayer,
          players: updatedPlayers,
          winner: winner,
          isFinished: !isGameContinue,
        };
      }

      return state;
    },

    [GameActions.Type.RESTART_GAME]: (state, action) => {
      const { players, fieldSize } = state;

      const gameField: GameModel.field = makeGameField(fieldSize);
      const resetedPlayers = players.map((player: PlayerModel): PlayerModel => {
        return {
          ...player,
          squaresSequences: [],
          maxSequenceLength: 0,
        }
      });

      return {
        ...state,
        field: gameField,
        activePlayer: resetedPlayers[0],
        players: resetedPlayers,
        isFinished: false,
      };
    },
  },
  initialState
);

function makeGameField (fieldSize: number):GameModel.field {
  const gameField: GameModel.field = {};
  for (let row = 0; row < fieldSize; row++) {
    for (let column = 0; column < fieldSize; column++) {
      const key = `${row}${column}`;
      gameField[key] = { player: null, coords: key };
    }
  }
  return gameField;
}

function getUpdatedPlayer (player: PlayerModel, cellCoords: string): PlayerModel {
  const updatedPlayer: PlayerModel = { ...player};
  updatedPlayer.squaresSequences = updateSquaresSequences(player.squaresSequences, cellCoords);

  const sequencesLengths: number[] = updatedPlayer.squaresSequences.map((sequence: PlayerModel.sequence) => Object.keys(sequence).length);
  updatedPlayer.maxSequenceLength = Math.max(...sequencesLengths);

  return updatedPlayer;
}

function updateSquaresSequences (squaresSequences: PlayerModel.sequence[], cellCoords: string): PlayerModel.sequence[] {
  const row = Number(cellCoords[0]);
  const column = Number(cellCoords[1]);
  const wantedCoords: StringObject = {};

  wantedCoords.top = `${row - 1}${column}`;
  wantedCoords.bottom = `${row + 1}${column}`;
  wantedCoords.left = `${row}${column - 1}`;
  wantedCoords.right = `${row}${column + 1}`;

  const connectedSequences = getConnectedSequences(squaresSequences, cellCoords, wantedCoords);
  const notConnectedSequences = getNotConnectedSequences(squaresSequences, wantedCoords);
  return [...notConnectedSequences, connectedSequences];
}

function getConnectedSequences (squaresSequences: PlayerModel.sequence[], cellCoords: string, wantedCoords: StringObject): PlayerModel.sequence {
  let connectedSequences: PlayerModel.sequence = {};
  const { top, bottom, left, right } = wantedCoords;

  for (let i = 0; i < squaresSequences.length; i++) {
    const squaresSequence = squaresSequences[i];
    if (squaresSequence[top] || squaresSequence[bottom] || squaresSequence[left] || squaresSequence[right]) {
      connectedSequences = { ...connectedSequences, ...squaresSequence };
    }
  }

  connectedSequences[cellCoords] = true;
  return connectedSequences;
}

function getNotConnectedSequences (squaresSequences: PlayerModel.sequence[], wantedCoords: StringObject): PlayerModel.sequence[] {
  const notConnectedSequences: PlayerModel.sequence[] = [];
  const { top, bottom, left, right } = wantedCoords;

  for (let i = 0; i < squaresSequences.length; i++) {
    const squaresSequence = squaresSequences[i];
    if (!squaresSequence[top] && !squaresSequence[bottom] && !squaresSequence[left] && !squaresSequence[right]) {
      notConnectedSequences.push(squaresSequence);
    }
  }

  return notConnectedSequences;
}

function getUpdatedPlayers (players: PlayerModel[], updatedPlayer: PlayerModel, activePlayerIndex: number): PlayerModel[] {
  const firstPartPlayers: PlayerModel[]  = players.slice(0, activePlayerIndex);
  const lastPartPlayers: PlayerModel[] = players.slice(activePlayerIndex + 1);
  return [...firstPartPlayers, updatedPlayer, ...lastPartPlayers];
}

function getWinner (updatedPlayers: PlayerModel[]): null | PlayerModel {
  const slicedPlayers: PlayerModel[] = [...updatedPlayers];
  const sortedPlayers: PlayerModel[] =  slicedPlayers.sort((player1: PlayerModel, player2: PlayerModel) => {
    if (player1.maxSequenceLength < player2.maxSequenceLength)
      return 1;
    if (player1.maxSequenceLength > player2.maxSequenceLength)
      return -1;
    return 0;
  });
  return sortedPlayers[0].maxSequenceLength > sortedPlayers[1].maxSequenceLength ? sortedPlayers[0] : null;
}
