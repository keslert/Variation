import Constants from '../constants';
import F from '../constants/format';

const initialState = {
  cards: [],
  registry: {},
  masterCard: null,
};

export default function reducer(state = initialState, action = {}) {

  let cards, registry;

  const updatedRegistryFromMeta = (meta) => (
    _.mapValues(meta, (_, key) => (
      state.registry[key] * action.multiplier
    ))
  )

  switch (action.type) {
    case Constants.BRANCH_SAVE_CARD:
      cards = _.uniqBy([...state.cards, action.card], card => card.id);
      if(cards.length > state.cards.length) { // Make sure we actually added this
        registry = updatedRegistryFromMeta(action.card.meta);
      }
      registry = {...state.registry, ...registry};
      return {...state, cards, registry}

    case Constants.BRANCH_REMOVE_CARD:
      cards = _.filter(state.cards, card => card.id != action.card.id);
      if(cards.length < state.cards.length) { // Make sure we actually removed this
        registry = updatedRegistryFromMeta(action.card.meta);
      }
      registry = {...state.registry, ...registry};
      return {...state, cards, registry}

    case Constants.BRANCH_SET_REGISTRY_VALUE:
      registry = {...state.registry, [action.key]: action.value}
      return {...state, registry}

    case Constants.BRANCH_UPDATE_REGISTRY_FROM_CARD:
      registry = updatedRegistryFromMeta(action.card.meta);
      return {...state, registry: {...state.registry, ...registry}}

    case Constants.BRANCH_SET_PLUGIN_ACTIVATION:
      registry = {...state.registry,
        [F.pluginActivationKey(action.name)]: action.activate
      }
      return {...state, registry}

    default:
      return state;
  }
}
