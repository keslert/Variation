import React from 'react';
import Switch from '../components/switch';
import CustomOption from './custom_option';
import cn from 'classnames';

class ParamCardOption extends React.Component {

  render() {
    const { label, custom, selected, onSelect, customValue } = this.props;
    return (
      <li className="plugin-param-option">
        <div className="row">
          <div className="name"><span>{label}</span></div>
          <span className={cn('radio', {selected})} onClick={() => { onSelect()}}></span>
        </div>
        { custom && <CustomOption {...this.props} /> }
      </li>
    )
  }
}

export default ParamCardOption;
