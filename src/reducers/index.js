
import { combineReducers } from 'redux'
import games from './games';
import header from './header';

const rootReducer = combineReducers({
  games,
  header
})

export default rootReducer