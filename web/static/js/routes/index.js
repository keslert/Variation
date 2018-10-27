//web/static/js/routes/index.js

import { IndexRoute, Route }  from 'react-router';
import React                  from 'react';
import MainLayout             from '../layouts/main';
import AuthenticatedContainer from '../containers/authenticated';
import HomeView               from '../views/home';
import FileBrowser            from '../views/file_browser';
import SocialApp              from '../views/social/social_app';

export default (

  <Route component={MainLayout}>
    <Route path="/app">
      <IndexRoute component={FileBrowser} />
      <Route path="social" component={SocialApp} />
    </Route>
  </Route>
);
