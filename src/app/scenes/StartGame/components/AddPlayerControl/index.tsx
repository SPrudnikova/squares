import * as React from 'react';
import { FormGroup, ControlLabel, FormControl, Button, Panel } from 'react-bootstrap';

import { ColorPicker } from 'app/scenes/StartGame/components/ColorPicker';
import { PlayerModel, ColorModel } from 'app/models';


export namespace AddPlayerControlComponent {
  export interface Props {
    selectedColors: StringObject,
    addPlayer: (player: PlayerModel) => void,
  }
  export interface State {
    name: string;
    color: ColorModel;
  }
}

export class AddPlayerControl extends React.Component<AddPlayerControlComponent.Props, AddPlayerControlComponent.State> {
  constructor(props:AddPlayerControlComponent.Props) {
    super(props);
    this.state = {
      name: '',
      color: { code: '', name: '' },
    }
  }

  handleNameChange = (event: React.FormEvent<FormControl>): void => {
    this.setState({ name: (event.target as HTMLInputElement).value });
  };

  handleColorChange = (color: ColorModel): void => {
    this.setState({ color });
  };

  addPlayer = () => {
    const { name, color } = this.state;
    if (name && color.code) {
      this.props.addPlayer({
        name,
        color,
        maxSequenceLength: 0,
        squaresSequences: [],
      });
      this.setState({ name: '', color: { code: '', name: ''} });
    }
  };

  render() {
    const { name, color } = this.state;
    const isAddPlayerDisabled: boolean = !name || !color.code;
    return (
      <Panel>
        <Panel.Heading>
          <Panel.Title componentClass='h5'>Add player section</Panel.Title>
        </Panel.Heading>

        <Panel.Body>

          <FormGroup>
            <ControlLabel>Player name</ControlLabel>
            <FormControl
              type='text'
              value={name}
              placeholder='Enter player name'
              onChange={this.handleNameChange}
            />
          </FormGroup>

          <FormGroup>
            <ControlLabel>Choose player color</ControlLabel>
            <ColorPicker
              selectedColors={this.props.selectedColors}
              activeColor={color}
              handleColorChange={this.handleColorChange}/>
          </FormGroup>

          <Button disabled={isAddPlayerDisabled} onClick={this.addPlayer}>
            Add player
          </Button>

        </Panel.Body>
      </Panel>
    );
  }
}
