import React          from 'react';
import { connect }    from 'react-redux';
import classnames     from 'classnames';
import ToolbarItem    from './toolbar_item';
import TextButton     from '../components/text_button';
import Actions        from '../../actions/interface';
import { range, map } from 'lodash';

class HistoryToolbarItem extends React.Component {

  render() {

    const {history, activeIndex, viewCard} = this.props;

    return (
      <ToolbarItem label="History" icon="history">
        <div className="btn-group">
          {map(range(history.length), (i) => (
            <TextButton text={i + 1}
                        className={classnames({active: activeIndex == i})}
                        onClick={() => viewCard(i)}
                        key={`history-${i}`} />
          ))}
        </div>
      </ToolbarItem>
    )
  }
}


const mapStateToProps = (state) => ({
  history: state.interface.cardsHistory,
  activeIndex: state.interface.cardsIndex
});

const mapDispatchToProps = (dispatch) => ({
  viewCard(index) {
    dispatch(Actions.viewCard(index));
    dispatch(Actions.pause())
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(HistoryToolbarItem);
