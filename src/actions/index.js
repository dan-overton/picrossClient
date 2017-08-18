import * as types from '../constants/actionTypes'
import { CALL_API }from '../middleware/api';

export const getGames = () => ({ type: types.GET_GAMES,         
    [CALL_API]: {
          method: 'get',
          path: 'games', 
          sendingType: types.GET_GAMES, 
          successType: types.GET_GAMES_SUCCESS, 
          failureType: types.GET_GAMES_FAILURE  }});

export const setTitle = (title) => ({
    type: types.SET_TITLE,
    title: title
})