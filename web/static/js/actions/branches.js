import { routeActions }   from 'react-router-redux';
import Constants          from '../constants';

const Actions = {

  createBranch: (card, branchId) => ({
    type: Constants.BRANCHES_CREATE_BRANCH,
    card,
    branchId
    // locks: locks || [],
  }),
  removeBranch: (id) => ({
    type: Constants.BRANCHES_REMOVE_BRANCH,
    id
  }),
  saveCard: (id, card, multiplier) => ({
    type: Constants.BRANCH_SAVE_CARD,
    id, card, multiplier
  }),
  removeCard: (id, card, multiplier) => ({
    type: Constants.BRANCH_REMOVE_CARD,
    id, card, multiplier
  }),
  setBranchRegistryValue: (id, key, value) => ({
    type: Constants.BRANCH_SET_REGISTRY_VALUE,
    id, key, value
  }),
  updateBranchWeightsFromCard: (id, card, multiplier) => ({
    type: Constants.BRANCH_UPDATE_REGISTRY_FROM_CARD,
    id, card, multiplier
  }),
  resetBranchWeights: (id, prefix) => ({
    type: Constants.BRANCH_RESET_WEIGHTS,
    id, prefix
  }),
  setPluginActivation: (id, name, activate) => ({
    type: Constants.BRANCH_SET_PLUGIN_ACTIVATION,
    id, name, activate
  })


};

export default Actions;
