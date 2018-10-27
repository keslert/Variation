import React from 'react';
import { connect } from 'react-redux';
import cn from 'classnames';
import SocialCard from './social_card';
import InterfaceActions from '../../actions/interface';
import ChunkUtils from '../../utils/chunk_utils';
import { mutateCard } from '../../utils/card_utils';


class SocialEditableCard extends React.Component {

  mutate(option, registry_key) {
    const { plugins, text, branch, previewCard } = this.props;
    previewCard(
      mutateCard(plugins, text, this.props, branch.registry, {[registry_key]: option})
    );
  }

  render() {
    const { chunks, plugins } = this.props;

    const lineMarkers = plugins['Line Breaks'].getMarkers(this.props);

    return (
      <div className={cn('card-edit')}>
        <SocialCard {...this.props} />
        <div className="markers">
          {lineMarkers.map((marker, i) => (
            <span className="marker line-marker" key={`line-marker-${i}`}
                  style={marker.style}
                  onClick={() => {
                    this.mutate(marker.option, `Line Breaks-${marker.param}`);
                  }}>
            </span>
          ))}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  defaultUrl: state.interface.imageUrl,
  plugins: state.plugins,
  branch: state.branches[state.interface.activeBranchId],
  text: state.interface.text,
  boxAlignmentPlugin: state.plugins['Box Alignment']
})

const mapDispatchToProps = (dispatch) => ({
  previewCard(card) {
    dispatch(InterfaceActions.setPreviewCards([card]));
  },
  onMouseEnter(id) {
    dispatch(InterfaceActions.cardHover(id));
  },
  onMouseLeave(id) {
    dispatch(InterfaceActions.cardHover(null));
  }
})
export default connect(mapStateToProps, mapDispatchToProps)(SocialEditableCard);
