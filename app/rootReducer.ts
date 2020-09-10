import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';
// eslint-disable-next-line import/no-cycle
import logReducer from './features/logReader/logReaderSlice';

export default function createRootReducer(history: History) {
  return combineReducers({
    router: connectRouter(history),
    log: logReducer,
  });
}
