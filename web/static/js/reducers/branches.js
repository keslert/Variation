import Constants from '../constants';
import Branch from './branch';
import { forEach, omit, map, mapValues, extend } from 'lodash';

const initialState = {};

const defaultWeight = 500;
let defaultRegistry = {};
export default function reducer(state = initialState, action = {}) {
  let branch;
  switch (action.type) {

    case Constants.BRANCHES_CREATE_BRANCH:
      if(state[action.card.id]) { // Branch already exists
        return state;
      }

      const oldBranch = state[action.branchId] || {};
      const oldRegistry = oldBranch.registry || {};

      branch = Branch(undefined, action);
      branch.registry = {...oldRegistry, ...defaultRegistry};
      branch.id = action.card.id
      forEach(action.card.meta, (_, key) => {
        branch.registry[key] = (defaultWeight * 4);
      })

      const locked = _.keys(_.pickBy(oldRegistry, weight => weight == 0))
      forEach(locked, key => {
        branch.registry[key] = 0;
      })
      forEach(action.card.custom, (value, key) => {
        branch.registry[key] = value;
      })

      return {...state, [branch.id]: {...branch, masterCard: action.card}}

    case Constants.BRANCHES_REMOVE_BRANCH:
      return omit(state, action.id);

    case Constants.BRANCH_SAVE_CARD:
    case Constants.BRANCH_REMOVE_CARD:
    case Constants.BRANCH_SET_MASTER_CARD:
    case Constants.BRANCH_SET_REGISTRY_VALUE:
    case Constants.BRANCH_UPDATE_REGISTRY_FROM_CARD:
    case Constants.BRANCH_SET_PLUGIN_ACTIVATION:
      branch = Branch(state[action.id], action);
      return {...state, [branch.id]: branch}


    case Constants.REGISTER_PLUGINS:
      defaultRegistry = {};
      forEach(action.plugins, plugin => {
        forEach(plugin.params, (param, param_key) => {
          forEach(param.options, option => {
            let key = `${plugin.name}-${param_key}-${option.label}`;
            if(option.custom) {
              defaultRegistry[key] = 0;
              defaultRegistry[`custom-${plugin.name}-${param_key}`] = option.value;
            } else {
              defaultRegistry[key] = defaultWeight;
            }
          })
        })
      })

      return state;

    // case Constants.REGISTER_PLUGIN_WEIGHT:
    //   defaultRegistry = {...defaultRegistry, [action.key]: defaultWeight};
    //
    //   let branches = map(state, branch => ({
    //     ...branch,
    //     registry: {...defaultRegistry, ...branch.registry}
    //   }))
    //
    //   return _.zipObject(map(branches, 'id'), branches);

    case Constants.BRANCH_RESET_WEIGHTS:
      branch = state[action.id];
      let registry = mapValues(branch.registry, (weight, key) => {
        if(key.startsWith(action.prefix)) {
          return weight === 0 ? 0 : defaultWeight;
        }
        return weight
      })
      return {...state, [branch.id]: {...branch, registry}}

    default:
      return state;

  }





}
