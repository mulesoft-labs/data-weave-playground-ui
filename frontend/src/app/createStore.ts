import { createStore as createReduxStore, applyMiddleware, compose, Store } from 'redux';
import RequestManager from 'managers/RequestManager';
import thunk from 'redux-thunk';
import { IStore } from 'common/types';
import reducer from 'common/reducer';
declare var window;

const createStore = (initialState?: IStore) => {
  const requestManager = new RequestManager();
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  let store: Store<IStore>;
  if (initialState) {
    store = createReduxStore(
      reducer,
      initialState,
      composeEnhancers(applyMiddleware(thunk.withExtraArgument(requestManager)))
    );
  } else {
    store = createReduxStore(
      reducer,
      composeEnhancers(applyMiddleware(thunk.withExtraArgument(requestManager)))
    );
  }
  return store;
};

export default createStore;
