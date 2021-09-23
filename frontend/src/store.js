import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import reducer from './reducer';

const getMiddleware = () => {
  return applyMiddleware(thunk);
};

const composeEnhancers = composeWithDevTools({
  name: 'Example',
  realtime: true,
  trace: true,
  traceLimit: 20,
});

export const store = createStore(
  reducer, composeEnhancers(getMiddleware()),
);
