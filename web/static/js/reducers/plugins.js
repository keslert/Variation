import Constants                    from '../constants';

const initialState = {

};

export default function reducer(state = initialState, action = {}) {
  let plugin;
  switch (action.type) {

    case Constants.PLUGIN_SET_VISIBLE:
      plugin = state[action.name];
      plugin.visible = action.visible;
      return {...state, [plugin.name]: plugin};

    case Constants.PLUGIN_SET_LOCKED:
      plugin = state[action.name];
      plugin.locked = action.locked;
      return {...state, [plugin.name]: plugin};

    case Constants.REGISTER_PLUGINS:
      return _.keyBy(action.plugins, 'name');

    default:
      return state;
  }
}
