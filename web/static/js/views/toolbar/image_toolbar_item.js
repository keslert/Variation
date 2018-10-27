import React       from 'react';
import { connect } from 'react-redux';
import classnames  from 'classnames';
import ToolbarItem from './toolbar_item';
import TextButton  from '../components/text_button';
import Actions     from '../../actions/interface';

class ImageToolbarItem extends React.Component {

  render() {

    const {buttons, setImageUrl, imageUrl} = this.props;

    return (
      <ToolbarItem label="Image" icon="picture-o">
        <div className="btn-group">
          <TextButton text="Change" onClick={() => {

              vex.dialog.open({
                message: 'Enter an image url:',
                input: `<input name="url" class="form-control" value="${imageUrl}" />`,
                buttons: [
                  $.extend({}, vex.dialog.buttons.YES, {
                    text: 'Save'
                  }), $.extend({}, vex.dialog.buttons.NO, {
                    text: 'Cancel'
                  })
                ],
                callback: (data) => {
                  data && setImageUrl(data.url)
                }
              })
            }} />
        </div>
      </ToolbarItem>
    )
  }
}

const mapStateToProps = (state) => ({
  imageUrl: state.interface.imageUrl
});

const mapDispatchToProps = (dispatch) => ({
  setImageUrl(url) {
    dispatch(Actions.setImageUrl(url));
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(ImageToolbarItem);
