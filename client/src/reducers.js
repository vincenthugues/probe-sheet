import { combineReducers } from 'redux';
import {
  compose, groupBy, head, map, prop,
} from 'ramda';

import {
  SET_USER,
  SET_IS_AUTHENTICATED,
  GET_SHEETS,
  CREATE_SHEET,
  GET_TARGETS,
  CREATE_TARGET,
  GET_PROBES,
  CREATE_PROBE,
  GET_COMMENTS,
  CREATE_COMMENT,
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
  targets: [],
  probes: [],
  comments: [],
};

const getItemsById = compose(
  map(head),
  groupBy(prop('id')),
);

const mergeArraysById = (currentArray, newArray) => {
  const currentArrayById = getItemsById(currentArray);

  const mergedObj = newArray.reduce((acc, item) => ({
    ...acc,
    [item.id]: acc[item.id]
      ? { ...acc[item.id], ...item }
      : item,
  }), currentArrayById);

  return Object.values(mergedObj);
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
    case GET_TARGETS:
      return {
        ...state,
        targets: mergeArraysById(state.targets, action.targets),
      };
    case CREATE_TARGET:
      return {
        ...state,
        targets: [...state.targets, action.target],
      };
    case GET_PROBES:
      return {
        ...state,
        probes: mergeArraysById(state.probes, action.probes),
      };
    case CREATE_PROBE:
      return {
        ...state,
        probes: [...state.probes, action.probe],
      };
    case GET_COMMENTS:
      return {
        ...state,
        comments: mergeArraysById(state.comments, action.comments),
      };
    case CREATE_COMMENT:
      return {
        ...state,
        comments: [...state.comments, action.comment],
      };
    default:
      return state;
  }
};

export default combineReducers({
  auth,
  probeSheets,
});
