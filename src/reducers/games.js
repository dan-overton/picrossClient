import { GET_GAMES, GET_GAMES_SUCCESS, GET_GAMES_FAILURE } from '../constants/actionTypes'

const initialState = {
    loading: true,
    errored: false,
    errorMessage: '',
    items: []
};

export default function games(state = initialState, action) {
    switch(action.type)
    {
        case GET_GAMES:
            return {items: [], loading: true, errored: false, errorMessage: ''};
        
        case GET_GAMES_SUCCESS: 
            return {
                items: action.response, loading: false, errored: false, errorMessage: ''
            };
        
        case GET_GAMES_FAILURE: 
            return {
                items: [], loading: false, errored: true, errorMessage: action.response.message
            };

        default:
            return state;
    }
};