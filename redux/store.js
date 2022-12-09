import { legacy_createStore as createStore } from 'redux';
import { combineReducers } from 'redux';
import { CHANGE_PAGE_NAME } from './types';

const initialState = {
    name: '',
}

const pageNameReducer = (state = initialState, {type, payload}) => {
    switch (type) {
        case CHANGE_PAGE_NAME:
            return {...state, name: payload}
        default: 
            return state
    }
}

const rootReducer = combineReducers({
    page: pageNameReducer,
})

const store = createStore(rootReducer);

export default store;
