import { routeActions }       from 'react-router-redux';
import Constants              from '../constants';

const Actions = {

  setTimerInterval: (interval) => ({
    type: Constants.SET_TIMER_INTERVAL,
    interval
  }),
  pause: () => ({
    type: Constants.INTERFACE_PAUSE
  }),
  play: () => ({
    type: Constants.INTERFACE_PLAY
  }),
  togglePlay: () => ({
    type: Constants.INTERFACE_TOGGLE
  }),
  setMaxVisibleCards: (max) => ({
    type: Constants.SET_MAX_VISIBLE_CARDS,
    max
  }),
  togglePluginMenu: (name) => ({
    type: Constants.TOGGLE_PLUGIN_MENU,
    name
  }),
  setTimerFunc: (func) => ({
    type: Constants.SET_TIMER_FUNC,
    func
  }),
  setActiveBranchId: (id) => ({
    type: Constants.SET_ACTIVE_BRANCH_ID,
    id
  }),
  viewCard: (index) => ({
    type: Constants.CARDS_VIEW_INDEX,
    index
  }),
  nextCard: () => ({
    type: Constants.CARDS_NEXT,
  }),
  prevCard: () => ({
    type: Constants.CARDS_PREV,
  }),
  pushCards: (cards) => ({
    type: Constants.CARDS_HISTORY_PUSH,
    cards
  }),
  setText: (text) => ({
    type: Constants.SET_CARD_TEXT,
    text
  }),
  setPreviewCards: (cards) => ({
    type: Constants.SET_PREVIEW_CARDS,
    cards
  }),
  addPreviewCard: (card) => ({
    type: Constants.ADD_PREVIEW_CARD,
    card
  }),
  clearPreviewCards: () => ({
    type: Constants.CLEAR_PREVIEW_CARDS
  }),
  setImageUrl: (url) => ({
    type: Constants.SET_IMAGE_URL,
    url
  }),
  cardHover: (id) => ({
    type: Constants.SET_CARD_HOVER_ID,
    id
  }),
  setCardDimensions: (width, height) => ({
    type: Constants.SET_CARD_DIMENSIONS,
    width, height
  }),
  togglePluginPercentages: () => ({
    type: Constants.TOGGLE_PLUGIN_PERCENTAGES
  })

};

export default Actions;
