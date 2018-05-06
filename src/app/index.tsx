import * as React from 'react';
import { Route, Switch, Redirect } from 'react-router';

import * as style from './index.css';
import { StartGame } from 'app/scenes/StartGame';
import { Game } from 'app/scenes/Game';

export const App =() => (
  <div className={style.app_container}>
    <Switch>
      <Route path="/" component={StartGame} exact/>
      <Route path="/game" component={Game} />
      <Redirect to="/" />
    </Switch>
  </div>
);
