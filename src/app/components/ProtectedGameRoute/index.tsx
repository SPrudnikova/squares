import * as React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect, RouteComponentProps } from 'react-router';

import { RootState } from 'app/redux/reducers';
import { GameScene } from 'app/scenes/Game';


export interface Props extends RouteComponentProps<void> {}


const HOCRoute = ({ component: Component, game, ...rest }: any) => {
  return (
    <Route
      {...rest}
      render={
        (props: Props) => {
          return game.players.length > 0 ?
            <Component {...props} /> :
            <Redirect to={{ pathname: "/", state: { from: props.location } }} />
        }
      }
    />
  );
};

const ProtectedGameRoute = connect(
  (state: RootState): Pick<GameScene.Props, 'game'> => {
    return { game: state.game};
  }
)(HOCRoute);

export { ProtectedGameRoute };
