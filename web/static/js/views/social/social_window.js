import React from 'react';
import { connect } from 'react-redux';
import cn from 'classnames';
import SocialCard from './social_card';
import SocialEditableCard from './social_editable_card';
import BranchActions from '../../actions/branches';
import InterfaceActions from '../../actions/interface';
import key from 'keymaster';
import Optional from '../components/optional';
import Scaled from '../components/scaled';
import html2canvas from 'html2canvas';

class SocialWindow extends React.Component {

  componentDidMount() {
    key('f', () => this.saveCard(0));
    key('j', () => this.saveCard(1));
    key('v', () => this.saveCard(2));
    key('n', () => this.saveCard(3));
  }

  componentWillUnmount() {
    key.unbind('fjvn');
  }

  saveCard(index) {
    const { cards, saveCard, multiplier, branch } = this.props;
    if(cards[index]) {
      saveCard(branch.id, cards[index], multiplier)
    }
  }

  shouldHighlight(card) {
    const { branch, mode } = this.props;
    return mode.explore && _.some(branch.cards, bCard => bCard.id == card.id);
  }

  render() {
    const {
      cards,
      saveCard,
      multiplier,
      branch,
      previewCards,
      mode,
      exploreMode,
      cardHoverId,
    } = this.props;

    let _cards = mode.explore ? cards : previewCards;

    return (
      <div className={cn('window', 'social-window', mode)}>
        <Optional show={!mode.explore}>
          <div className="header">
            <div className="btn btn-default btn-xs" onClick={() => exploreMode()}>
              Back to exploration mode
            </div>
          </div>
        </Optional>
        <div className="artboard">
          <div className="cards">
            {_cards.map(card => {

              let maxWidth = 300;
              if(_cards.length == 2) {
                maxWidth = 500;
              } else if(_cards.length == 1) {
                maxWidth = 550;
              }

              return (
                <div className={cn('card-wrapper',{ hover: !mode.edit && card.id == cardHoverId })}
                     key={`card-${card.id}`}>
                  <Scaled width={card.style.width} height={card.style.height} scaledWidth={maxWidth}>
                    {mode.edit
                    ? <SocialEditableCard {...card}
                        onClick={ () => saveCard(branch.id, card, multiplier) } />
                    : <SocialCard {...card}
                        onClick={ () => saveCard(branch.id, card, multiplier) } />
                    }
                  </Scaled>
                  <Optional show={card.label}>
                    <p className="card-label">{card.label}</p>
                  </Optional>
                </div>
              )
            })}
            <Optional show={false}>
              <div className="btn btn-primary" onClick={ () => {
                  html2canvas(document.body, {
                      onrendered(canvas) {
                        let myImage = canvas.toDataURL("image/jpg");
                        window.open(myImage);
                      }
                  });
                }}>
                Export
              </div>
            </Optional>
          </div>
        </div>
      </div>
    )
  }

}

const mapStateToProps = (state) => ({
  multiplier: state.interface.decisionStrength,
  cards: state.interface.cardsHistory[state.interface.cardsIndex] || [],
  branch: state.branches[state.interface.activeBranchId],
  previewCards: state.interface.previewCards,
  mode: state.interface.mode,
  cardHoverId: state.interface.cardHoverId,
  openPlugin: state.plugins[state.interface.openedPluginMenu],
})
const mapDispatchToProps = (dispatch) => ({
  saveCard(id, card, multiplier) {
    dispatch(BranchActions.saveCard(id, card, multiplier));
  },
  exploreMode() {
    dispatch(InterfaceActions.clearPreviewCards());
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(SocialWindow);
