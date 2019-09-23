import {
  fetchSheets, createSheet, fetchTargets, createTarget,
} from './apiHandler';

/*
 * action types
 */

export const SET_USER = 'SET_USER';
export const SET_IS_AUTHENTICATED = 'SET_IS_AUTHENTICATED';

export const GET_SHEETS = 'GET_SHEETS';
export const CREATE_SHEET = 'CREATE_SHEET';

export const GET_TARGETS = 'GET_TARGETS';
export const CREATE_TARGET = 'CREATE_TARGET';

/*
 * other constants
 */


/*
 * action creators
 */

export const setUserActionCreator = user => ({ type: SET_USER, user });
export const setIsAuthenticatedActionCreator = isAuthenticated => ({
  type: SET_IS_AUTHENTICATED,
  isAuthenticated,
});

const getSheetsActionCreator = sheets => ({
  type: GET_SHEETS,
  sheets,
});
export const getSheetsHandler = dispatch => async () => {
  const sheets = await fetchSheets();
  return dispatch(getSheetsActionCreator(sheets));
};

const createSheetActionCreator = sheet => ({
  type: CREATE_SHEET,
  sheet,
});
export const createSheetHandler = dispatch => async (sheetDraft) => {
  const sheet = await createSheet(sheetDraft);
  return dispatch(createSheetActionCreator(sheet));
};

const getTargetsActionCreator = targets => ({
  type: GET_TARGETS,
  targets,
});
export const getTargetsHandler = dispatch => async (sheetId) => {
  const targets = await fetchTargets(sheetId);
  return dispatch(getTargetsActionCreator(targets));
};

const createTargetActionCreator = target => ({
  type: CREATE_TARGET,
  target,
});
export const createTargetHandler = dispatch => async (targetDraft) => {
  const target = await createTarget(targetDraft);
  return dispatch(createTargetActionCreator(target));
};
