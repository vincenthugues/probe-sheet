import { combineReducers } from 'redux';
import {
  SET_USER,
  SET_IS_AUTHENTICATED,
  GET_SHEETS,
  CREATE_SHEET,
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

const PROBESHEETS_DEFAULT_STATE = {
  sheets: [],
};

const probeSheets = (state = PROBESHEETS_DEFAULT_STATE, action) => {
  switch (action.type) {
    case GET_SHEETS:
      return {
        ...state,
        sheets: action.sheets,
      };
    case CREATE_SHEET:
      return {
        ...state,
        sheets: [...state.sheets, action.sheet],
      };
    default:
      return state;
  }
};

export default combineReducers({
  auth,
  probeSheets,
});
