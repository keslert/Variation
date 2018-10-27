import React                    from 'react';
import { connect }              from 'react-redux';
import classnames               from 'classnames';

import { setDocumentTitle }     from '../utils';

export default class HomeView extends React.Component {

  componentDidMount() {
    setDocumentTitle('Home');
  }

  render() {
    return (
      <div className="home-view">
        <h1>Home at last.</h1>
      </div>
    )
  }
}
