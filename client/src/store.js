import { createStore } from 'redux';

import appReducer from './reducers';

export default createStore(
  appReducer,
  // eslint-disable-next-line no-underscore-dangle
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);
