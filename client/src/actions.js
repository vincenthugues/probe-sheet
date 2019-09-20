import {
  fetchSheets, createSheet,
} from './apiHandler';

/*
 * action types
 */

export const SET_USER = 'SET_USER';
export const SET_IS_AUTHENTICATED = 'SET_IS_AUTHENTICATED';

export const GET_SHEETS = 'GET_SHEETS';
export const CREATE_SHEET = 'CREATE_SHEET';

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
  return dispatch(getSheetsActionCreator(sheets)); // RETURN?
};

const createSheetActionCreator = sheet => ({
  type: CREATE_SHEET,
  sheet,
});
export const createSheetHandler = dispatch => async (sheetDraft) => {
  const sheet = await createSheet(sheetDraft);
  dispatch(createSheetActionCreator(sheet));
};
