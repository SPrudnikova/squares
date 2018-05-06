import { combineReducers } from 'redux';
import { RootState } from './state';
import { gameReducer } from './game/reducer';
import { routerReducer, RouterState } from 'react-router-redux';

export { RootState, RouterState };

// NOTE: current type definition of Reducer in 'react-router-redux' and 'redux-actions' module
// doesn't go well with redux@4
export const rootReducer = combineReducers<RootState>({
  game: gameReducer as any,
  router: routerReducer as any
});
