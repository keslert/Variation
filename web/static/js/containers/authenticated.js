import React            from 'react';
import { connect }      from 'react-redux';
import SessionActions   from '../actions/session';
import { routeActions } from 'react-router-redux';

class AuthenticatedContainer extends React.Component {
  componentDidMount() {
    const { dispatch, currentUser } = this.props;

    let token = $('meta[name="guardian_token"]').attr('content');
    localStorage.setItem('phoenixAuthToken', token);

    if (localStorage.getItem('phoenixAuthToken')) {
      if (!currentUser) {
        dispatch(SessionActions.currentUser());
      }
    } else {
      dispatch(routeActions.push('/users/login'));
    }
  }

  render() {
    const {currentUser} = this.props;

    if (!currentUser) return false;

    return (
      <div id="authentication_container" className="application-container">
        <div className='main-container'>
          {this.props.children}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  currentUser: state.session.currentUser,
});

export default connect(mapStateToProps)(AuthenticatedContainer);;
