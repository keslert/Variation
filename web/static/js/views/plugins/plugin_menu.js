import React, { PropTypes }  from 'react';
import { connect }           from 'react-redux';
import cn                    from 'classnames';
import Constants             from '../../constants';
import Optional              from '../components/optional';
import IconButton            from '../components/icon_button';
import PluginParamMenu       from './plugin_param_menu';
import PluginsActions        from '../../actions/plugins';
import InterfaceActions      from '../../actions/interface';
import BranchesActions       from '../../actions/branches';
import Tooltip               from 'rc-tooltip';

const PluginMenu = ({
  name,
  id,
  params,
  permanent,
  visible,
  mode,
  setVisible,
  setLocked,
  toggle,
  openedPluginMenu,
  branch,
  resetWeights,
  setWeight,
}) => {

  const locked = _.every(params, (param, key) => {
    const sum = _.sum(_.map(param.options, o =>
      branch.registry[`${name}-${key}-${o.label}`] > 0 ? 1 : 0
    ))
    return sum == 1;
  })

  const open = name == openedPluginMenu;


  return (
    <li className="panel plugin-menu">
      <div className="header plugin-header"onClick={() => toggle(name)}>
        <div className="name">
          <i className={cn('kt-caret', 'fa', open ? 'fa-caret-down' : 'fa-caret-right')}></i>
          {name}
        </div>

        <div className="plugin-btns">
          <Optional show={false}>
            <IconButton icon="eye"
                        className={cn('plugin-btn', {active: visible})}
                        onClick={(e) => {
                          e.stopPropagation();
                          setVisible(name, !visible)
                        }}
                        hover="Toggle Visible"/>
          </Optional>

          <Optional show={open && mode.explore}>
            <IconButton icon="undo"
                        className={cn('plugin-btn', 'active')}
                        onClick={(e) => {
                          e.stopPropagation();
                          resetWeights(branch.id, name)
                        }}
                        hover="Reset Probabilities" />
          </Optional>

          <Optional show={mode.explore}>
            <IconButton icon="lock"
                        className={cn('plugin-btn', {active: locked})}
                        onClick={(e) => {
                          e.stopPropagation();

                          _.forEach(params, (param, key) =>{
                            let majority = _.maxBy(param.options, option => (
                              branch.registry[`${name}-${key}-${option.label}`]
                            ))
                            _.forEach(param.options, option => {
                              if(option != majority) {
                                setWeight(branch.id, `${name}-${key}-${option.label}`, locked ? 500 : 0);
                              }
                            })
                          })
                        }}
                        hover={locked ? "Unlock" : "Lock On Majority"} />
          </Optional>
        </div>
      </div>

      <ul className={cn('param-list', {collapse: !open})}>
        {_.map(params, (param, key) => (
          <PluginParamMenu {...param} plugin_name={name} registry_key={`${name}-${key}`} key={key} />
        ))}
      </ul>
    </li>
  )
}

const mapStateToProps = (state) => ({
  mode: state.interface.mode,
  openedPluginMenu: state.interface.openedPluginMenu,
  branch: state.branches[state.interface.activeBranchId]
});
const mapDispatchToProps = (dispatch) => ({
  setVisible(name, visible) {
    dispatch(PluginsActions.setVisible(name, visible))
  },
  setLocked(name, locked) {
    dispatch(PluginsActions.setLocked(name, locked))
  },
  toggle(name) {
    dispatch(InterfaceActions.togglePluginMenu(name))
  },
  resetWeights(id, prefix) {
    dispatch(BranchesActions.resetBranchWeights(id, prefix));
  },
  setWeight(id, key, value) {
    dispatch(BranchesActions.setBranchRegistryValue(id, key, value));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(PluginMenu);
