import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { FormGroup, ControlLabel, FormControl, Button, Grid, Row, Col, Panel } from 'react-bootstrap';

import { GameActions } from 'app/redux/actions';
import { omit } from 'app/utils';
import { PlayerModel, ColorModel } from 'app/models';
import { AddPlayerControl } from 'app/scenes/StartGame/components/AddPlayerControl';
import { PlayerWidget } from 'app/components/PlayerWidget';

export namespace StartGameScene {
  export interface Props extends RouteComponentProps<void> {
    actions: GameActions;
  }
  export interface State {
    players: PlayerModel[];
    fieldSize: number;
  }
}

@connect(
  null,
  (dispatch: Dispatch): Pick<StartGameScene.Props, 'actions'> => ({
    actions: bindActionCreators(omit(GameActions, 'Type'), dispatch)
  })
)

export class StartGame extends React.Component<StartGameScene.Props, StartGameScene.State> {
  static maxFieldSize: number = 8;
  static minFieldSize: number = 2;

  constructor(props:StartGameScene.Props) {
    super(props);
    this.state = {
      players: [],
      fieldSize: StartGame.minFieldSize,
    }
  }

  handleFieldSizeChange = (event: React.FormEvent<FormControl>): void => {
    this.setState({ fieldSize: Number((event.target as HTMLInputElement).value) });
  };

  renderGamePlayers = (): JSX.Element[] | JSX.Element => {
    const { players } = this.state;
    if (this.state.players.length) {
      return players.map((player: PlayerModel) => <PlayerWidget key={player.id} player={player}/>)
    }
    return <span>There are no players. Add them please.</span>
  };

  getSelectedColors = (): StringObject => {
    const { players } = this.state;
    const map: StringObject = {};
    return players.map((player: PlayerModel) => player.color)
                  .reduce((acc: StringObject, current: ColorModel) => {
                    acc[current.name] = current.code;
                    return acc;
                  }, map)
  };

  addPlayer = (player: PlayerModel) => {
    const { players } = this.state;
    const playersQty: number = players.length;
    let newPlayerId: number = 1;
    if (playersQty) {
      const lastPlayer = players[playersQty - 1];
      newPlayerId = lastPlayer.id ? lastPlayer.id + 1 : 1;
    }
    this.setState({ players: [...this.state.players, { ...player, id: newPlayerId }] });
  };

  startGame = (): void => {
    const { players, fieldSize } = this.state;
    this.props.actions.startGame({ players, fieldSize: fieldSize });
    this.props.history.push('/game');
  };

  render() {
    const { players, fieldSize } = this.state;
    const isStartGameDisabled = players.length < 2 || fieldSize < StartGame.minFieldSize || fieldSize > StartGame.maxFieldSize;
    return (
      <Grid>
        <Row className='show-grid'>
          <Col xs={12} xsOffset={0} sm={8} smOffset={2} md={6} mdOffset={3}>
            <Panel bsStyle='primary'>
              <Panel.Heading>
                <Panel.Title componentClass='h3'>Enter game parameters</Panel.Title>
              </Panel.Heading>
              <Panel.Body>

                <FormGroup>
                  <ControlLabel>Field size (from {StartGame.minFieldSize} to {StartGame.maxFieldSize})</ControlLabel>
                  <FormControl
                    type='number'
                    min={StartGame.minFieldSize}
                    max={StartGame.maxFieldSize}
                    value={this.state.fieldSize}
                    placeholder='Enter field size'
                    name='fieldSize'
                    onChange={this.handleFieldSizeChange}
                  />
                </FormGroup>

                <FormGroup>
                  <ControlLabel>Game players:</ControlLabel>
                  <div>
                    {this.renderGamePlayers()}
                  </div>
                </FormGroup>

                <AddPlayerControl selectedColors={this.getSelectedColors()} addPlayer={this.addPlayer}/>

                <Button bsStyle='primary' bsSize='large' block disabled={isStartGameDisabled} onClick={this.startGame}>
                  Start game
                </Button>
              </Panel.Body>
            </Panel>
          </Col>
        </Row>
      </Grid>
    );
  }
}
