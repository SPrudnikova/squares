import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { GameActions } from 'app/redux/actions';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { Grid, Row, Col, Button } from 'react-bootstrap';

import * as style from './index.css';
import { RootState } from 'app/redux/reducers';
import { omit } from 'app/utils';
import { GameModel, FieldCellModel } from 'app/models';
import { FieldRow } from 'app/scenes/Game/components/FieldRow';
import { PlayerWidget } from 'app/components/PlayerWidget';
import { WinnerModal } from 'app/scenes/Game/components/WinnerModal';

export namespace GameScene {
  export interface Props extends RouteComponentProps<void> {
    actions: GameActions;
    game: GameModel,
  }
  export interface State {
    showModal: boolean,
  }
}

@connect(
  (state: RootState): Pick<GameScene.Props, 'game'> => {
    return { game: state.game};
  },
  (dispatch: Dispatch): Pick<GameScene.Props, 'actions'> => ({
    actions: bindActionCreators(omit(GameActions, 'Type'), dispatch)
  })
)

export class Game extends React.Component<GameScene.Props, GameScene.State> {
  constructor(props: GameScene.Props) {
    super(props);
    this.state = {
      showModal: true,
    }
  }

  renderHeading = (): JSX.Element => {
    const { winner, activePlayer, isFinished } = this.props.game;

    if (!isFinished) {
      const activePlayerName = activePlayer ? activePlayer.name : null;
      return <h3 className={style.game_heading}>Active player: {activePlayerName}</h3>;
    } else if (isFinished && winner) {
      return <h3 className={style.game_heading}>Game over. Winner is {winner.name}.</h3>;
    }
    return <h3 className={style.game_heading}>Game over. There is no winner.</h3>;
  };

  renderField = (): JSX.Element[] => {
    const { game: { field, fieldSize } } = this.props;
    const gameField: JSX.Element[] = [];
    for (let row = 0; row < fieldSize; row++) {
      const fieldRow: FieldCellModel[] = [];
      for (let column = 0; column < fieldSize; column++) {
        const coords = `${row}${column}`;
        fieldRow.push(field[coords])
      }
      gameField.push(<FieldRow key={row} row={fieldRow} onCellClick={this.onCellClick}/>);
    }
    return gameField;
  };

  onCellClick = (cell: FieldCellModel): void => {
    if (!cell.player) {
      this.props.actions.playerMove(cell);
    }
  };

  renderPlayersScores = (): JSX.Element[] => {
    const { game: { players } } = this.props;
    return players.map((player) => <PlayerWidget key={player.id} player={player} showScore/>)
  };

  closeModal = (): void => {
    this.setState({ showModal: false });
  };

  restartGame = (): void => {
    this.props.actions.restartGame();
    this.setState({ showModal: true });
  };

  render() {
    const showModal = this.props.game.isFinished && this.state.showModal;
    return (
      <Grid>
        <Row className='show-grid'>
          <Col xs={6} xsOffset={3}>

            {this.renderHeading()}

            <table className={style.game_field}>
              <tbody>
                {this.renderField()}
              </tbody>
            </table>

            <div className={style.game_playersScoreContainer}>
              {this.renderPlayersScores()}
            </div>

            <div className={style.game_restartContainer}>
              <Button bsStyle='primary' onClick={this.restartGame}>Restart game</Button>
            </div>

            <WinnerModal
              winner={this.props.game.winner}
              showModal={showModal}
              close={this.closeModal}
              restart={this.restartGame}/>

          </Col>
        </Row>
      </Grid>
    );
  }
}
