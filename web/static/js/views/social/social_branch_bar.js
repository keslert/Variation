import React from 'react';
import ReactDOM from 'react-dom';
import cn from 'classnames'
import { connect } from 'react-redux';
import Scaled from '../components/scaled';
import SocialCard from './social_card';
import Optional from '../components/optional';
import IconButton from '../components/icon_button';
import PluginsActions from '../../actions/plugins';
import BranchesActions from '../../actions/branches';
import InterfaceActions from '../../actions/interface';
import key from 'keymaster';

class SocialBranchBar extends React.Component {

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  componentDidUpdate(prevProps) {
    const { branch } = this.props;
    if(prevProps.branch && prevProps.branch.cards.length < branch.cards.length) {
      let node = ReactDOM.findDOMNode(this).querySelector('.cards');
      node.scrollLeft = node.scrollWidth;
    }
  }

  handleScroll(e) {
    debugger;
    let delta = e.target.scrollTop;
    e.target.scrollLeft += delta;
  }

  render() {
    const {
      branch,
      branches,
      cardHoverId,
      activeBranchId,
      decisionStrength,
      removeSaved,
      createBranch,
      setActiveBranch,
      removeBranch,
      setPreviewCards,
      addPreviewCard,
    } = this.props;

    if(!branch) {
      return null;
    }

    const branchCards = _.filter(_.map(branches, b => b.masterCard), b => b.id != branch.id);

    return (
      <div className="branch-bar social-branch-bar">
        <div className="branch-card">
          <Scaled width={branch.masterCard.style.width}
                  height={branch.masterCard.style.height}
                  scaledHeight={120}>
            <SocialCard {...branch.masterCard} onClick={ () => {
                if(key.shift) { addPreviewCard(branch.masterCard); }
                else { setPreviewCards([branch.masterCard]) }
              }} />
          </Scaled>
          <div className="branch-options">
            {_.map(branchCards, card => {
              const { width, height } = card.style;
              return (
                <div className="card-wrapper" key={`branch-card-${card.id}`}>
                  <Scaled width={width} height={height} scaledHeight={120}>
                    <SocialCard {...card} onClick={ () => {
                        setActiveBranch(card.id)
                      }}/>
                  </Scaled>
                  <Optional show={card.id != 0}>
                    <IconButton className="btn-xs hover-btn delete-btn" icon="remove" onClick={(e) => {
                        e.stopPropagation();
                        removeBranch(card.id);
                      }}/>
                  </Optional>
                </div>
              )
            })}
          </div>
        </div>
        <div className="cards">
          {_.map(branch.cards, card => {
            const { width, height } = card.style;
            return (
              <div className={cn('card-wrapper', { hover: card.id == cardHoverId })}
                   key={`card-${card.id}`}>
                <Scaled width={width} height={height} scaledHeight={110}>
                  <SocialCard {...card} onClick={ () => {
                      if(key.shift) { addPreviewCard(card); }
                      else { setPreviewCards([card]) }
                    }}/>
                </Scaled>

                <IconButton className="btn-xs hover-btn delete-btn" icon="remove" onClick={(e) => {
                    e.stopPropagation();
                    removeSaved(branch.id, card, 1 / decisionStrength);
                  }}/>

                <IconButton className="btn-xs hover-btn branch-btn" icon="thumb-tack" onClick={(e) => {
                    e.stopPropagation();
                    createBranch(card, branch.id);
                  }}/>
              </div>
            )

          })}
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
})

const mapDispatchToProps = (dispatch) => ({
  removeSaved(id, card, multiplier) {
    dispatch(BranchesActions.removeCard(id, card, multiplier));
  },
  createBranch(card, branchId) {
    dispatch(BranchesActions.createBranch(card, branchId));
    dispatch(InterfaceActions.setActiveBranchId(card.id));
  },
  setActiveBranch(id) {
    dispatch(InterfaceActions.setActiveBranchId(id));
  },
  removeBranch(id) {
    dispatch(BranchesActions.removeBranch(id));
  },
  setPreviewCards(cards) {
    dispatch(InterfaceActions.setPreviewCards(cards));
  },
  addPreviewCard(card) {
    dispatch(InterfaceActions.addPreviewCard(card));
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(SocialBranchBar);

// https://libraries.io/bower/caman
