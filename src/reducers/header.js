import { SET_TITLE} from '../constants/actionTypes'

const initialState = {
    title: ''
};

export default function header(state = initialState, action) {
    switch(action.type)
    {
        case SET_TITLE:
            return {title: action.title};

        default:
            return state;
    }
};