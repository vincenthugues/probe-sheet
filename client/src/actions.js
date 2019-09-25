import {
  fetchSheets,
  createSheet,
  fetchTargets,
  createTarget,
  fetchProbes,
  createProbe,
  fetchComments,
  createComment,
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

export const GET_PROBES = 'GET_PROBES';
export const CREATE_PROBE = 'CREATE_PROBE';

export const GET_COMMENTS = 'GET_COMMENTS';
export const CREATE_COMMENT = 'CREATE_COMMENT';

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

const getProbesActionCreator = probes => ({
  type: GET_PROBES,
  probes,
});
export const getProbesHandler = dispatch => async (targetId) => {
  const probes = await fetchProbes(targetId);
  return dispatch(getProbesActionCreator(probes));
};

const createProbeActionCreator = probe => ({
  type: CREATE_PROBE,
  probe,
});
export const createProbeHandler = dispatch => async (probeDraft) => {
  const probe = await createProbe(probeDraft);
  return dispatch(createProbeActionCreator(probe));
};

const getCommentsActionCreator = comments => ({
  type: GET_COMMENTS,
  comments,
});
export const getCommentsHandler = dispatch => async (probeId) => {
  const comments = await fetchComments(probeId);
  return dispatch(getCommentsActionCreator(comments));
};

const createCommentActionCreator = comment => ({
  type: CREATE_COMMENT,
  comment,
});
export const createCommentHandler = dispatch => async (text, probeId) => {
  const comment = await createComment(text, probeId);
  return dispatch(createCommentActionCreator(comment));
};
