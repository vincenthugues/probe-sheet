import { combineReducers } from 'redux';
import {
  SET_USER,
  SET_IS_AUTHENTICATED,
} from './actions';

const AUTH_DEFAULT_STATE = {
  isAuthenticated: false,
  user: null,
};

const auth = (state = AUTH_DEFAULT_STATE, action) => {
  switch (action.type) {
    case SET_IS_AUTHENTICATED:
      return {
        ...state,
        isAuthenticated: action.isAuthenticated,
      };
    case SET_USER:
      return {
        ...state,
        user: action.user,
      };
    default:
      return state;
  }
};

export default combineReducers({
  auth,
});
