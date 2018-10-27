import Constants  from '../constants';
import { constrain } from '../utils';
import { random, uniqBy } from 'lodash';

const initialMode = {
  explore: false,
  edit: false,
  preview: false
}

const initialState = {
  timer: null,
  timerInterval: 2000,
  timerFunc: null,
  decisionStrength: 1.4,
  indifferenceStrength: 0.99,
  numVisibleCards: 2,
  openedPluginMenu: null,
  activeBranchId: null,
  showPluginPercentages: false,
  mode: {...initialMode, explore: true},
  text: '',
  cardWidth: 300,
  cardHeight: 300,
  cardsHistory: [],
  cardsIndex: 0,
  cardHoverId: null,
  previewCards: [],
  imageUrl: '',
};

const maxHistory = 10;
export default function reducer(state = initialState, action = {}) {

  let pause = () => {
    if(state.timer !== null) {
      clearInterval(state.timer);
    }
    return {...state, timer: null}
  }

  let play = () => {
    let timer = state.timer;
    if(timer === null) {
      if(state.timerFunc === null) {
        console.log('Tried to start the timer without a function');
      } else {
        timer = setInterval(state.timerFunc, state.timerInterval)
        state.timerFunc();
      }
    }

    return {...state, timer, previewCards: [], mode: {...initialMode, explore: true}}
  }

  let cardsHistory, cardsIndex;

  switch (action.type) {

    case Constants.INTERFACE_PAUSE:
      return pause();

    case Constants.INTERFACE_PLAY:
      return play();

    case Constants.INTERFACE_TOGGLE:
      if(state.timer) {
        return pause();
      }
      return play();

    case Constants.SET_TIMER_FUNC:
      return {...state, timerFunc: action.func}

    case Constants.SET_TIMER_INTERVAL:
      pause();
      let timer = setInterval(state.timerFunc, action.interval);
      return {...state, timerInterval: action.interval, timer}

    case Constants.SET_DECISION_STRENGTH:
      return {...state, decisionStrength: action.strength}

    case Constants.SET_MAX_VISIBLE_CARDS:
      return {...state, numVisibleCards: action.max}

    case Constants.TOGGLE_PLUGIN_MENU:
      if(state.openedPluginMenu == action.name) {
        return {...state, openedPluginMenu: null}
      }
      return {...state, openedPluginMenu: action.name}

    case Constants.CARDS_HISTORY_PUSH:
      cardsHistory = [...state.cardsHistory, action.cards].slice(-maxHistory);
      let max = Math.min(maxHistory, cardsHistory.length);
      return {...state, cardsHistory, cardsIndex: max - 1}

    case Constants.CARDS_VIEW_INDEX:
      cardsIndex = constrain(action.index, 0, state.cardsHistory.length);
      return {...state, cardsIndex}

    case Constants.CARDS_NEXT:
      // cardsIndex = constrain(state.cardsIndex + 1, 0, state.cardsHistory.length - 1);
      if(state.cardsIndex >= state.cardsHistory.length - 1) {
        state.timerFunc(true);
        return pause();
      }

      return {...state, cardsIndex: state.cardsIndex + 1}

    case Constants.CARDS_PREV:
      cardsIndex = constrain(state.cardsIndex - 1, 0, state.cardsHistory.length - 1);
      return {...state, cardsIndex}

    case Constants.SET_CARD_TEXT:
      return {...state, text: action.text}

    case Constants.SET_ACTIVE_BRANCH_ID:
      return {...state, activeBranchId: action.id}

    case Constants.BRANCHES_REMOVE_BRANCH: // If the active branch is removed...
      if(state.activeBranchId === action.id) {
        return {...state, activeBranchId: 0}
      }
      return state;

    case Constants.SET_PREVIEW_CARDS:
      return {...pause(),
        previewCards: action.cards,
        mode: {...initialMode,
          edit: action.cards.length == 1,
          preview: action.cards.length > 1
        }
      }
    case Constants.ADD_PREVIEW_CARD:
      let _cards = _.uniqBy([...state.previewCards, action.card], card => card.id);
      return {...pause(),
        previewCards: _cards,
        mode: {...initialMode,
          edit: _cards.length == 1,
          preview: _cards.length > 1
        }
      }

    case Constants.CLEAR_PREVIEW_CARDS:
      return {...state, previewCards: [], mode: {...initialMode, explore: true}}

    case Constants.SET_IMAGE_URL:
      return {...state, imageUrl: action.url}

    case Constants.SET_CARD_HOVER_ID:
      return {...state, cardHoverId: action.id}

    case Constants.SET_CARD_DIMENSIONS:
     return {...state, cardWidth: action.width, cardHeight: action.height}

    case Constants.TOGGLE_PLUGIN_PERCENTAGES:
      return {...state, showPluginPercentages: !state.showPluginPercentages}

    default:
      return state;
  }
}
