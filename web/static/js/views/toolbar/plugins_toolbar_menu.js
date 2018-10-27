import React from 'react';
import { connect } from 'react-redux';
import F from '../../constants/format';
import InterfaceActions from '../../actions/interface';
import BranchesActions from '../../actions/branches';
import Menu, {SubMenu, MenuItem} from 'rc-menu';

const PluginsToolbarMenu = ({
  plugins,
  branch,
  showPluginPercentages,
  toggleShowPercentages,
  setPluginActivation,
}) => {
  const optionalPlugins = _.pickBy(plugins, p => !p.permanent);
  const selectedKeys = [];

  showPluginPercentages && selectedKeys.push('percentages');
  _.forEach(optionalPlugins, p => {
    const key = F.pluginActivationKey(p.name);
    branch.registry[key] && selectedKeys.push(key);
  })


  return (
      <Menu mode="horizontal" openSubMenuOnMouseEnter={false}
            selectedKeys={selectedKeys}
            onClick={({key}) => {
              if(key.startsWith('plugin-')) {
                const name = key.split('-')[1];
                setPluginActivation(branch.id, name, !branch.registry[key]);
              } else if(key == 'percentages') {
                toggleShowPercentages();
              }
            }}>
        <SubMenu title="Plugins">

          <SubMenu title="Optional Plugins">
            {_.map(optionalPlugins, p => (
              <MenuItem key={F.pluginActivationKey(p.name)}>
                {p.name}
              </MenuItem>
            ))}
          </SubMenu>

          <MenuItem key="percentages">
            Show Percentages
          </MenuItem>

        </SubMenu>
      </Menu>
    )
}

const mapStateToProps = (state) => ({
  plugins: state.plugins,
  branch: state.branches[state.interface.activeBranchId],
  showPluginPercentages: state.interface.showPluginPercentages,
});

const mapDispatchToProps = (dispatch) => ({
  toggleShowPercentages() {
    dispatch(InterfaceActions.togglePluginPercentages());
  },
  setPluginActivation(id, name, activate) {
    dispatch(BranchesActions.setPluginActivation(id, name, activate))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(PluginsToolbarMenu);
