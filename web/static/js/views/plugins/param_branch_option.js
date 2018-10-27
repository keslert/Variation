import React from 'react';
import Switch from '../components/switch';
import CustomOption from './custom_option';
import Optional from '../components/optional';

class ParamBranchOption extends React.Component {

  render() {
    const { label, percent, toggle, custom, showPercentages } = this.props;
    return (
      <li className="plugin-param-option">
        <div className="row">
          <div className="name"><span>{label}</span></div>
          <Optional show={showPercentages}>
            <span className="percentage">{Math.round(percent)}%</span>
          </Optional>
          <Switch on={percent != 0} onClick={() => toggle()} />
        </div>
        { custom && <CustomOption {...this.props} /> }
      </li>
    )
  }
}

export default ParamBranchOption;
