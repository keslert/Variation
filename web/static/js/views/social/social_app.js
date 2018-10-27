import React                  from 'react';
import { connect }            from 'react-redux';
import Constants              from '../../constants';
import classnames             from 'classnames';

import SocialSidebar          from './social_sidebar';
import SocialWindow           from './social_window';
import PluginsMenu            from '../plugins/plugins_menu';
import SocialToolbar          from './social_toolbar';
import SocialBranchBar              from './social_branch_bar';
import Optional               from '../components/optional';

import { browserHistory } from 'react-router';
import InterfaceActions       from '../../actions/interface';
import BranchesActions        from '../../actions/branches';
import PluginsActions         from '../../actions/plugins';
import _                      from 'lodash';
import key                    from 'keymaster';
import { setDocumentTitle }  from '../../utils';
import { generateCard } from '../../utils/card_utils';

class SocialApp extends React.Component {

  componentDidMount() {
    setDocumentTitle('Social');

    const { branch, setTimerFunc, play, togglePlay, next, prev, closePreview} = this.props;

    if(!branch) {
      browserHistory.push('/app');
      return;
    }

    setTimerFunc((force) => this.update(force))
    play();

    key('left', () => prev());
    key('right', () => next());
    key('escape', () => closePreview())
    key('p,s', () => {
      togglePlay()
    });

  }

  componentWillUnmount() {
    this.props.pause();
    ['left', 'right', 'p', 's', 'escape'].forEach(k => key.unbind(k))
  }

  update(force) {
    const { text, plugins, numVisibleCards, cardWidth, cardHeight,
      branch, registerPluginWeight } = this.props;

    let cards = _.range(numVisibleCards + 6).map(() => {
      return generateCard(plugins, text, {width: cardWidth, height: cardHeight }, branch.registry);
    });

    cards = _.take(_.sortBy(cards, 'score'), numVisibleCards);

    setTimeout(() => { // Give opportunity for a pause.
      const {timer, pushCards, updateBranchFromCard, indifferenceStrength} = this.props;
      if(timer || force) {
        cards.forEach(card => updateBranchFromCard(branch.id, card, indifferenceStrength));
        pushCards(cards);
      }
    }, 1);
  }

  render() {
    const { previewCards } = this.props;
    return (
      <div className="app social-app">
        <SocialToolbar />
        <PluginsMenu />
        <SocialWindow />
        <SocialBranchBar />
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  plugins: state.plugins,
  timer: state.interface.timer,
  numVisibleCards: state.interface.numVisibleCards,
  text: state.interface.text,
  cardWidth: state.interface.cardWidth,
  cardHeight: state.interface.cardHeight,
  decisionStrength: state.interface.decisionStrength,
  indifferenceStrength: state.interface.indifferenceStrength,
  branch: state.branches[state.interface.activeBranchId],
  previewCards: state.interface.previewCards,
});
const mapDispatchToProps = (dispatch) => ({
  setTimerFunc(func) {
    dispatch(InterfaceActions.setTimerFunc(func));
  },
  play() {
    dispatch(InterfaceActions.play())
  },
  pause() {
    dispatch(InterfaceActions.pause())
  },
  next() {
    dispatch(InterfaceActions.nextCard())
  },
  prev() {
    dispatch(InterfaceActions.prevCard());
    dispatch(InterfaceActions.pause());
  },
  pushCards(cards) {
    dispatch(InterfaceActions.pushCards(cards));
  },
  togglePlay() {
    dispatch(InterfaceActions.togglePlay())
  },
  updateBranchFromCard(id, card, multiplier) {
    dispatch(BranchesActions.updateBranchWeightsFromCard(id, card, multiplier));
  },
  registerKey(key, weight) {
    dispatch(PluginsActions.setRegistryWeight(key, weight));
  },
  createBranch(card) {
    dispatch(BranchesActions.createBranch(card));
  },
  setActiveBranchId(id) {
    dispatch(InterfaceActions.setActiveBranchId(id));
  },
  registerPluginWeight(key) {
    dispatch(PluginsActions.registerPluginWeight(key));
  },
  closePreview() {
    dispatch(InterfaceActions.clearPreviewCards());
  }
})
export default connect(mapStateToProps, mapDispatchToProps)(SocialApp);
