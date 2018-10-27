import { routeActions }       from 'react-router-redux';
import Constants              from '../constants';

const Actions = {

  setVisible: (name, visible) => ({
    type: Constants.PLUGIN_SET_VISIBLE,
    name, visible
  }),
  setLocked: (name, locked) => ({
    type: Constants.PLUGIN_SET_LOCKED,
    name, locked
  }),
  registerPlugins: (plugins) => ({
    type: Constants.REGISTER_PLUGINS,
    plugins
  }),
  registerPluginWeight: (key) => ({
    type: Constants.REGISTER_PLUGIN_WEIGHT,
    key
  }),

};

export default Actions;
