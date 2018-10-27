import React                  from 'react';
import ReactDOM               from 'react-dom';
import { connect }            from 'react-redux';
import Constants              from '../../constants';
import classnames             from 'classnames';
import PluginsActions         from '../../actions/plugins';
import BranchesActions        from '../../actions/branches';
import InterfaceActions       from '../../actions/interface';
import IconButton             from '../components/icon_button';
import SocialCard             from './social_card';
import Optional               from '../components/optional';
import Scaled                 from '../components/scaled';
import key                    from 'keymaster';

class SocialSidebar extends React.Component {

  componentDidUpdate(prevProps) {
    const { branch } = this.props;
    if(prevProps.branch && prevProps.branch.cards.length < branch.cards.length) {
      let node = ReactDOM.findDOMNode(this).querySelector('.saved-column .cards');
      node.scrollTop = node.scrollHeight;
    }
  }

  render() {
    const {
      branch,
      branches,
      removeSaved,
      removeBranch,
      createBranch,
      decisionStrength,
      activeBranchId,
      setActiveBranch,
      saveAsBranch,
      setPreviewCards,
      addPreviewCard,
      cardHoverId
    } = this.props

    let branchCards = _.map(branches, 'masterCard');

    return (
      <div className="sidebar">

        <div className="column branch-column">
          <div className="header" onClick={() => setPreviewCards(branchCards)}>
            View Favorites
          </div>
          <div className="cards">
            {_.map(branchCards, (card, index) => (
              <div className={classnames('card-wrapper', {
                    active: card.id == activeBranchId,
                    hover: card.id == cardHoverId
                   })}
                   key={`saved-${index}`} >

                <Scaled width={card.style.width} height={card.style.height} scaledWidth={112}>
                  <SocialCard {...card} onClick={() => {
                    if(key.shift) {
                      addPreviewCard(card);
                    } else {
                      setPreviewCards([card])
                    }
                  }} />
                </Scaled>

                <Optional show={card.id != 0}>
                  <IconButton className="btn-xs hover-btn delete-btn"
                              icon="remove"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeBranch(card.id);
                              }}/>
                </Optional>

                <Optional show={card.id != activeBranchId}>
                  <IconButton className="btn-xs hover-btn search-btn"
                              icon="check"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveBranch(card.id);
                              }}/>

                </Optional>
              </div>
            ))}
          </div>
        </div>

        <div className="column saved-column">
          <div className="header" onClick={() => setPreviewCards(branch.cards)}>
            View Saved
          </div>
          <div className="cards">
            {_.map(branch ? branch.cards : [], (card, index) => (
              <div className={classnames('card-wrapper', {
                     hover: card.id == cardHoverId
                   })}
                   key={`saved-${index}`}>
                <Scaled width={card.style.width} height={card.style.height} scaledWidth={112}>
                  <SocialCard {...card} onClick={() => {
                    if(key.shift) {
                      addPreviewCard(card);
                    } else {
                      setPreviewCards([card])
                    }
                  }} />
                </Scaled>
                <IconButton className="btn-xs hover-btn delete-btn"
                            icon="remove"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeSaved(branch.id, card, 1 / decisionStrength);
                            }}/>

                <Optional show={_.every(branchCards, bCard => bCard.id != card.id)}>
                  <IconButton className="btn-xs hover-btn branch-btn"
                            icon="heart"
                            onClick={(e) => {
                              e.stopPropagation();
                              createBranch(card);
                            }}/>
                </Optional>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
}


const mapStateToProps = (state) => ({
  branch: state.branches[state.interface.activeBranchId],
  branches: state.branches,
  decisionStrength: state.interface.decisionStrength,
  activeBranchId: state.interface.activeBranchId,
  cardHoverId: state.interface.cardHoverId,
});

const mapDispatchToProps = (dispatch, state) => ({
  removeSaved(id, card, multiplier) {
    dispatch(BranchesActions.removeCard(id, card, multiplier));
  },
  createBranch(card) {
    dispatch(BranchesActions.createBranch(card));
  },
  removeBranch(id) {
    dispatch(BranchesActions.removeBranch(id));
  },
  setActiveBranch(id) {
    dispatch(InterfaceActions.setActiveBranchId(id));
  },
  setPreviewCards(cards) {
    dispatch(InterfaceActions.setPreviewCards(cards));
  },
  addPreviewCard(card) {
    dispatch(InterfaceActions.addPreviewCard(card));
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(SocialSidebar);
