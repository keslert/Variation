import React from 'react';
import { connect } from 'react-redux';
import { routeActions } from 'react-router-redux';
import Toolbar from '../toolbar/toolbar';
import SocialCard from '../social/social_card';
import Scaled from '../components/scaled';
import { chunkText, getRandomImage }  from '../../utils';
import InterfaceActions from '../../actions/interface';
import BranchesActions from '../../actions/branches';
import PluginsActions from '../../actions/plugins';
import { debounce } from 'lodash';

import FontTransformPlugin          from '../../plugins/font_transform_plugin';
import FontSizePlugin               from '../../plugins/font_size_plugin';
import RowSplitterPlugin            from '../../plugins/row_splitter_plugin';
import FontPlugin                   from '../../plugins/font_plugin';
import RowHorizontalAlignmentPlugin from '../../plugins/row_horizontal_alignment_plugin';
import RowVerticalSpacingPlugin     from '../../plugins/row_vertical_spacing_plugin';
import BoxAlignmentPlugin           from '../../plugins/box_alignment_plugin';
import TextShadowPlugin             from '../../plugins/text_shadow_plugin';
import ImageFiltersPlugin           from '../../plugins/image_filters_plugin';

import ColorThief from '../../utils/color_thief';
import Color  from 'color';

class CardWizard extends React.Component {

  constructor() {
    super();
    this.state = {
      imageUrl: null,
      width: 600,
      height: 600,
    }
  }

  componentDidMount() {
    const { width, height, imageUrl } = this.props
    this.setState({width, height, imageUrl});
  }

  render() {

    const { text, author } = this.props;
    const { imageUrl, width, height } = this.state;

    const {
      setText,
      setImageUrl,
      setCardDimensions,
      createPlugins,
      registerPlugins,
      activatePlugins,
      createBranch,
      setActiveBranchId,
      routeTo,
    } = this.props;

    let card = {id: 0, meta: {}, custom: {}, chunks: [], style: {width, height}}
    let scale = 360 / card.style.width;
    return (
      <div className="card-wizard">
        <div className="card-wrapper">
          <Scaled width={card.style.width} height={card.style.height} scaledWidth={360}>
            <SocialCard {...card} url={imageUrl} />
          </Scaled>
        </div>

        <div className="form">
          <div className="form-group">
            <label>Image URL</label>
            <div className="input-group">
              <img className="hidden-image" src={imageUrl} ref="hiddenImage" crossOrigin="anonymous" />
              <input type="text" className="form-control" value={imageUrl} onChange={
                  (e) => this.setState({imageUrl: e.target.value})
                }/>
              <span className="input-group-btn">
                <button className="btn btn-default" type="button" onClick={
                      () => this.setState({imageUrl: getRandomImage()})
                    }>
                  Random
                </button>
              </span>
            </div>
          </div>
          <div className="form-group">
            <label>Text</label>
            <input type="text" ref="text" className="form-control" defaultValue={text} />
          </div>

          <div className="form-group">
            <label>Author</label>
            <input type="text" ref="author" className="form-control" defaultValue={author} />
          </div>

          <div className="form-group">
            <label>Width</label>
            <input type="number" className="form-control" defaultValue={width} onChange={
                (e) => this.setState({width: e.target.value})
              }/>
          </div>

          <div className="form-group">
            <label>Height</label>
            <input type="number" className="form-control" defaultValue={height} onChange={
                (e) => this.setState({height: e.target.value})
              }/>
          </div>

          <div className="btn btn-block btn-primary" onClick={() => {
              const text = this.refs.text.value;
              const author = this.refs.author.value;
              setText(text);
              // let palette = new ColorThief().getPalette(this.refs.hiddenImage, 5);
              // palette = palette.map(rgb => Color({r: rgb[0], g: rgb[1], b: rgb[2]}));

              const activated = [
                new RowSplitterPlugin(chunkText(text)),
                new FontPlugin(),
                new FontTransformPlugin(),
                new FontSizePlugin(),
                new RowHorizontalAlignmentPlugin(),
                new RowVerticalSpacingPlugin(),
                new BoxAlignmentPlugin(width, height),
              ]

              const optional = [
                new TextShadowPlugin(),
                new ImageFiltersPlugin(),
              ]

              setCardDimensions(width, height);
              setImageUrl(imageUrl);
              registerPlugins([...activated, ...optional]);

              createBranch(card);
              setActiveBranchId(card.id);
              activatePlugins(card.id, activated);
              routeTo('/app/social');
            }}>
            Start Designing
          </div>

        </div>
      </div>
    )
  }

}

CardWizard.defaultProps = {
  text: "If people sat outside and looked at the stars each night, I bet they would live a lot differently.",
  author: "-Joseph Chilton Pearce",
  imageUrl: 'https://unsplash.it/800/800?image=556',
  width: 600,
  height: 600,
}

const mapStatesToProps = (state) => ({
  // imageUrl: state.interface.imageUrl,
})
const mapDispatchToProps = (dispatch) => ({
  setText(text) {
    dispatch(InterfaceActions.setText(text))
  },
  setActiveBranchId(id) {
    dispatch(InterfaceActions.setActiveBranchId(id));
  },
  setImageUrl: debounce((url) => {
    dispatch(InterfaceActions.setImageUrl(url));
  }, 300),
  createBranch(card) {
    dispatch(BranchesActions.createBranch(card));
  },
  registerPlugins(plugins) {
    dispatch(PluginsActions.registerPlugins(plugins));
  },
  activatePlugins(branchId, plugins) {
    _.forEach(plugins, p => {
      dispatch(BranchesActions.setPluginActivation(branchId, p.name, true));
    })
  },
  routeTo(url) {
    dispatch(routeActions.push(url))
  },
  setCardDimensions(width, height) {
    dispatch(InterfaceActions.setCardDimensions(width, height))
  }
})
export default connect(mapStatesToProps, mapDispatchToProps)(CardWizard);
