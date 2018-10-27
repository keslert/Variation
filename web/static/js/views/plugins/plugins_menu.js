import React, { PropTypes }  from 'react';
import { connect }           from 'react-redux';
import F from '../../constants/format';
import classnames            from 'classnames';
import PluginMenu            from './plugin_menu';
import { map }               from 'lodash';

class PluginsMenu extends React.Component {
  render() {
    const { plugins, branch, mode } = this.props;

    let header = "Design Settings"
    let _plugins = _.pickBy(plugins, p =>
      branch.registry[F.pluginActivationKey(p.name)]
    )
    if(mode.preview) {
      _plugins = [];
      header = "Preview Settings";
    } else if(mode.edit) {
      header = "Card Settings";
    }

    return (
      <div className="plugins-menu">
        <div className="header plugins-header">{header}</div>
        <ul className="nav nav-stacked" id="plugins-toolbar">
          {map(_plugins, (plugin, index) => (
            <PluginMenu {...plugin} key={`plugin-${index}`} />
          ))}
        </ul>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  plugins: state.plugins,
  mode: state.interface.mode,
  branch: state.branches[state.interface.activeBranchId],
});

export default connect(mapStateToProps)(PluginsMenu);
