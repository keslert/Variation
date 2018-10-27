import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import Chunk from '../components/chunk';
import InterfaceActions from '../../actions/interface';

let SocialCard = ({
  id,
  chunks,
  style,
  url,
  defaultUrl,
  onClick,
  onMouseEnter,
  onMouseLeave,
  cardHoverId,
  classNames
}) => (
  <div id={`card-${id}`} className={classnames('card', 'social-card', {clickable: !!onClick}, classNames)}
       style={{...style}}
       onClick={ () => onClick && onClick()}
       onMouseEnter={ () => onMouseEnter(id) }
       onMouseLeave={ () => onMouseLeave(id) }>
    <div className="card-content">
      {chunks.map((chunk, index) => (
        <Chunk {...chunk} key={`chunk-${index}`}/>
      ))}
    </div>
    <img src={url || defaultUrl} crossOrigin="anonymous" />
  </div>
)

SocialCard.propTypes = {
  style: React.PropTypes.object.isRequired,
  chunks: React.PropTypes.array.isRequired
}

const mapStateToProps = (state) => ({
  defaultUrl: state.interface.imageUrl,
})

const mapDispatchToProps = (dispatch) => ({
  onMouseEnter(id) {
    dispatch(InterfaceActions.cardHover(id));
  },
  onMouseLeave(id) {
    dispatch(InterfaceActions.cardHover(null));
  }
})
export default connect(mapStateToProps, mapDispatchToProps)(SocialCard);
