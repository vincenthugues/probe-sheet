/*
 * action types
 */

export const SET_USER = 'SET_USER';
export const SET_IS_AUTHENTICATED = 'SET_IS_AUTHENTICATED';

/*
 * other constants
 */


/*
 * action creators
 */

export const setUser = user => ({ type: SET_USER, user });
export const setIsAuthenticated = isAuthenticated => ({
  type: SET_IS_AUTHENTICATED,
  isAuthenticated,
});
