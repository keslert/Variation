import { combineReducers }  from 'redux';
import { routeReducer }     from 'react-router-redux';
import session              from './session';
import plugins              from './plugins';
import interface_           from './interface';
import branches             from './branches';

export default combineReducers({
  routing: routeReducer,
  session,
  interface: interface_,
  plugins,
  branches
});
