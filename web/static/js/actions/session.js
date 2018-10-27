import { routeActions }       from 'react-router-redux';
import Constants              from '../constants';
import { Socket }             from 'phoenix';
import { httpGet, httpPost }  from '../utils';

let setCurrentUser = (dispatch, user) => {
  dispatch({
    type: Constants.CURRENT_USER,
    currentUser: user,
  });

  // const socket = new Socket('/socket', {
  //   params: { token: localStorage.getItem('phoenixAuthToken') },
  //   logger: (kind, msg, data) => { console.log(`${kind}: ${msg}`, data); },
  // });
  //
  // socket.connect();
};

const Actions = {

  currentUser: () => {
    return dispatch => {
      httpGet('/api/v1/current_user')
      .then(function(data) {
        setCurrentUser(dispatch, data);
      })
      .catch(function(error) {
        console.log(error);
        // dispatch(routeActions.push('/users/login'));
      });
    };
  },

};

export default Actions;
