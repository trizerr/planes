import { combineReducers } from 'redux';
import trackerReducer from './tracker/tracker.slice';

const rootReducer = combineReducers({
  tracker: trackerReducer,
});

export default rootReducer;
