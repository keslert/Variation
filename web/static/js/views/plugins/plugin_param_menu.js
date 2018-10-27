import React, { PropTypes }  from 'react';
import { connect }           from 'react-redux';
import { debounce }          from 'lodash'
import classnames            from 'classnames';
import BranchesActions       from '../../actions/branches';
import InterfaceActions      from '../../actions/interface';
import ParamBranchOption     from './param_branch_option';
import ParamCardOption       from './param_card_option';
import Optional              from '../components/optional';
import IconButton            from '../components/icon_button';
import { chunkText }         from '../../utils';
import { mutateCard }        from '../../utils/card_utils';

class PluginParamMenu extends React.Component {

  getPlugin() {
    const { plugin_name, plugins } = this.props;
    return plugins[plugin_name];
  }

  explore() {
    const { options, card, plugin_name, plugins, registry_key, previewCards, text, branch } = this.props;

    const custom = _.find(options, option => option.custom) || {};

    let _options = [];
    if(custom.options) {
      _options = _.map(custom.options, value => ({...custom, value}));
    } else if(custom.type == 'number') {
      _options = _.map(_.range((custom.max - custom.min) / custom.step), i => {
        const value = i * custom.step + custom.min;
        return {...custom, value}
      });
    }
    _options = [..._.filter(options, o => !o.custom), ..._options];
    _options.forEach(o => { o.pLabel = o.label + (o.custom ? `: ${o.value}` : '') })

    let cards = _options.map(custom_option => {
      const mutated = mutateCard(plugins, text, card, branch.registry, {[registry_key]: custom_option});
      return {...mutated, label: custom_option.pLabel};
    });
    cards = _.filter(cards, card => card.score < 500)
    previewCards(cards);
  }

  mutate(option) {
    const { registry_key, plugins, text, card, branch, previewCards } = this.props;
    previewCards([
      mutateCard(plugins, text, card, branch.registry, {[registry_key]: option})
    ]);
  }

  mutateInterfaceCards(option) {
    const { registry_key, plugins, text, interfaceCards, branch, pushCards } = this.props;
    pushCards(_.map(interfaceCards, card =>
      mutateCard(plugins, text, card, branch.registry, {}, {[`${registry_key}-${option.label}`]: true})
    ))
  }


  render() {
    const {
      card,
      registry_key,
      options,
      label,
      branch,
      setValue,
      mode,
      pushCards,
      showPercentages,
    } = this.props;

    const totalWeight = _.sum(options.map(option => (
      branch.registry[`${registry_key}-${option.label}`]
    )))

    return (
      <div className="plugin-param-menu">
        <div className="header param-header">
          <div className="name">{label}</div>
          <div className="plugin-btns">
            <Optional show={mode.edit}>
              <IconButton icon="bolt"
                className={classnames('plugin-btn', {active: true})}
                onClick={() => this.explore() }/>
            </Optional>
          </div>
        </div>
        <ul>
          {_.map(options, option => {
            const key = `${registry_key}-${option.label}`;
            const cKey = `custom-${registry_key}`;

            if(mode.edit) {
              return (
                <ParamCardOption label={option.label} key={key}
                    {...option}
                    selected={ card && !!card.meta[key] }
                    onSelect={ () => this.mutate(option) }
                    value={ card.custom[cKey] }
                    setValue={ (value) => { this.mutate({...option, value}) }} />
              )
            } else {
              return (
                <ParamBranchOption label={option.label} key={key}
                    {...option}
                    percent={ branch.registry[key] / totalWeight * 100 }
                    toggle={ () => {
                      const weight = branch.registry[key];
                      if(weight == 0) {
                        setValue(branch.id, key, 500);
                      } else if(weight != totalWeight) {
                        setValue(branch.id, key, 0);
                        this.mutateInterfaceCards(option);
                      }
                    }}
                    showPercentages={showPercentages}
                    mutate={ () => this.mutate(option) }
                    value={ branch.registry[cKey] }
                    setValue={ (value) => {
                      setValue(branch.id, cKey, value);
                    }} />
              )
            }
          })}
        </ul>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  mode: state.interface.mode,
  branch: state.branches[state.interface.activeBranchId],
  card: state.interface.previewCards[0],
  plugins: state.plugins,
  text: state.interface.text,
  interfaceCards: state.interface.cardsHistory[state.interface.cardsIndex] || [],
  showPercentages: state.interface.showPluginPercentages,
});
const mapDispatchToProps = (dispatch) => ({
  setValue: _.debounce((id, key, value) => {
    dispatch(BranchesActions.setBranchRegistryValue(id, key, value));
  }, 10),
  previewCards(cards) {
    dispatch(InterfaceActions.setPreviewCards(cards));
  },
  pushCards(cards) {
    dispatch(InterfaceActions.pushCards(cards));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(PluginParamMenu);
