import React from 'react';
import { connect } from 'react-redux';
import Optional from '../components/optional';
import _ from 'lodash';
import { chunkText, setDocumentTitle } from '../../utils';

import FileBrowserToolbar from './toolbar';
import CardWizard from './card_wizard';
import GoogleFonts from '../../utils/google_fonts';

class FileBrowser extends React.Component {

  componentDidMount() {
    setDocumentTitle('File Browser');

    // GoogleFonts.forEach(font => {
    //   let name = font.name.replace(/ /g, "+");
    //   let styles = [];
    //   font.styles.normal.forEach(weight => styles.push(`${weight * 100}`))
    //   font.styles.italic.forEach(weight => styles.push(`${weight * 100}italic`))
    //   console.log(`@import url(https://fonts.googleapis.com/css?family=${name}:${styles.join(",")});`)
    // })
  }

  componentWillUnmount() {

  }

  render() {

    return (
      <div className="file-browser">
        <FileBrowserToolbar />
        <CardWizard />
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  cards: [],
});
const mapDispatchToProps = (dispatch) => ({

})
export default connect(mapStateToProps, mapDispatchToProps)(FileBrowser);
