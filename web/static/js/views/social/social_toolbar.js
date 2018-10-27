import React from 'react';
import Toolbar from '../toolbar/toolbar';
import SettingsMenu from '../toolbar/settings_menu';
import PluginsMenu from '../toolbar/plugins_toolbar_menu';
import ControlsToolbarItem from '../toolbar/controls_toolbar_item';

import Menu, {SubMenu} from 'rc-menu';

class SocialToolbar extends React.Component {

  render() {
    return (
      <Toolbar>
        <SettingsMenu />
        <PluginsMenu />
        <ControlsToolbarItem />
      </Toolbar>
    )
  }

}

export default SocialToolbar;
