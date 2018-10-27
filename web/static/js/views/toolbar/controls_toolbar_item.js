import React       from 'react';
import { connect } from 'react-redux';
import classnames  from 'classnames';
import ToolbarItem from './toolbar_item';
import IconButton  from '../components/icon_button';
import Actions     from '../../actions/interface';

class ControlsToolbarItem extends React.Component {

  render() {

    const {timer, play, pause, prev, next, activeIndex, history} = this.props;

    return (
      <ToolbarItem label="">
        <div className="btn-group">
          <IconButton icon="step-backward"
                      className={classnames({disabled: activeIndex == 0})}
                      onClick={prev} />
          <IconButton icon="play"
                      className={classnames({active: timer !== null})}
                      onClick={play} />
          <IconButton icon="pause"
                      className={classnames({active: timer === null})}
                      onClick={pause} />
          <IconButton icon="step-forward"
                      onClick={next} />
        </div>
      </ToolbarItem>
    )
  }
}

const mapStateToProps = (state) => ({
  timer: state.interface.timer,
  activeIndex: state.interface.cardsIndex
});

const mapDispatchToProps = (dispatch) => ({
  play() {
    dispatch(Actions.play());
  },
  pause() {
    dispatch(Actions.pause());
  },
  next() {
    dispatch(Actions.nextCard())
  },
  prev() {
    dispatch(Actions.prevCard());
    dispatch(Actions.pause());
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(ControlsToolbarItem);
